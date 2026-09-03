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
const sameValuesInOrder = (left, right) =>
  Array.isArray(left) && Array.isArray(right) && JSON.stringify(left) === JSON.stringify(right);
const nonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

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
const allowedBlockTypes = new Set([...requiredBlockTypes, "lateral-example", "exercise-case"]);
const visibleSurfaceNames = ["book", "teaching", "slides"];

requireValue(isNonEmpty(programme.title), "programme.title is required");
requireValue(Number(programme.officialSessionMinutes) > 0, "programme.officialSessionMinutes must be positive");
requireValue(Number(programme.preparedRunwayMinutes) > 0, "programme.preparedRunwayMinutes must be positive");
requireValue(isNonEmpty(session.title), "session.title is required");
requireValue(isNonEmpty(session.bookReader), "session.bookReader is required");
requireValue(isNonEmpty(session.participantAudience), "session.participantAudience is required");
requireValue(isNonEmpty(session?.assumedKnowledge?.book), "session.assumedKnowledge.book is required");
requireValue(isNonEmpty(session?.assumedKnowledge?.teaching), "session.assumedKnowledge.teaching is required");
requireValue(isNonEmpty(session.centralQuestion), "session.centralQuestion is required");
requireValue(isNonEmpty(session.carriedArtifact), "session.carriedArtifact is required");
requireValue(isNonEmpty(session.nextQuestion), "session.nextQuestion is required");
requireValue(semanticBlocks.length > 0, "session.semanticBlocks must not be empty");
requireValue(duplicateValues(blockIds).length === 0, "semantic block ids must be unique");

for (const [index, block] of semanticBlocks.entries()) {
  requireValue(isNonEmpty(block?.id), `semanticBlocks[${index}].id is required`);
  requireValue(allowedBlockTypes.has(block?.type), `semanticBlocks[${index}].type must be a supported canonical type`);
  requireValue(isNonEmpty(block?.text), `semanticBlocks[${index}].text is required`);
  requireValue(typeof block?.requiredAcrossSurfaces === "boolean", `semanticBlocks[${index}].requiredAcrossSurfaces must be boolean`);
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
  requireValue(isNonEmpty(entry.sourceType), `sourceLedger '${block.id}' needs a sourceType`);
  requireValue(/^\d{4}-\d{2}-\d{2}$/.test(entry.checkedOn ?? ""), `sourceLedger '${block.id}' needs checkedOn as YYYY-MM-DD`);
  requireValue(["high", "medium", "low"].includes(entry.confidence), `sourceLedger '${block.id}' confidence must be high, medium, or low`);
  requireValue(Array.isArray(entry.surfaces), `sourceLedger '${block.id}' surfaces must be an array`);
  requireValue(Array.isArray(entry.supportedFacts), `sourceLedger '${block.id}' supportedFacts must be an array`);
  requireValue(isNonEmpty(entry.teachingInference), `sourceLedger '${block.id}' needs a teachingInference`);
  requireValue(isNonEmpty(entry.factualBoundary), `sourceLedger '${block.id}' needs a factualBoundary`);
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
  surfaceRefs[name] = [...new Set(refs)];
  requireValue(refs.length > 0, `${name}.semanticBlockIds must not be empty`);
  requireValue(duplicateValues(refs).length === 0, `${name}.semanticBlockIds must not contain duplicates`);
  for (const id of refs) {
    requireValue(blockIdSet.has(id), `${name} references unknown semantic block '${id}'`);
  }
}

for (const block of semanticBlocks.filter((item) => item.requiredAcrossSurfaces === true)) {
  for (const surfaceName of visibleSurfaceNames) {
    requireValue(
      (surfaceRefs[surfaceName] ?? []).includes(block.id),
      `${surfaceName} must include required-across-surfaces block '${block.id}'`,
    );
  }
}
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
  for (const surfaceName of visibleSurfaceNames) {
    requireValue(
      !(surfaceRefs[surfaceName] ?? []).includes(block.id),
      `still-to-confirm semantic block '${block.id}' cannot appear in ${surfaceName}`,
    );
  }
}

