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
  requireValue(isNonEmpty(block?.type), `semanticBlocks[${index}].type is required`);
  requireValue(isNonEmpty(block?.text), `semanticBlocks[${index}].text is required`);
  requireValue(
    allowedSourceClasses.has(block?.sourceClass),
    `semanticBlocks[${index}].sourceClass must be one of ${[...allowedSourceClasses].join(", ")}`,
  );
}

const surfaces = session.surfaces ?? {};
const book = surfaces.book ?? {};
const teaching = surfaces.teaching ?? {};
const slides = surfaces.slides ?? {};

const surfaceRefs = {};
for (const [name, surface] of Object.entries({ book, teaching, slides })) {
  requireValue(
    surface.centralQuestion === session.centralQuestion,
    `${name}.centralQuestion must exactly match session.centralQuestion`,
  );
  const refs = Array.isArray(surface.semanticBlockIds) ? surface.semanticBlockIds : [];
  surfaceRefs[name] = [...new Set(refs)].sort();
  requireValue(refs.length > 0, `${name}.semanticBlockIds must not be empty`);
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

const caseBlocks = semanticBlocks.filter((block) => block.type === "case");
const lateralBlocks = semanticBlocks.filter((block) => block.type === "lateral-example");
const mechanismBlocks = semanticBlocks.filter((block) => block.type === "mechanism");
requireValue(caseBlocks.length === 1, "exactly one sustained case semantic block is required");
requireValue(lateralBlocks.length <= 1, "at most one lateral example semantic block is allowed");
requireValue(mechanismBlocks.length === 1, "exactly one mechanism semantic block is required");
requireValue(Number(session.caseReturnCount) >= 3, "session.caseReturnCount must be at least 3");

requireValue(Array.isArray(book.headings) && book.headings.length >= 1 && book.headings.length <= 3, "book.headings must contain 1 to 3 headings");
requireValue(Number(book.narrativeWords) >= 2500 && Number(book.narrativeWords) <= 3200, "book.narrativeWords must be between 2500 and 3200");
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
for (const [index, reserve] of (teaching.depthReserves ?? []).entries()) {
  requireValue(isNonEmpty(reserve?.rejoin), `depthReserves[${index}].rejoin is required`);
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
const slideBeatIds = [...new Set((slides.beats ?? []).flatMap((beat) => beat?.semanticBlockIds ?? []))].sort();
requireValue(
  JSON.stringify(slideBeatIds) === JSON.stringify(surfaceRefs.slides ?? []),
  "slides.beats must collectively use every slides.semanticBlockIds item and no others",
);

const exercises = Array.isArray(session.exercises) ? session.exercises : [];
requireValue(exercises.length > 0, "at least one exercise is required");
const exerciseBlockIds = new Set(
  semanticBlocks.filter((block) => block.type === "exercise").map((block) => block.id),
);
for (const [index, exercise] of exercises.entries()) {
  requireValue(exerciseBlockIds.has(exercise?.id), `exercises[${index}].id must reference an exercise semantic block`);
  requireValue(isNonEmpty(exercise?.name), `exercises[${index}].name is required`);
  requireValue(exercise?.commitBeforeAI === true, `exercises[${index}] must commit before AI`);
  requireValue(exercise?.usesIdentifiableData === false, `exercises[${index}] must default to no identifiable data`);
  requireValue(exercise?.filledEdition?.present === true, `exercises[${index}] needs a filled edition`);
  requireValue(exercise?.filledEdition?.revealedByControl === true, `exercises[${index}] filled edition must be behind a reveal control`);
  requireValue(/challenge|question|stress-test|test/i.test(exercise?.aiRole ?? ""), `exercises[${index}].aiRole must constrain AI to challenge or test`);
  requireValue(!/certify|decide|approve|final recommendation/i.test(exercise?.aiRole ?? ""), `exercises[${index}].aiRole gives AI decision authority`);
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
