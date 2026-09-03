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
const sessionValidator = path.join(scriptDir, "validate-session-model.mjs");
const foundationValidator = path.join(scriptDir, "validate-book-foundation.mjs");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdp-architect-contracts-"));
const clone = (value) => JSON.parse(JSON.stringify(value));

function run(validator, fixturePath) {
  return spawnSync(process.execPath, [validator, fixturePath], { encoding: "utf8" });
}

function expectPass(label, validator, fixturePath) {
  const result = run(validator, fixturePath);
  assert.equal(result.status, 0, `${label} should pass\n${result.stderr}${result.stdout}`);
  console.log(`PASS ${label}`);
}

function expectFailure(label, validator, fixturePath, expectedText) {
  const result = run(validator, fixturePath);
  assert.notEqual(result.status, 0, `${label} should fail`);
  assert.match(`${result.stderr}${result.stdout}`, new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} should fail for '${expectedText}'`);
  console.log(`PASS ${label} rejects ${expectedText}`);
}

function writeMutation(label, model) {
  const fixturePath = path.join(tempDir, `${label}.json`);
  fs.writeFileSync(fixturePath, `${JSON.stringify(model, null, 2)}\n`);
  return fixturePath;
}

try {
  const approvedFoundation = path.join(fixturesDir, "book-foundation.approved.json");
  const draftFoundation = path.join(fixturesDir, "book-foundation.draft.json");
  const validSessionPath = path.join(fixturesDir, "who-owns-the-exception.valid.json");
  const broadInvalidPath = path.join(fixturesDir, "who-owns-the-exception.invalid.json");
  const validSession = JSON.parse(fs.readFileSync(validSessionPath, "utf8"));

  expectPass("approved book foundation", foundationValidator, approvedFoundation);
  expectFailure("draft book foundation", foundationValidator, draftFoundation, "status must be approved before production");
  expectPass("valid session model", sessionValidator, validSessionPath);
  expectFailure("broad invalid session model", sessionValidator, broadInvalidPath, "must commit before AI");

  const noVisual = clone(validSession);
  noVisual.session.surfaces.book.visuals = [];
  expectPass("zero-visual chapter", sessionValidator, writeMutation("zero-visual", noVisual));

  const thirdVisual = clone(validSession);
  const sourceVisual = thirdVisual.session.surfaces.book.visuals[0];
  thirdVisual.session.surfaces.book.visuals.push(
    { ...sourceVisual, id: "second-substantive-visual" },
    { ...sourceVisual, id: "third-substantive-visual" },
  );
  expectFailure("third substantive visual", sessionValidator, writeMutation("third-visual", thirdVisual), "book.visuals must contain 0 to 2 substantive visuals");

  const ungatedReveal = clone(validSession);
  ungatedReveal.session.exercises[0].revealGate.requiresParticipantInput = false;
  expectFailure("ungated answer reveal", sessionValidator, writeMutation("ungated-reveal", ungatedReveal), "reveal gate must require participant input");

  const mismatchedFilledEdition = clone(validSession);
  mismatchedFilledEdition.session.exercises[0].filledEdition.fields.pop();
  expectFailure("mismatched filled edition", sessionValidator, writeMutation("mismatched-filled-edition", mismatchedFilledEdition), "filled-edition fields must match participant fields in order");

  const disconnectedExercise = clone(validSession);
  disconnectedExercise.session.exercises[0].chapterConnection = "";
  expectFailure("disconnected exercise", sessionValidator, writeMutation("disconnected-exercise", disconnectedExercise), "chapterConnection is required");

  const aiFirst = clone(validSession);
  const bookOrder = aiFirst.session.surfaces.book.semanticBlockIds;
  const commitmentIndex = bookOrder.indexOf("commitment-first-map");
  const challengeIndex = bookOrder.indexOf("ai-challenge-map");
  [bookOrder[commitmentIndex], bookOrder[challengeIndex]] = [bookOrder[challengeIndex], bookOrder[commitmentIndex]];
  expectFailure("AI before commitment", sessionValidator, writeMutation("ai-before-commitment", aiFirst), "book must preserve commitment -> AI challenge -> revision");

  const termBeforeProblem = clone(validSession);
  const termOrder = termBeforeProblem.session.surfaces.book.semanticBlockIds;
  const problem = termOrder.splice(termOrder.indexOf("case-return-to-work"), 1)[0];
  termOrder.splice(termOrder.indexOf("claim-exception") + 1, 0, problem);
  expectFailure("definition before earned problem", sessionValidator, writeMutation("term-before-problem", termBeforeProblem), "problem -> definition -> reuse for term 'exception authority'");

  const collapsedComparison = clone(validSession);
  collapsedComparison.session.evidenceComparisons.push({
    leftBlockId: "case-return-to-work",
    rightBlockId: "lateral-port-drill",
    commonProblem: "Both require an exception",
    differentMechanisms: "",
    decisionConsequence: "Authority cannot remain implicit"
  });
  expectFailure("collapsed evidence mechanisms", sessionValidator, writeMutation("collapsed-comparison", collapsedComparison), "differentMechanisms is required");

  const declaredSlideCompression = clone(validSession);
  declaredSlideCompression.session.surfaces.slides.semanticBlockIds = declaredSlideCompression.session.surfaces.slides.semanticBlockIds.filter((id) => id !== "lateral-port-drill");
  declaredSlideCompression.session.surfaces.slides.beats = declaredSlideCompression.session.surfaces.slides.beats.filter((beat) => beat.id !== "lateral");
  declaredSlideCompression.session.sourceLedger.find((entry) => entry.claimId === "lateral-port-drill").surfaces = ["book", "teaching"];
  expectPass("declared slide compression", sessionValidator, writeMutation("declared-slide-compression", declaredSlideCompression));

  console.log("PASS all MDP Architect contract tests");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