const caseBlocks = semanticBlocks.filter((block) => block.type === "case");
const lateralBlocks = semanticBlocks.filter((block) => block.type === "lateral-example");
const mechanismBlocks = semanticBlocks.filter((block) => block.type === "mechanism");
requireValue(caseBlocks.length === 1, "exactly one sustained case semantic block is required");
requireValue(lateralBlocks.length <= 3, "at most three lateral example semantic blocks are allowed");
requireValue(mechanismBlocks.length === 1, "exactly one mechanism semantic block is required");
if (caseBlocks.length === 1) {
  const sustainedCase = caseBlocks[0];
  for (const field of ["decision", "stakes", "constraint", "incompleteEvidence", "evidenceBoundary"]) {
    requireValue(isNonEmpty(sustainedCase?.[field]), `sustained case '${sustainedCase.id}' needs ${field}`);
  }
  requireValue(nonEmptyArray(sustainedCase.actors), `sustained case '${sustainedCase.id}' needs actors`);
  requireValue(
    Array.isArray(sustainedCase.returnPoints) && sustainedCase.returnPoints.length >= 2,
    `sustained case '${sustainedCase.id}' needs at least two purposeful returnPoints`,
  );
  for (const [index, point] of (sustainedCase.returnPoints ?? []).entries()) {
    requireValue(blockIdSet.has(point?.afterBlockId), `sustained case returnPoints[${index}] references unknown afterBlockId`);
    requireValue(isNonEmpty(point?.purpose), `sustained case returnPoints[${index}] needs a purpose`);
    requireValue(isNonEmpty(point?.newCausalWork), `sustained case returnPoints[${index}] needs newCausalWork`);
  }
}

for (const block of lateralBlocks) {
  for (const field of ["conceptualJob", "mechanism", "boundary", "returnToHumanProblem"]) {
    requireValue(isNonEmpty(block?.[field]), `lateral example '${block.id}' needs ${field}`);
  }
  if (block.sourceClass === "source-backed") {
    requireValue(isNonEmpty(block.unfamiliarFact), `source-backed lateral example '${block.id}' needs an unfamiliarFact`);
  }
}

if (mechanismBlocks.length === 1) {
  const mechanism = mechanismBlocks[0];
  requireValue(["descriptive", "branded"].includes(mechanism?.labelStrategy), `mechanism '${mechanism.id}' needs labelStrategy descriptive or branded`);
  if (mechanism?.labelStrategy === "branded") {
    requireValue(isNonEmpty(mechanism.namingRationale), `branded mechanism '${mechanism.id}' needs a namingRationale`);
  }
}

