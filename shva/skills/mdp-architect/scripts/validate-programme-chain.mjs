#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [thesisPath, foundationPath, sessionPath, requestedScope = "full"] = process.argv.slice(2);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const thesisValidator = path.join(scriptDir, "validate-programme-thesis.mjs");
const foundationValidator = path.join(scriptDir, "validate-book-foundation.mjs");
const sessionValidator = path.join(scriptDir, "validate-session-model.mjs");
const allowedScopes = new Set(["architecture", "session-production", "artifact-production", "full"]);

if (!thesisPath || foundationPath === undefined || sessionPath === undefined) {
  console.error("Usage: validate-programme-chain.mjs <programme-thesis.json> <book-foundation.json|-> <session-model.json|-> [architecture|session-production|artifact-production|full]");
  process.exit(2);
}

const errors = [];
const isPlainRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${label} could not be read as JSON: ${error.message}`);
    return null;
  }
}

function runValidator(validator, args, label) {
  const result = spawnSync(process.execPath, [validator, ...args], { encoding: "utf8" });
  if (result.status !== 0) {
    const detail = `${result.stderr}${result.stdout}`.trim();
    errors.push(`${label} failed${detail ? `:\n${detail}` : ""}`);
  }
}

function requireValue(condition, message) {
  if (!condition) errors.push(message);
}

requireValue(allowedScopes.has(requestedScope), "requested scope must be architecture, session-production, artifact-production, or full");
runValidator(thesisValidator, [thesisPath, requestedScope], "Programme Thesis validation");
const thesis = readJson(thesisPath, "Programme Thesis Record");

if (thesis) {
  const isBook = thesis?.programme?.format === "book";
  if (isBook) {
    requireValue(foundationPath !== "-", "book-shaped work requires the actual Book Foundation Record, not only its identifier");
    if (foundationPath !== "-") {
      const foundationScope = requestedScope === "architecture" || requestedScope === "session-production"
        ? "prose"
        : "full";
      runValidator(foundationValidator, [foundationPath, foundationScope], "Book Foundation validation");
      const foundation = readJson(foundationPath, "Book Foundation Record");
      if (foundation) {
        const link = foundation.programmeThesisLink;
        requireValue(
          foundation.recordId === thesis?.productionDecision?.bookFoundation?.record,
          "Book Foundation recordId must match productionDecision.bookFoundation.record",
        );
        requireValue(isPlainRecord(link), "Book Foundation must contain a programmeThesisLink import");
        if (isPlainRecord(link)) {
          const comparisons = [
            ["recordId", thesis.recordId],
            ["recognisedProblem", thesis?.thesis?.recognisedProblem],
            ["promisedLearnerChangeId", thesis?.thesis?.promisedLearnerChangeId],
            ["promisedLearnerChange", thesis?.thesis?.promisedLearnerChange],
            ["centralQuestion", thesis?.thesis?.centralQuestion],
            ["distinctiveArgument", thesis?.thesis?.distinctiveArgument],
            ["argumentBoundary", thesis?.thesis?.argumentBoundary],
            ["outOfScope", thesis?.exclusions?.outOfScope],
            ["antiGoals", thesis?.exclusions?.antiGoals],
          ];
          for (const [field, expected] of comparisons) {
            requireValue(
              exact(link[field], expected),
              `Book Foundation programmeThesisLink.${field} must exactly match the approved Programme Thesis Record`,
            );
          }
        }
      }
    }
  } else {
    requireValue(foundationPath === "-", "non-book work must not introduce a Book Foundation Record");
  }

  if (sessionPath !== "-") {
    runValidator(sessionValidator, [sessionPath], "Session model validation");
    const sessionModel = readJson(sessionPath, "Session model");
    if (sessionModel) {
      const link = sessionModel?.session?.programmeThesisLink;
      requireValue(isPlainRecord(link), "Session model must contain programmeThesisLink for programme-chain verification");
      if (isPlainRecord(link)) {
        requireValue(link.recordId === thesis.recordId, "session programmeThesisLink.recordId must resolve to the Programme Thesis Record");
        requireValue(
          link.promisedLearnerChangeId === thesis?.thesis?.promisedLearnerChangeId,
          "session programmeThesisLink.promisedLearnerChangeId must resolve to the programme promise",
        );
        requireValue(
          link.carriedProofId === thesis?.carriedProof?.carriedProofId,
          "session programmeThesisLink.carriedProofId must resolve to the programme carried proof",
        );
        const stages = Array.isArray(thesis?.capabilityProgression) ? thesis.capabilityProgression : [];
        const stage = stages.find((item) => item?.stageId === link.capabilityStageId);
        requireValue(Boolean(stage), "session programmeThesisLink.capabilityStageId must resolve to a capability progression stage");
        if (stage) {
          requireValue(
            link.capabilityProofId === stage.proofId,
            "session programmeThesisLink.capabilityProofId must resolve to the proof owned by its capability stage",
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`FAIL programme chain (${errors.length} errors)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS programme chain for '${requestedScope}'`);
console.log(`- Programme Thesis: ${thesis.recordId}`);
console.log(`- Book Foundation: ${foundationPath === "-" ? "not applicable" : foundationPath}`);
console.log(`- Session model: ${sessionPath === "-" ? "not supplied" : sessionPath}`);
