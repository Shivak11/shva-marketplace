#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: validate-book-foundation.mjs <book-foundation-record.json>");
  process.exit(2);
}

let record;
try {
  record = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`INVALID JSON: ${error.message}`);
  process.exit(2);
}

const errors = [];
const isNonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const nonEmptyArray = (value) => Array.isArray(value) && value.length > 0;
const requireValue = (condition, message) => {
  if (!condition) errors.push(message);
};

const proposition = record?.proposition ?? {};
const architecture = record?.architecture ?? {};
const author = record?.authorAndFrontMatter ?? {};
const voice = record?.voiceContract ?? {};
const visual = record?.visualIdentity ?? {};
const exercise = record?.exerciseDirection ?? {};
const openItems = record?.openItems ?? {};
const approval = record?.approval ?? {};

requireValue(record?.status === "approved", "status must be approved before production");
requireValue(isNonEmpty(record?.projectAndScope), "projectAndScope is required");

for (const field of ["bookReader", "participantAudience", "assumedKnowledgeBySurface", "recognisedProblem", "promisedChange", "centralArgument", "boundary", "evidenceBase"]) {
  requireValue(isNonEmpty(proposition[field]), `proposition.${field} is required`);
}

for (const field of ["carriedQuestionOrArtifact", "sectionLogic", "chapterPromises", "openingMode", "programmeTablePlacement"]) {
  requireValue(isNonEmpty(architecture[field]), `architecture.${field} is required`);
}

requireValue(Array.isArray(record?.titleSystems) && record.titleSystems.length >= 2, "at least two materially different titleSystems are required");
for (const [index, system] of (record?.titleSystems ?? []).entries()) {
  for (const field of ["name", "title", "subtitle", "promise", "tradeOff", "coverConnection"]) {
    requireValue(isNonEmpty(system?.[field]), `titleSystems[${index}].${field} is required`);
  }
}
requireValue(isNonEmpty(record?.selectedTitleSystem), "selectedTitleSystem is required");
requireValue(
  (record?.titleSystems ?? []).some((system) => system?.name === record?.selectedTitleSystem),
  "selectedTitleSystem must name one supplied title system",
);

requireValue(nonEmptyArray(author.selectedOrder), "authorAndFrontMatter.selectedOrder is required");
requireValue(isNonEmpty(author.authorNoteJob), "authorAndFrontMatter.authorNoteJob is required");
requireValue(Array.isArray(author.authorNoteFacts), "authorAndFrontMatter.authorNoteFacts must be an array");
requireValue(Array.isArray(author.acknowledgements), "authorAndFrontMatter.acknowledgements must be an array, even when empty");
requireValue(Array.isArray(author.approvedLinks), "authorAndFrontMatter.approvedLinks must be an array");
requireValue(isNonEmpty(author.sourceBoundary), "authorAndFrontMatter.sourceBoundary is required");

for (const field of ["paragraphMovement", "exampleStandard", "densityAndHumour", "vocabularyPolicy", "emphasisPolicy"]) {
  requireValue(isNonEmpty(voice[field]), `voiceContract.${field} is required`);
}
requireValue(nonEmptyArray(voice.positiveMechanics), "voiceContract.positiveMechanics is required");
requireValue(nonEmptyArray(voice.antiRegister), "voiceContract.antiRegister is required");

requireValue(Array.isArray(visual?.directions) && visual.directions.length >= 2, "at least two materially different visualIdentity.directions are required");
for (const [index, direction] of (visual?.directions ?? []).entries()) {
  for (const field of ["name", "premiseConnection", "composition", "paletteRoles", "typographyMood", "figureGrammar", "prohibitedMotifs", "differenceFromRecentWork"]) {
    requireValue(isNonEmpty(direction?.[field]), `visualIdentity.directions[${index}].${field} is required`);
  }
}
requireValue(isNonEmpty(visual.selectedDirection), "visualIdentity.selectedDirection is required");
requireValue(
  (visual.directions ?? []).some((direction) => direction?.name === visual.selectedDirection),
  "visualIdentity.selectedDirection must name one supplied direction",
);

for (const field of ["format", "caseMode", "observableArtifact", "commitmentRule", "revealRule", "workedComparisonJob"]) {
  requireValue(isNonEmpty(exercise[field]), `exerciseDirection.${field} is required`);
}

requireValue(Array.isArray(openItems.blocking), "openItems.blocking must be an array");
requireValue((openItems.blocking ?? []).length === 0, "openItems.blocking must be empty before production");
requireValue(Array.isArray(openItems.deferred), "openItems.deferred must be an array");
requireValue(isNonEmpty(approval.approvedBy), "approval.approvedBy is required");
requireValue(/^\d{4}-\d{2}-\d{2}$/.test(approval.approvedOn ?? ""), "approval.approvedOn must be YYYY-MM-DD");
requireValue(isNonEmpty(approval.evidence), "approval.evidence is required");

if (errors.length > 0) {
  console.error(`FAIL ${path.basename(inputPath)} (${errors.length} errors)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS ${path.basename(inputPath)}`);
console.log(`- approved for ${proposition.bookReader}`);
console.log(`- ${record.titleSystems.length} title systems and ${visual.directions.length} visual directions considered`);
console.log(`- ${openItems.deferred.length} deliberately deferred item(s), no blocking items`);