const narrativeHinges = session.narrativeHinges ?? {};
for (const hingeName of ["sceneToConcept", "conceptToFramework", "chapterToExercise"]) {
  const hinge = narrativeHinges[hingeName] ?? {};
  requireValue(blockIdSet.has(hinge.fromBlockId), `narrativeHinges.${hingeName}.fromBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(hinge.toBlockId), `narrativeHinges.${hingeName}.toBlockId must reference a semantic block`);
  requireValue(isNonEmpty(hinge.bridge), `narrativeHinges.${hingeName}.bridge is required`);
  for (const [surfaceName, order] of Object.entries(surfaceRefOrders)) {
    if (!order.includes(hinge.fromBlockId) || !order.includes(hinge.toBlockId)) continue;
    requireValue(
      order.indexOf(hinge.fromBlockId) < order.indexOf(hinge.toBlockId),
      `${surfaceName} must preserve ${hingeName} causal order`,
    );
  }
}

for (const [index, term] of (session.terms ?? []).entries()) {
  requireValue(isNonEmpty(term?.term), `terms[${index}].term is required`);
  requireValue(blockIdSet.has(term?.problemBlockId), `terms[${index}].problemBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(term?.definitionBlockId), `terms[${index}].definitionBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(term?.reuseBlockId), `terms[${index}].reuseBlockId must reference a semantic block`);
  requireValue(isNonEmpty(term?.plainDefinition), `terms[${index}].plainDefinition is required`);
  requireValue(isNonEmpty(term?.nearestDistinction), `terms[${index}].nearestDistinction is required`);
  for (const [surfaceName, order] of Object.entries(surfaceRefOrders)) {
    if (![term.problemBlockId, term.definitionBlockId, term.reuseBlockId].every((id) => order.includes(id))) continue;
    requireValue(
      order.indexOf(term.problemBlockId) < order.indexOf(term.definitionBlockId)
        && order.indexOf(term.definitionBlockId) < order.indexOf(term.reuseBlockId),
      `${surfaceName} must preserve problem -> definition -> reuse for term '${term.term}'`,
    );
  }
}

for (const [index, comparison] of (session.evidenceComparisons ?? []).entries()) {
  requireValue(blockIdSet.has(comparison?.leftBlockId), `evidenceComparisons[${index}].leftBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(comparison?.rightBlockId), `evidenceComparisons[${index}].rightBlockId must reference a semantic block`);
  requireValue(isNonEmpty(comparison?.commonProblem), `evidenceComparisons[${index}].commonProblem is required`);
  requireValue(isNonEmpty(comparison?.differentMechanisms), `evidenceComparisons[${index}].differentMechanisms is required`);
  requireValue(isNonEmpty(comparison?.decisionConsequence), `evidenceComparisons[${index}].decisionConsequence is required`);
}

const transitions = semanticBlocks.filter((block) => block.type === "transition");
for (const transition of transitions) {
  requireValue(nonEmptyArray(transition.derivedFromBlockIds), `transition '${transition.id}' needs derivedFromBlockIds`);
  for (const id of transition.derivedFromBlockIds ?? []) {
    requireValue(blockIdSet.has(id), `transition '${transition.id}' references unknown precursor '${id}'`);
    for (const [surfaceName, order] of Object.entries(surfaceRefOrders)) {
      if (!order.includes(id) || !order.includes(transition.id)) continue;
      requireValue(order.indexOf(id) < order.indexOf(transition.id), `${surfaceName} must place transition '${transition.id}' after '${id}'`);
    }
  }
  requireValue(isNonEmpty(transition.unresolvedBecause), `transition '${transition.id}' needs unresolvedBecause`);
  requireValue(isNonEmpty(transition.artifactState), `transition '${transition.id}' needs artifactState`);
}

