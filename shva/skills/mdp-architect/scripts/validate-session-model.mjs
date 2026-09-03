#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: validate-session-model.mjs <session-model.json>");
  process.exit(2);
}

let model;
try {
  model = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`INVALID JSON: ${error.message}`);
  process.exit(2);
}

const errors = [];
const isNonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const sumMinutes = (items) =>
  Array.isArray(items)
    ? items.reduce((total, item) => total + (Number(item?.minutes) || 0), 0)
    : 0;
const duplicateValues = (values) =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const orderedUnique = (values) =>
  values.filter((value, index) => values.indexOf(value) === index);

function requireValue(condition, message) {
  if (!condition) errors.push(message);
}

const programme = model?.programme ?? {};
const session = model?.session ?? {};
const semanticBlocks = Array.isArray(session.semanticBlocks) ? session.semanticBlocks : [];
const blockIds = semanticBlocks.map((block) => block?.id).filter(Boolean);
const blockIdSet = new Set(blockIds);
const allowedSourceClasses = new Set([
  "observed",
  "source-backed",
  "teaching-synthesis",
  "illustrative",
  "still-to-confirm",
]);
const requiredBlockTypes = [
  "disturbance",
  "case",
  "claim",
  "mechanism",
  "commitment",
  "ai-challenge",
  "revision",
  "exercise",
  "transition",
];
const allowedBlockTypes = new Set([...requiredBlockTypes, "lateral-example"]);
const visibleSurfaceNames = ["book", "teaching", "slides"];

requireValue(isNonEmpty(programme.title), "programme.title is required");
requireValue(Number(programme.officialSessionMinutes) > 0, "programme.officialSessionMinutes must be positive");
requireValue(Number(programme.preparedRunwayMinutes) > 0, "programme.preparedRunwayMinutes must be positive");
requireValue(isNonEmpty(session.title), "session.title is required");
requireValue(isNonEmpty(session.audience), "session.audience is required");
requireValue(isNonEmpty(session.centralQuestion), "session.centralQuestion is required");
requireValue(isNonEmpty(session.carriedArtifact), "session.carriedArtifact is required");
requireValue(isNonEmpty(session.nextQuestion), "session.nextQuestion is required");
requireValue(semanticBlocks.length > 0, "session.semanticBlocks must not be empty");
requireValue(duplicateValues(blockIds).length === 0, "semantic block ids must be unique");

for (const [index, block] of semanticBlocks.entries()) {
  requireValue(isNonEmpty(block?.id), `semanticBlocks[${index}].id is required`);
  requireValue(allowedBlockTypes.has(block?.type), `semanticBlocks[${index}].type must be a supported canonical type`);
  requireValue(isNonEmpty(block?.text), `semanticBlocks[${index}].text is required`);
  requireValue(
    allowedSourceClasses.has(block?.sourceClass),
    `semanticBlocks[${index}].sourceClass must be one of ${[...allowedSourceClasses].join(", ")}`,
  );
}

for (const type of requiredBlockTypes) {
  requireValue(
    semanticBlocks.some((block) => block?.type === type),
    `at least one '${type}' semantic block is required`,
  );
}

