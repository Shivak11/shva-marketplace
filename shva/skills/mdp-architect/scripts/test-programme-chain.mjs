#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.dirname(scriptDir);
const fixturesDir = path.join(skillDir, "fixtures");
const validator = path.join(scriptDir, "validate-programme-chain.mjs");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdp-architect-chain-"));
const fixture = (name) => path.join(fixturesDir, name);
const clone = (value) => JSON.parse(JSON.stringify(value));
const read = (name) => JSON.parse(fs.readFileSync(fixture(name), "utf8"));

function run(thesis, foundation = "-", session = "-", scope = "full") {
  return spawnSync(process.execPath, [validator, thesis, foundation, session, scope], { encoding: "utf8" });
}

function expectPass(label, thesis, foundation = "-", session = "-", scope = "full") {
  const result = run(thesis, foundation, session, scope);
  assert.equal(result.status, 0, `${label} should pass\n${result.stderr}${result.stdout}`);
  console.log(`PASS ${label}`);
}

function expectFailure(label, thesis, foundation, session, expectedText, scope = "full") {
  const result = run(thesis, foundation, session, scope);
  assert.notEqual(result.status, 0, `${label} should fail`);
  assert.match(`${result.stderr}${result.stdout}`, new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} should fail for '${expectedText}'`);
  console.log(`PASS ${label} rejects ${expectedText}`);
}

function writeMutation(label, value) {
  const filePath = path.join(tempDir, `${label}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
  return filePath;
}

try {
  const bookThesis = fixture("programme-thesis.book-shaped.json");
  const linkedFoundation = fixture("book-foundation.linked.approved.json");
  const leadershipThesis = fixture("programme-thesis.non-ai-leadership.json");
  const leadershipSession = fixture("non-ai-leadership.valid.json");

  expectPass("book chain with exact foundation import", bookThesis, linkedFoundation);
  expectPass("non-book chain without book-only gate", leadershipThesis, "-", leadershipSession);
  expectPass("architecture chain before a session exists", leadershipThesis, "-", "-", "architecture");

  expectFailure(
    "book identifier without actual foundation file",
    bookThesis,
    "-",
    "-",
    "requires the actual Book Foundation Record",
  );

  const legacyFoundation = clone(read("book-foundation.linked.approved.json"));
  delete legacyFoundation.recordId;
  delete legacyFoundation.programmeThesisLink;
  delete legacyFoundation.proposition.centralQuestion;
  expectFailure(
    "legacy foundation needs migration before a new programme chain",
    bookThesis,
    writeMutation("legacy-foundation", legacyFoundation),
    "-",
    "must contain a programmeThesisLink import",
  );
  expectFailure(
    "workshop with a book-only record",
    leadershipThesis,
    linkedFoundation,
    "-",
    "non-book work must not introduce a Book Foundation Record",
  );

  const mismatchedFoundation = clone(read("book-foundation.linked.approved.json"));
  mismatchedFoundation.programmeThesisLink.recognisedProblem = "A different book problem was introduced after the thesis approval.";
  mismatchedFoundation.proposition.recognisedProblem = mismatchedFoundation.programmeThesisLink.recognisedProblem;
  expectFailure(
    "book foundation drifts from approved problem",
    bookThesis,
    writeMutation("mismatched-foundation", mismatchedFoundation),
    "-",
    "recognisedProblem must exactly match",
  );

  const mismatchedFoundationId = clone(read("book-foundation.linked.approved.json"));
  mismatchedFoundationId.recordId = "book-foundation-other-heat";
  expectFailure(
    "book thesis names a different foundation",
    bookThesis,
    writeMutation("mismatched-foundation-id", mismatchedFoundationId),
    "-",
    "recordId must match productionDecision.bookFoundation.record",
  );

  const mismatchedStage = clone(read("non-ai-leadership.valid.json"));
  mismatchedStage.session.programmeThesisLink.capabilityStageId = "stage-leadership-missing";
  expectFailure(
    "session cites an unknown capability stage",
    leadershipThesis,
    "-",
    writeMutation("mismatched-stage", mismatchedStage),
    "capabilityStageId must resolve",
  );

  const mismatchedProof = clone(read("non-ai-leadership.valid.json"));
  mismatchedProof.session.programmeThesisLink.capabilityProofId = "proof-leadership-conflict-map";
  expectFailure(
    "session cites a proof from another stage",
    leadershipThesis,
    "-",
    writeMutation("mismatched-proof", mismatchedProof),
    "capabilityProofId must resolve to the proof owned by its capability stage",
  );

  const linkedSessionWithoutAiDeclaration = clone(read("non-ai-leadership.valid.json"));
  delete linkedSessionWithoutAiDeclaration.session.aiUse;
  expectFailure(
    "new linked session cannot claim legacy AI defaults",
    leadershipThesis,
    "-",
    writeMutation("linked-session-no-ai-declaration", linkedSessionWithoutAiDeclaration),
    "must explicitly declare session.aiUse.present",
  );

  const legacySession = read("who-owns-the-exception.valid.json");
  expectFailure(
    "legacy session without thesis trace in programme chain",
    leadershipThesis,
    "-",
    writeMutation("legacy-session", legacySession),
    "must contain programmeThesisLink",
  );

  console.log("PASS programme-chain contract suite");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