requireValue(Array.isArray(book.headings) && book.headings.length <= 3, "book.headings must contain 0 to 3 headings");
if (Number(programme.officialSessionMinutes) === 90 && Number(programme.preparedRunwayMinutes) >= 120) {
  requireValue(Number(book.narrativeWords) >= 3800 && Number(book.narrativeWords) <= 5200, "book.narrativeWords must be between 3800 and 5200 for a 90-minute core with a 120-minute prepared runway");
} else {
  requireValue(Number(book.narrativeWords) > 0, "book.narrativeWords must be positive");
}
requireValue(Number(book.workbookWords) > 0, "book.workbookWords must be positive");
requireValue(Number(book.bodyCalloutCards) === 0, "book.bodyCalloutCards must be 0");
requireValue(Number(book.pullLines) <= 2, "book.pullLines must be 2 or fewer");
requireValue(Array.isArray(book.visuals) && book.visuals.length <= 2, "book.visuals must contain 0 to 2 substantive visuals");
for (const [index, visual] of (book.visuals ?? []).entries()) {
  requireValue(isNonEmpty(visual?.id), `book.visuals[${index}].id is required`);
  requireValue(isNonEmpty(visual?.kind), `book.visuals[${index}].kind is required`);
  requireValue(blockIdSet.has(visual?.semanticBlockId), `book.visuals[${index}].semanticBlockId must reference a semantic block`);
  requireValue(isNonEmpty(visual?.visualJob), `book.visuals[${index}].visualJob is required`);
  requireValue(isNonEmpty(visual?.proseRemoved), `book.visuals[${index}].proseRemoved is required`);
  requireValue(blockIdSet.has(visual?.appearsAfterBlockId), `book.visuals[${index}].appearsAfterBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(visual?.reusedInBlockId), `book.visuals[${index}].reusedInBlockId must reference a semantic block`);
  requireValue(isNonEmpty(visual?.sourceStatus), `book.visuals[${index}].sourceStatus is required`);
  if (visual?.sourceStatus === "editorial-reconstruction") {
    requireValue(isNonEmpty(visual?.chronologyNote), `editorial reconstruction '${visual.id}' needs a chronologyNote`);
  }
  const order = surfaceRefOrders.book ?? [];
  if (order.includes(visual?.appearsAfterBlockId) && order.includes(visual?.semanticBlockId)) {
    requireValue(
      order.indexOf(visual.appearsAfterBlockId) <= order.indexOf(visual.semanticBlockId),
      `book visual '${visual.id}' must appear after its earned anchor`,
    );
  }
}

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
  JSON.stringify([...teachingCoreIds].sort()) === JSON.stringify([...(surfaceRefs.teaching ?? [])].sort()),
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

const slideBeatMinimum = Number(programme?.slideBeatRange?.minimum ?? 6);
const slideBeatMaximum = Number(programme?.slideBeatRange?.maximum ?? 10);
requireValue(slideBeatMinimum > 0 && slideBeatMaximum >= slideBeatMinimum, "programme.slideBeatRange must be a positive minimum/maximum range");
requireValue(
  Array.isArray(slides.beats) && slides.beats.length >= slideBeatMinimum && slides.beats.length <= slideBeatMaximum,
  `slides.beats must contain ${slideBeatMinimum} to ${slideBeatMaximum} beats`,
);
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
  JSON.stringify(slideBeatIds) === JSON.stringify([...(surfaceRefs.slides ?? [])].sort()),
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
  requireValue(["sustained-case", "transfer-case"].includes(exercise?.caseMode), `exercises[${index}].caseMode must be sustained-case or transfer-case`);
  const expectedCaseType = exercise?.caseMode === "transfer-case" ? "exercise-case" : "case";
  requireValue(
    blockTypeById.get(exercise?.exerciseCaseBlockId) === expectedCaseType,
    `exercises[${index}].exerciseCaseBlockId must reference a ${expectedCaseType} block`,
  );
  requireValue(blockTypeById.get(exercise?.mechanismBlockId) === "mechanism", `exercises[${index}].mechanismBlockId must reference a mechanism block`);
  requireValue(isNonEmpty(exercise?.chapterConnection), `exercises[${index}].chapterConnection is required`);
  requireValue(isNonEmpty(exercise?.decisionFork), `exercises[${index}].decisionFork is required`);
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
  requireValue(nonEmptyArray(exercise?.steps), `exercises[${index}].steps must not be empty`);
  const stepIds = (exercise?.steps ?? []).map((step) => step?.id).filter(Boolean);
  requireValue(duplicateValues(stepIds).length === 0, `exercises[${index}].step ids must be unique`);
  for (const [stepIndex, step] of (exercise?.steps ?? []).entries()) {
    requireValue(isNonEmpty(step?.id), `exercises[${index}].steps[${stepIndex}].id is required`);
    requireValue(isNonEmpty(step?.prompt), `exercises[${index}].steps[${stepIndex}].prompt is required`);
    requireValue(isNonEmpty(step?.output), `exercises[${index}].steps[${stepIndex}].output is required`);
  }
  requireValue(nonEmptyArray(exercise?.participantFields), `exercises[${index}].participantFields must not be empty`);
  const participantFieldIds = (exercise?.participantFields ?? []).map((field) => field?.id).filter(Boolean);
  requireValue(duplicateValues(participantFieldIds).length === 0, `exercises[${index}].participant field ids must be unique`);
  for (const [fieldIndex, field] of (exercise?.participantFields ?? []).entries()) {
    requireValue(isNonEmpty(field?.id), `exercises[${index}].participantFields[${fieldIndex}].id is required`);
    requireValue(isNonEmpty(field?.label), `exercises[${index}].participantFields[${fieldIndex}].label is required`);
  }
  requireValue(exercise?.revealGate?.requiresParticipantInput === true, `exercises[${index}] reveal gate must require participant input`);
  requireValue(
    sameValuesInOrder(exercise?.revealGate?.requiredFieldIds, participantFieldIds),
    `exercises[${index}] reveal gate must require every participant field in order`,
  );
  requireValue(exercise?.filledEdition?.present === true, `exercises[${index}] needs a filled edition`);
  requireValue(exercise?.filledEdition?.revealedByControl === true, `exercises[${index}] filled edition must be behind a reveal control`);
  requireValue(exercise?.filledEdition?.startsClosed === true, `exercises[${index}] filled edition must start closed`);
  requireValue(isNonEmpty(exercise?.filledEdition?.controlLabel), `exercises[${index}] filled edition needs a control label`);
  const filledFields = exercise?.filledEdition?.fields ?? [];
  const filledFieldIds = filledFields.map((field) => field?.id).filter(Boolean);
  requireValue(
    sameValuesInOrder(filledFieldIds, participantFieldIds),
    `exercises[${index}] filled-edition fields must match participant fields in order`,
  );
  for (const [fieldIndex, field] of filledFields.entries()) {
    requireValue(isNonEmpty(field?.answer), `exercises[${index}].filledEdition.fields[${fieldIndex}].answer is required`);
  }
  for (const field of ["actors", "liveAlternative", "evidenceDiscriminator", "authorityBoundary", "executableAction", "revisionCondition", "appealOrChallengeRoute"]) {
    requireValue(isNonEmpty(exercise?.filledEdition?.completeness?.[field]), `exercises[${index}] filled edition needs completeness.${field}`);
  }
  requireValue(["challenge", "question", "stress-test"].includes(exercise?.aiRoleType), `exercises[${index}].aiRoleType must be challenge, question, or stress-test`);
  requireValue(isNonEmpty(exercise?.aiRole), `exercises[${index}].aiRole must explain the bounded AI move`);
  requireValue(isNonEmpty(exercise?.humanDecisionOwner), `exercises[${index}].humanDecisionOwner is required`);
  requireValue(isNonEmpty(exercise?.transferPrompt), `exercises[${index}].transferPrompt is required`);
  requireValue(isNonEmpty(exercise?.debriefQuestion), `exercises[${index}].debriefQuestion is required`);
  if (exercise?.game) {
    requireValue(exercise.game.choiceChangesState === true, `exercises[${index}] game choices must change visible state`);
    requireValue(exercise.game.revealChangesNextChoice === true, `exercises[${index}] game reveal must change the next choice`);
    requireValue(isNonEmpty(exercise.game.scoreMeaning), `exercises[${index}] game scoreMeaning is required`);
  }
}

if (errors.length > 0) {
  console.error(`FAIL ${path.basename(inputPath)} (${errors.length} errors)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS ${path.basename(inputPath)}`);
console.log(`- ${semanticBlocks.length} semantic blocks shared across 3 surfaces`);
console.log(`- ${coreMinutes} core minutes + ${reserveMinutes} reserve minutes = ${coreMinutes + reserveMinutes} prepared minutes`);
console.log(`- ${book.headings.length} book headings, ${book.visuals.length} substantive visual(s), ${slides.beats.length} slide beats, ${exercises.length} exercise(s)`);