const sourceLedger = Array.isArray(session.sourceLedger) ? session.sourceLedger : [];
const ledgerByClaimId = new Map(sourceLedger.map((entry) => [entry?.claimId, entry]));
requireValue(sourceLedger.length > 0, "session.sourceLedger must not be empty");
requireValue(
  duplicateValues(sourceLedger.map((entry) => entry?.claimId).filter(Boolean)).length === 0,
  "sourceLedger claimId values must be unique",
);
for (const [index, entry] of sourceLedger.entries()) {
  requireValue(blockIdSet.has(entry?.claimId), `sourceLedger[${index}] references unknown semantic block '${entry?.claimId}'`);
}
for (const block of semanticBlocks) {
  const entry = ledgerByClaimId.get(block.id);
  requireValue(Boolean(entry), `sourceLedger needs an entry for semantic block '${block.id}'`);
  if (!entry) continue;
  requireValue(entry.classification === block.sourceClass, `sourceLedger classification must match '${block.id}'`);
  requireValue(isNonEmpty(entry.origin), `sourceLedger '${block.id}' needs an origin`);
  requireValue(/^\d{4}-\d{2}-\d{2}$/.test(entry.checkedOn ?? ""), `sourceLedger '${block.id}' needs checkedOn as YYYY-MM-DD`);
  requireValue(["high", "medium", "low"].includes(entry.confidence), `sourceLedger '${block.id}' confidence must be high, medium, or low`);
  requireValue(Array.isArray(entry.surfaces), `sourceLedger '${block.id}' surfaces must be an array`);
  requireValue(isNonEmpty(entry.caveat), `sourceLedger '${block.id}' needs a caveat`);
  if (block.sourceClass === "source-backed") {
    requireValue(/^https?:\/\//.test(entry.url ?? ""), `source-backed ledger entry '${block.id}' needs an http(s) URL`);
  }
}

const surfaces = session.surfaces ?? {};
const book = surfaces.book ?? {};
const teaching = surfaces.teaching ?? {};
const slides = surfaces.slides ?? {};

const surfaceRefs = {};
const surfaceRefOrders = {};
for (const [name, surface] of Object.entries({ book, teaching, slides })) {
  requireValue(
    surface.centralQuestion === session.centralQuestion,
    `${name}.centralQuestion must exactly match session.centralQuestion`,
  );
  const refs = Array.isArray(surface.semanticBlockIds) ? surface.semanticBlockIds : [];
  surfaceRefOrders[name] = refs;
  surfaceRefs[name] = [...new Set(refs)].sort();
  requireValue(refs.length > 0, `${name}.semanticBlockIds must not be empty`);
  requireValue(duplicateValues(refs).length === 0, `${name}.semanticBlockIds must not contain duplicates`);
  for (const id of refs) {
    requireValue(blockIdSet.has(id), `${name} references unknown semantic block '${id}'`);
  }
}

const bookRefKey = JSON.stringify(surfaceRefs.book ?? []);
requireValue(
  JSON.stringify(surfaceRefs.teaching ?? []) === bookRefKey,
  "teaching.semanticBlockIds must exactly match book.semanticBlockIds",
);
requireValue(
  JSON.stringify(surfaceRefs.slides ?? []) === bookRefKey,
  "slides.semanticBlockIds must exactly match book.semanticBlockIds",
);
for (const block of semanticBlocks) {
  const entry = ledgerByClaimId.get(block.id);
  if (!entry || !Array.isArray(entry.surfaces)) continue;
  const declaredSurfaces = [...entry.surfaces].sort();
  const expectedSurfaces = visibleSurfaceNames
    .filter((name) => (surfaceRefs[name] ?? []).includes(block.id))
    .sort();
  requireValue(
    duplicateValues(entry.surfaces).length === 0,
    `sourceLedger '${block.id}' surfaces must not contain duplicates`,
  );
  requireValue(
    entry.surfaces.every((name) => visibleSurfaceNames.includes(name)),
    `sourceLedger '${block.id}' surfaces may contain only ${visibleSurfaceNames.join(", ")}`,
  );
  requireValue(
    JSON.stringify(declaredSurfaces) === JSON.stringify(expectedSurfaces),
    `sourceLedger '${block.id}' surfaces must exactly match visible use: ${expectedSurfaces.join(", ") || "none"}`,
  );
}
for (const block of semanticBlocks.filter((item) => item.sourceClass === "still-to-confirm")) {
  requireValue(
    !(surfaceRefs.book ?? []).includes(block.id),
    `still-to-confirm semantic block '${block.id}' cannot appear in a visible surface`,
  );
}

const caseBlocks = semanticBlocks.filter((block) => block.type === "case");
const lateralBlocks = semanticBlocks.filter((block) => block.type === "lateral-example");
const mechanismBlocks = semanticBlocks.filter((block) => block.type === "mechanism");
requireValue(caseBlocks.length === 1, "exactly one sustained case semantic block is required");
requireValue(lateralBlocks.length <= 3, "at most three lateral example semantic blocks are allowed");
requireValue(mechanismBlocks.length === 1, "exactly one mechanism semantic block is required");
requireValue(Number(session.caseReturnCount) >= 2, "session.caseReturnCount must be at least 2 for a sustained case");

requireValue(Array.isArray(book.headings) && book.headings.length >= 1 && book.headings.length <= 3, "book.headings must contain 1 to 3 headings");
requireValue(Number(book.narrativeWords) >= 3800 && Number(book.narrativeWords) <= 5200, "book.narrativeWords must be between 3800 and 5200 for a 90-minute core with a 120-minute prepared runway");
requireValue(Number(book.workbookWords) >= 400 && Number(book.workbookWords) <= 600, "book.workbookWords must be between 400 and 600");
requireValue(Number(book.bodyCalloutCards) === 0, "book.bodyCalloutCards must be 0");
requireValue(Number(book.pullLines) <= 2, "book.pullLines must be 2 or fewer");
requireValue(Array.isArray(book.diagramIds) && book.diagramIds.length === 1, "book.diagramIds must contain exactly one diagram");

const coreMinutes = sumMinutes(teaching.coreSegments);
const reserveMinutes = sumMinutes(teaching.depthReserves);
requireValue(coreMinutes === Number(programme.officialSessionMinutes), `teaching core totals ${coreMinutes}, expected ${programme.officialSessionMinutes}`);
requireValue(reserveMinutes >= 30, `teaching depth reserves total ${reserveMinutes}, expected at least 30`);
requireValue(coreMinutes + reserveMinutes === Number(programme.preparedRunwayMinutes), `core plus reserves total ${coreMinutes + reserveMinutes}, expected ${programme.preparedRunwayMinutes}`);
if (Number(programme.officialSessionMinutes) === 90) {
  requireValue(Number(programme.preparedRunwayMinutes) >= 120, "a 90-minute session needs at least 120 prepared minutes");
}
for (const [index, segment] of (teaching.coreSegments ?? []).entries()) {
  requireValue(Array.isArray(segment?.semanticBlockIds) && segment.semanticBlockIds.length > 0, `coreSegments[${index}].semanticBlockIds must not be empty`);
  for (const id of segment?.semanticBlockIds ?? []) {
    requireValue(blockIdSet.has(id), `coreSegments[${index}] references unknown semantic block '${id}'`);
  }
}
const teachingCoreIds = orderedUnique(
  (teaching.coreSegments ?? []).flatMap((segment) => segment?.semanticBlockIds ?? []),
);
requireValue(
  JSON.stringify([...teachingCoreIds].sort()) === JSON.stringify(surfaceRefs.teaching ?? []),
  "teaching.coreSegments must collectively use every teaching.semanticBlockIds item and no others",
);
for (const [index, reserve] of (teaching.depthReserves ?? []).entries()) {
  requireValue(isNonEmpty(reserve?.trigger), `depthReserves[${index}].trigger is required`);
  requireValue(isNonEmpty(reserve?.addedMove), `depthReserves[${index}].addedMove is required`);
  requireValue(isNonEmpty(reserve?.rejoin), `depthReserves[${index}].rejoin is required`);
  requireValue(isNonEmpty(reserve?.artifactState), `depthReserves[${index}].artifactState is required`);
  requireValue(Array.isArray(reserve?.semanticBlockIds) && reserve.semanticBlockIds.length > 0, `depthReserves[${index}].semanticBlockIds must not be empty`);
  for (const id of reserve?.semanticBlockIds ?? []) {
    requireValue(blockIdSet.has(id), `depthReserves[${index}] references unknown semantic block '${id}'`);
  }
}

requireValue(Array.isArray(slides.beats) && slides.beats.length >= 6 && slides.beats.length <= 10, "slides.beats must contain 6 to 10 beats");
for (const [index, beat] of (slides.beats ?? []).entries()) {
  requireValue(Array.isArray(beat?.semanticBlockIds) && beat.semanticBlockIds.length > 0, `slides.beats[${index}].semanticBlockIds must not be empty`);
  for (const id of beat?.semanticBlockIds ?? []) {
    requireValue(blockIdSet.has(id), `slides.beats[${index}] references unknown semantic block '${id}'`);
  }
}
const slideBeatOrder = orderedUnique(
  (slides.beats ?? []).flatMap((beat) => beat?.semanticBlockIds ?? []),
);
const slideBeatIds = [...slideBeatOrder].sort();
requireValue(
  JSON.stringify(slideBeatIds) === JSON.stringify(surfaceRefs.slides ?? []),
  "slides.beats must collectively use every slides.semanticBlockIds item and no others",
);

const exercises = Array.isArray(session.exercises) ? session.exercises : [];
requireValue(exercises.length > 0, "at least one exercise is required");
const exerciseBlockIds = new Set(
  semanticBlocks.filter((block) => block.type === "exercise").map((block) => block.id),
);
const blockTypeById = new Map(semanticBlocks.map((block) => [block.id, block.type]));
const sequenceOrders = {
  book: surfaceRefOrders.book ?? [],
  teaching: teachingCoreIds,
  slides: slideBeatOrder,
};
for (const [index, exercise] of exercises.entries()) {
  requireValue(exerciseBlockIds.has(exercise?.id), `exercises[${index}].id must reference an exercise semantic block`);
  requireValue(isNonEmpty(exercise?.name), `exercises[${index}].name is required`);
  requireValue(exercise?.commitBeforeAI === true, `exercises[${index}] must commit before AI`);
  requireValue(blockTypeById.get(exercise?.commitmentBlockId) === "commitment", `exercises[${index}].commitmentBlockId must reference a commitment semantic block`);
  requireValue(blockTypeById.get(exercise?.aiChallengeBlockId) === "ai-challenge", `exercises[${index}].aiChallengeBlockId must reference an ai-challenge semantic block`);
  requireValue(blockTypeById.get(exercise?.revisionBlockId) === "revision", `exercises[${index}].revisionBlockId must reference a revision semantic block`);
  for (const [surfaceName, order] of Object.entries(sequenceOrders)) {
    const commitmentIndex = order.indexOf(exercise?.commitmentBlockId);
    const challengeIndex = order.indexOf(exercise?.aiChallengeBlockId);
    const revisionIndex = order.indexOf(exercise?.revisionBlockId);
    requireValue(
      commitmentIndex >= 0 && challengeIndex >= 0 && revisionIndex >= 0
        && commitmentIndex < challengeIndex && challengeIndex < revisionIndex,
      `${surfaceName} must preserve commitment -> AI challenge -> revision for exercises[${index}]`,
    );
  }
  requireValue(exercise?.usesIdentifiableData === false, `exercises[${index}] must default to no identifiable data`);
  requireValue(exercise?.filledEdition?.present === true, `exercises[${index}] needs a filled edition`);
  requireValue(exercise?.filledEdition?.revealedByControl === true, `exercises[${index}] filled edition must be behind a reveal control`);
  requireValue(exercise?.filledEdition?.startsClosed === true, `exercises[${index}] filled edition must start closed`);
  requireValue(isNonEmpty(exercise?.filledEdition?.controlLabel), `exercises[${index}] filled edition needs a control label`);
  requireValue(isNonEmpty(exercise?.filledEdition?.content), `exercises[${index}] filled edition needs realistic completed content`);
  requireValue(["challenge", "question", "stress-test"].includes(exercise?.aiRoleType), `exercises[${index}].aiRoleType must be challenge, question, or stress-test`);
  requireValue(isNonEmpty(exercise?.aiRole), `exercises[${index}].aiRole must explain the bounded AI move`);
  requireValue(isNonEmpty(exercise?.humanDecisionOwner), `exercises[${index}].humanDecisionOwner is required`);
}

if (errors.length > 0) {
  console.error(`FAIL ${path.basename(inputPath)} (${errors.length} errors)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS ${path.basename(inputPath)}`);
console.log(`- ${semanticBlocks.length} semantic blocks shared across 3 surfaces`);
console.log(`- ${coreMinutes} core minutes + ${reserveMinutes} reserve minutes = ${coreMinutes + reserveMinutes} prepared minutes`);
console.log(`- ${book.headings.length} book headings, ${slides.beats.length} slide beats, ${exercises.length} exercise(s)`);
