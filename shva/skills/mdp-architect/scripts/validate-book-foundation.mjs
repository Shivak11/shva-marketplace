#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
const requestedScope = process.argv[3] ?? "prose";

if (!inputPath) {
  console.error("Usage: validate-book-foundation.mjs <book-foundation-record.json> [prose|front-matter|visual-production|full]");
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
const normalise = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const distinctFingerprints = (items, fields) => new Set(
  (items ?? []).map((item) => fields.map((field) => normalise(item?.[field])).join("|")),
).size;
const requireValue = (condition, message) => {
  if (!condition) errors.push(message);
};
const allowedScopes = new Set(["prose", "front-matter", "visual-production", "full"]);

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
requireValue(allowedScopes.has(requestedScope), "requested scope must be prose, front-matter, visual-production, or full");

const declaredScopes = Array.isArray(approval.scopes) ? approval.scopes : [];
requireValue(nonEmptyArray(declaredScopes), "approval.scopes must not be empty");
requireValue(declaredScopes.every((scope) => allowedScopes.has(scope)), "approval.scopes contains an unsupported scope");
const scopeIsApproved = (scope) => declaredScopes.includes("full") || declaredScopes.includes(scope);
requireValue(scopeIsApproved(requestedScope), `approval.scopes does not approve requested '${requestedScope}' work`);
const needsFrontMatter = requestedScope === "full" || requestedScope === "front-matter";
const needsVisualProduction = requestedScope === "full" || requestedScope === "visual-production";

for (const field of ["bookReader", "participantAudience", "assumedKnowledgeBySurface", "recognisedProblem", "promisedChange", "centralArgument", "boundary", "evidenceBase"]) {
  requireValue(isNonEmpty(proposition[field]), `proposition.${field} is required`);
}

for (const field of ["carriedQuestionOrArtifact", "sectionLogic", "chapterPromises", "openingMode", "programmeTablePlacement"]) {
  requireValue(isNonEmpty(architecture[field]), `architecture.${field} is required`);
}

if (needsFrontMatter) {
  requireValue(Array.isArray(record?.titleSystems) && record.titleSystems.length >= 2, "at least two materially different titleSystems are required for front-matter work");
  for (const [index, system] of (record?.titleSystems ?? []).entries()) {
    for (const field of ["name", "title", "subtitle", "promise", "tradeOff", "coverConnection"]) {
      requireValue(isNonEmpty(system?.[field]), `titleSystems[${index}].${field} is required`);
    }
  }
  requireValue(
    distinctFingerprints(record?.titleSystems, ["title", "subtitle", "promise", "coverConnection"]) >= 2,
    "titleSystems must be materially different beyond their names",
  );
  requireValue(isNonEmpty(record?.selectedTitleSystem), "selectedTitleSystem is required");
  requireValue(
    (record?.titleSystems ?? []).some((system) => system?.name === record?.selectedTitleSystem),
    "selectedTitleSystem must name one supplied title system",
  );
}

if (needsFrontMatter) {
  requireValue(nonEmptyArray(author.selectedOrder), "authorAndFrontMatter.selectedOrder is required");
  requireValue(isNonEmpty(author.authorNoteJob), "authorAndFrontMatter.authorNoteJob is required");
  requireValue(Array.isArray(author.authorNoteFacts), "authorAndFrontMatter.authorNoteFacts must be an array");
  requireValue(Array.isArray(author.acknowledgements), "authorAndFrontMatter.acknowledgements must be an array, even when empty");
  requireValue(Array.isArray(author.approvedLinks), "authorAndFrontMatter.approvedLinks must be an array");
  requireValue(isNonEmpty(author.sourceBoundary), "authorAndFrontMatter.sourceBoundary is required");
}

for (const field of ["paragraphMovement", "exampleStandard", "densityAndHumour", "vocabularyPolicy", "emphasisPolicy"]) {
  requireValue(isNonEmpty(voice[field]), `voiceContract.${field} is required`);
}
requireValue(nonEmptyArray(voice.positiveMechanics), "voiceContract.positiveMechanics is required");
requireValue(nonEmptyArray(voice.antiRegister), "voiceContract.antiRegister is required");

if (needsVisualProduction) {
  requireValue(Array.isArray(visual?.directions) && visual.directions.length >= 2, "at least two materially different visualIdentity.directions are required for visual production");
  for (const [index, direction] of (visual?.directions ?? []).entries()) {
    for (const field of ["name", "premiseConnection", "composition", "paletteRoles", "typographyMood", "figureGrammar", "prohibitedMotifs", "differenceFromRecentWork"]) {
      requireValue(isNonEmpty(direction?.[field]), `visualIdentity.directions[${index}].${field} is required`);
    }
  }
  requireValue(
    distinctFingerprints(visual?.directions, ["premiseConnection", "composition", "paletteRoles", "typographyMood", "figureGrammar", "differenceFromRecentWork"]) >= 2,
    "visualIdentity.directions must be materially different beyond their names",
  );
  requireValue(isNonEmpty(visual.selectedDirection), "visualIdentity.selectedDirection is required");
  requireValue(
    (visual.directions ?? []).some((direction) => direction?.name === visual.selectedDirection),
    "visualIdentity.selectedDirection must name one supplied direction",
  );
}

for (const field of ["format", "caseMode", "observableArtifact", "commitmentRule", "revealRule", "workedComparisonJob"]) {
  requireValue(isNonEmpty(exercise[field]), `exerciseDirection.${field} is required`);
}

requireValue(Array.isArray(openItems.blocking), "openItems.blocking must be an array");
requireValue(Array.isArray(openItems.deferred), "openItems.deferred must be an array");
for (const [index, item] of (openItems.blocking ?? []).entries()) {
  requireValue(isNonEmpty(item?.field), `openItems.blocking[${index}].field is required`);
  requireValue(nonEmptyArray(item?.blocksScopes), `openItems.blocking[${index}].blocksScopes must not be empty`);
  requireValue(isNonEmpty(item?.reason), `openItems.blocking[${index}].reason is required`);
}
for (const [index, item] of (openItems.deferred ?? []).entries()) {
  requireValue(isNonEmpty(item?.field), `openItems.deferred[${index}].field is required`);
  requireValue(Array.isArray(item?.blocksScopes), `openItems.deferred[${index}].blocksScopes must be an array`);
  requireValue(isNonEmpty(item?.reason), `openItems.deferred[${index}].reason is required`);
}
const requestedScopeIsBlocked = (openItems.blocking ?? []).some((item) =>
  (item?.blocksScopes ?? []).includes("full")
    || (item?.blocksScopes ?? []).includes(requestedScope)
    || (requestedScope === "full" && (item?.blocksScopes ?? []).length > 0));
requireValue(!requestedScopeIsBlocked, `openItems.blocking contains an item that blocks requested '${requestedScope}' work`);
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
console.log(`- requested scope '${requestedScope}' is covered by approval scopes: ${declaredScopes.join(", ")}`);
console.log(`- ${record.titleSystems?.length ?? 0} title systems and ${visual.directions?.length ?? 0} visual directions recorded`);
console.log(`- ${openItems.deferred.length} deliberately deferred item(s); no blocker applies to '${requestedScope}'`);
