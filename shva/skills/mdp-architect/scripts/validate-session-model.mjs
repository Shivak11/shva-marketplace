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
const wordCount = (value) => isNonEmpty(value) ? value.trim().split(/\s+/).length : 0;
const isSubstantive = (value, minimumCharacters = 24, minimumWords = 4) =>
  isNonEmpty(value) && value.trim().length >= minimumCharacters && wordCount(value) >= minimumWords;
const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;
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
const planningProfile = programme?.planningProfile ?? {};
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
const allowedPresentationStatuses = new Set([
  "direct",
  "normalised",
  "paraphrased",
  "reconstructed",
  "counterfactual",
  "composite",
  "author-synthesis",
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
const allowedBlockTypes = new Set([
  ...requiredBlockTypes,
  "lateral-example",
  "exercise-case",
  "consequence-reveal",
  "consequence-revision",
]);
const visibleSurfaceNames = ["book", "teaching", "slides"];

requireValue(isNonEmpty(programme.title), "programme.title is required");
requireValue(isPositiveInteger(programme.officialSessionMinutes), "programme.officialSessionMinutes must be a positive integer");
requireValue(isPositiveInteger(programme.preparedRunwayMinutes), "programme.preparedRunwayMinutes must be a positive integer");
requireValue(
  Number(programme.preparedRunwayMinutes) >= Number(programme.officialSessionMinutes),
  "programme.preparedRunwayMinutes must be at least officialSessionMinutes",
);
requireValue(isPositiveInteger(planningProfile.minimumCoreSegments), "programme.planningProfile.minimumCoreSegments must be a positive integer");
requireValue(
  Number.isInteger(Number(planningProfile.maximumBookHeadings)) && Number(planningProfile.maximumBookHeadings) >= 0,
  "programme.planningProfile.maximumBookHeadings must be a non-negative integer",
);
requireValue(
  Number.isInteger(Number(planningProfile.maximumPullLines)) && Number(planningProfile.maximumPullLines) >= 0,
  "programme.planningProfile.maximumPullLines must be a non-negative integer",
);
requireValue(
  Number.isInteger(Number(planningProfile.maximumBodyCalloutCards)) && Number(planningProfile.maximumBodyCalloutCards) >= 0,
  "programme.planningProfile.maximumBodyCalloutCards must be a non-negative integer",
);
requireValue(
  Number.isInteger(Number(planningProfile.maximumSubstantiveVisuals))
    && Number(planningProfile.maximumSubstantiveVisuals) >= 0
    && Number(planningProfile.maximumSubstantiveVisuals) <= 2,
  "programme.planningProfile.maximumSubstantiveVisuals must be an integer from 0 to 2",
);
requireValue(
  Number(planningProfile?.narrativeWordRange?.minimum) > 0
    && Number(planningProfile?.narrativeWordRange?.maximum) >= Number(planningProfile?.narrativeWordRange?.minimum),
  "programme.planningProfile.narrativeWordRange must have a positive minimum and maximum",
);
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
for (const block of semanticBlocks.filter((item) => requiredBlockTypes.includes(item.type))) {
  requireValue(
    block.requiredAcrossSurfaces === true,
    `core semantic block '${block.id}' of type '${block.type}' must be requiredAcrossSurfaces`,
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
  requireValue(
    allowedPresentationStatuses.has(entry.presentationStatus),
    `sourceLedger '${block.id}' needs a supported presentationStatus`,
  );
  if (block.sourceClass === "source-backed") {
    requireValue(/^https?:\/\//.test(entry.url ?? ""), `source-backed ledger entry '${block.id}' needs an http(s) URL`);
    requireValue(isNonEmpty(entry.sourceTitle), `source-backed ledger entry '${block.id}' needs a sourceTitle`);
    requireValue(isNonEmpty(entry.locator), `source-backed ledger entry '${block.id}' needs a locator`);
    requireValue(nonEmptyArray(entry.supportedFacts), `source-backed ledger entry '${block.id}' needs at least one supported fact`);
    requireValue(
      !(entry.url ?? "").match(/^https?:\/\/(?:www\.)?example\.(?:com|org|net)(?:\/|$)/i),
      `source-backed ledger entry '${block.id}' cannot use a placeholder URL`,
    );
    for (const [factIndex, fact] of (entry.supportedFacts ?? []).entries()) {
      requireValue(
        isSubstantive(fact),
        `source-backed ledger entry '${block.id}' supportedFacts[${factIndex}] must state a fact-level claim`,
      );
    }
  }
  if (entry.presentationStatus === "reconstructed") {
    requireValue(/^https?:\/\//.test(entry.url ?? ""), `reconstructed ledger entry '${block.id}' needs an http(s) source URL`);
    requireValue(isNonEmpty(entry.sourceTitle), `reconstructed ledger entry '${block.id}' needs a sourceTitle`);
    requireValue(isNonEmpty(entry.locator), `reconstructed ledger entry '${block.id}' needs a locator`);
    requireValue(nonEmptyArray(entry.supportedFacts), `reconstructed ledger entry '${block.id}' needs supportedFacts`);
  }
  if (entry.presentationStatus === "counterfactual") {
    requireValue(nonEmptyArray(entry.basedOnClaimIds), `counterfactual ledger entry '${block.id}' needs basedOnClaimIds`);
    for (const basedOnId of entry.basedOnClaimIds ?? []) {
      requireValue(blockIdSet.has(basedOnId), `counterfactual ledger entry '${block.id}' references unknown claim '${basedOnId}'`);
    }
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
const hingeTypeRules = {
  sceneToConcept: { from: new Set(["disturbance", "case"]), to: new Set(["claim"]) },
  conceptToFramework: { from: new Set(["case", "claim"]), to: new Set(["mechanism"]) },
  chapterToExercise: { from: new Set(["claim", "mechanism", "revision"]), to: new Set(["exercise"]) },
};
const blockTypeByIdForHinges = new Map(semanticBlocks.map((block) => [block.id, block.type]));
for (const hingeName of ["sceneToConcept", "conceptToFramework", "chapterToExercise"]) {
  const hinge = narrativeHinges[hingeName] ?? {};
  requireValue(blockIdSet.has(hinge.fromBlockId), `narrativeHinges.${hingeName}.fromBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(hinge.toBlockId), `narrativeHinges.${hingeName}.toBlockId must reference a semantic block`);
  requireValue(
    hingeTypeRules[hingeName].from.has(blockTypeByIdForHinges.get(hinge.fromBlockId)),
    `narrativeHinges.${hingeName}.fromBlockId has the wrong semantic type`,
  );
  requireValue(
    hingeTypeRules[hingeName].to.has(blockTypeByIdForHinges.get(hinge.toBlockId)),
    `narrativeHinges.${hingeName}.toBlockId has the wrong semantic type`,
  );
  requireValue(isSubstantive(hinge.bridge, 48, 8), `narrativeHinges.${hingeName}.bridge must state a substantive causal relation`);
  requireValue(
    isSubstantive(hinge.unresolvedConsequence, 36, 6),
    `narrativeHinges.${hingeName}.unresolvedConsequence must state what remains live`,
  );
  requireValue(
    isSubstantive(hinge.nextMove, 36, 6),
    `narrativeHinges.${hingeName}.nextMove must state what the next block lets the reader do`,
  );
  requireValue(
    (surfaceRefOrders.book ?? []).includes(hinge.fromBlockId)
      && (surfaceRefOrders.book ?? []).includes(hinge.toBlockId),
    `book must contain both endpoints of narrativeHinges.${hingeName}`,
  );
  for (const [surfaceName, order] of Object.entries(surfaceRefOrders)) {
    if (!order.includes(hinge.fromBlockId) || !order.includes(hinge.toBlockId)) continue;
    requireValue(
      order.indexOf(hinge.fromBlockId) < order.indexOf(hinge.toBlockId),
      `${surfaceName} must preserve ${hingeName} causal order`,
    );
  }
}

requireValue(Array.isArray(session.terms), "session.terms must be an array");
if (Array.isArray(session.terms) && session.terms.length === 0) {
  requireValue(
    isSubstantive(session?.termAudit?.noNewTermsReason),
    "session.termAudit.noNewTermsReason is required when no specialist terms are declared",
  );
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

requireValue(Array.isArray(session.evidenceComparisons), "session.evidenceComparisons must be an array");
if (Array.isArray(session.evidenceComparisons) && session.evidenceComparisons.length === 0) {
  requireValue(
    isSubstantive(session?.comparisonAudit?.noComparisonNeededReason),
    "session.comparisonAudit.noComparisonNeededReason is required when no evidence comparison is declared",
  );
}
for (const [index, comparison] of (session.evidenceComparisons ?? []).entries()) {
  requireValue(blockIdSet.has(comparison?.leftBlockId), `evidenceComparisons[${index}].leftBlockId must reference a semantic block`);
  requireValue(blockIdSet.has(comparison?.rightBlockId), `evidenceComparisons[${index}].rightBlockId must reference a semantic block`);
  requireValue(comparison?.leftBlockId !== comparison?.rightBlockId, `evidenceComparisons[${index}] must compare two different blocks`);
  requireValue(isSubstantive(comparison?.commonProblem), `evidenceComparisons[${index}].commonProblem must be substantive`);
  requireValue(isSubstantive(comparison?.differentMechanisms), `evidenceComparisons[${index}].differentMechanisms must be substantive`);
  requireValue(isSubstantive(comparison?.decisionConsequence), `evidenceComparisons[${index}].decisionConsequence must be substantive`);
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

requireValue(
  Array.isArray(book.headings) && book.headings.length <= Number(planningProfile.maximumBookHeadings),
  `book.headings must contain no more than ${planningProfile.maximumBookHeadings} headings under the selected planning profile`,
);
requireValue(
  Number(book.narrativeWords) >= Number(planningProfile?.narrativeWordRange?.minimum)
    && Number(book.narrativeWords) <= Number(planningProfile?.narrativeWordRange?.maximum),
  `book.narrativeWords must fall inside the selected planning profile range ${planningProfile?.narrativeWordRange?.minimum}-${planningProfile?.narrativeWordRange?.maximum}`,
);
requireValue(Number(book.workbookWords) > 0, "book.workbookWords must be positive");
requireValue(
  Number(book.bodyCalloutCards) <= Number(planningProfile.maximumBodyCalloutCards),
  `book.bodyCalloutCards must be ${planningProfile.maximumBodyCalloutCards} or fewer under the selected planning profile`,
);
requireValue(
  Number(book.pullLines) <= Number(planningProfile.maximumPullLines),
  `book.pullLines must be ${planningProfile.maximumPullLines} or fewer under the selected planning profile`,
);
requireValue(
  Array.isArray(book.visuals) && book.visuals.length <= Number(planningProfile.maximumSubstantiveVisuals),
  `book.visuals must contain no more than ${planningProfile.maximumSubstantiveVisuals} substantive visuals under the selected planning profile`,
);
requireValue(
  duplicateValues((book.visuals ?? []).map((visual) => visual?.id).filter(Boolean)).length === 0,
  "book visual ids must be unique",
);
for (const [index, visual] of (book.visuals ?? []).entries()) {
  requireValue(isNonEmpty(visual?.id), `book.visuals[${index}].id is required`);
  requireValue(isNonEmpty(visual?.kind), `book.visuals[${index}].kind is required`);
  requireValue(blockIdSet.has(visual?.semanticBlockId), `book.visuals[${index}].semanticBlockId must reference a semantic block`);
  requireValue(isSubstantive(visual?.visualJob, 32, 5), `book.visuals[${index}].visualJob must name the relation made easier to see`);
  requireValue(
    isSubstantive(visual?.proseRemoved, 32, 5) && !/^(?:none|nothing|n\/?a)\b/i.test(visual.proseRemoved.trim()),
    `book.visuals[${index}].proseRemoved must name prose the visual genuinely replaces`,
  );
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
requireValue(coreMinutes + reserveMinutes === Number(programme.preparedRunwayMinutes), `core plus reserves total ${coreMinutes + reserveMinutes}, expected ${programme.preparedRunwayMinutes}`);
requireValue(
  Array.isArray(teaching.coreSegments) && teaching.coreSegments.length >= Number(planningProfile.minimumCoreSegments),
  `teaching.coreSegments needs at least ${planningProfile.minimumCoreSegments} distinct facilitation segments under the selected planning profile`,
);
requireValue(
  duplicateValues((teaching.coreSegments ?? []).map((segment) => segment?.id).filter(Boolean)).length === 0,
  "teaching core segment ids must be unique",
);
for (const [index, segment] of (teaching.coreSegments ?? []).entries()) {
  requireValue(isNonEmpty(segment?.id), `coreSegments[${index}].id is required`);
  requireValue(isPositiveInteger(segment?.minutes), `coreSegments[${index}].minutes must be a positive integer`);
  requireValue(isSubstantive(segment?.facilitatorMove), `coreSegments[${index}].facilitatorMove must be substantive`);
  requireValue(isSubstantive(segment?.participantMove), `coreSegments[${index}].participantMove must be substantive`);
  requireValue(isSubstantive(segment?.artifactState), `coreSegments[${index}].artifactState must be substantive`);
  requireValue(isSubstantive(segment?.recoveryMove), `coreSegments[${index}].recoveryMove must be substantive`);
  requireValue(Array.isArray(segment?.semanticBlockIds) && segment.semanticBlockIds.length > 0, `coreSegments[${index}].semanticBlockIds must not be empty`);
  for (const id of segment?.semanticBlockIds ?? []) {
    requireValue(blockIdSet.has(id), `coreSegments[${index}] references unknown semantic block '${id}'`);
  }
}
const teachingCoreIds = orderedUnique(
  (teaching.coreSegments ?? []).flatMap((segment) => segment?.semanticBlockIds ?? []),
);
requireValue(
  sameValuesInOrder(teachingCoreIds, surfaceRefOrders.teaching ?? []),
  "teaching.coreSegments must preserve the order of teaching.semanticBlockIds and use every item exactly as first introduced",
);
requireValue(
  duplicateValues((teaching.depthReserves ?? []).map((reserve) => reserve?.id).filter(Boolean)).length === 0,
  "teaching depth reserve ids must be unique",
);
for (const [index, reserve] of (teaching.depthReserves ?? []).entries()) {
  requireValue(isNonEmpty(reserve?.id), `depthReserves[${index}].id is required`);
  requireValue(isPositiveInteger(reserve?.minutes), `depthReserves[${index}].minutes must be a positive integer`);
  requireValue(isNonEmpty(reserve?.trigger), `depthReserves[${index}].trigger is required`);
  requireValue(isNonEmpty(reserve?.addedMove), `depthReserves[${index}].addedMove is required`);
  requireValue(isSubstantive(reserve?.participantMove), `depthReserves[${index}].participantMove must be substantive`);
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
requireValue(
  sameValuesInOrder(slideBeatOrder, surfaceRefOrders.slides ?? []),
  "slides.beats must preserve the order of slides.semanticBlockIds and use every item exactly as first introduced",
);

const exercises = Array.isArray(session.exercises) ? session.exercises : [];
requireValue(exercises.length > 0, "at least one exercise is required");
const claimedConsequenceRevealBlockIds = [];
const claimedConsequenceRevisionBlockIds = [];
const exerciseBlockIds = new Set(
  semanticBlocks.filter((block) => block.type === "exercise").map((block) => block.id),
);
const blockById = new Map(semanticBlocks.map((block) => [block.id, block]));
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
  const exerciseCaseBlock = semanticBlocks.find((block) => block.id === exercise?.exerciseCaseBlockId);
  if (exerciseCaseBlock) {
    requireValue(
      exerciseCaseBlock.requiredAcrossSurfaces === true,
      `exercises[${index}] case block '${exerciseCaseBlock.id}' must be requiredAcrossSurfaces`,
    );
  }
  requireValue(blockTypeById.get(exercise?.mechanismBlockId) === "mechanism", `exercises[${index}].mechanismBlockId must reference a mechanism block`);
  const chapterConnection = exercise?.chapterConnection ?? {};
  requireValue(
    chapterConnection.fromBlockId === exercise?.mechanismBlockId,
    `exercises[${index}].chapterConnection.fromBlockId must match mechanismBlockId`,
  );
  requireValue(
    isSubstantive(chapterConnection.unresolvedConsequence, 48, 8),
    `exercises[${index}].chapterConnection.unresolvedConsequence must state the live chapter problem`,
  );
  requireValue(
    isSubstantive(chapterConnection.firstParticipantAction, 40, 7),
    `exercises[${index}].chapterConnection.firstParticipantAction must state the first playable move`,
  );
  requireValue(
    isSubstantive(chapterConnection.mechanismUsed, 40, 7),
    `exercises[${index}].chapterConnection.mechanismUsed must state how the exercise uses the chapter mechanism`,
  );
  const chapterOrder = surfaceRefOrders.book ?? [];
  requireValue(
    chapterOrder.indexOf(chapterConnection.fromBlockId) >= 0
      && chapterOrder.indexOf(exercise?.id) > chapterOrder.indexOf(chapterConnection.fromBlockId),
    `exercises[${index}].chapterConnection must point forward from the chapter mechanism to the exercise`,
  );
  const decisionFork = exercise?.decisionFork ?? {};
  requireValue(isSubstantive(decisionFork.question, 40, 7), `exercises[${index}].decisionFork.question must be substantive`);
  requireValue(
    Array.isArray(decisionFork.options) && decisionFork.options.length >= 2 && decisionFork.options.length <= 4,
    `exercises[${index}].decisionFork.options must contain 2 to 4 live alternatives`,
  );
  const optionIds = (decisionFork.options ?? []).map((option) => option?.id).filter(Boolean);
  requireValue(duplicateValues(optionIds).length === 0, `exercises[${index}].decisionFork option ids must be unique`);
  for (const [optionIndex, option] of (decisionFork.options ?? []).entries()) {
    requireValue(isNonEmpty(option?.id), `exercises[${index}].decisionFork.options[${optionIndex}].id is required`);
    requireValue(isSubstantive(option?.action, 24, 4), `exercises[${index}].decisionFork.options[${optionIndex}].action must be substantive`);
    requireValue(isSubstantive(option?.acceptedConsequence, 32, 5), `exercises[${index}].decisionFork.options[${optionIndex}].acceptedConsequence must be substantive`);
  }
  requireValue(exercise?.commitBeforeAI === true, `exercises[${index}] must commit before AI`);
  requireValue(blockTypeById.get(exercise?.commitmentBlockId) === "commitment", `exercises[${index}].commitmentBlockId must reference a commitment semantic block`);
  requireValue(blockTypeById.get(exercise?.aiChallengeBlockId) === "ai-challenge", `exercises[${index}].aiChallengeBlockId must reference an ai-challenge semantic block`);
  requireValue(blockTypeById.get(exercise?.revisionBlockId) === "revision", `exercises[${index}].revisionBlockId must reference a revision semantic block`);
  const consequenceReveal = exercise?.consequenceReveal ?? {};
  requireValue(typeof consequenceReveal.present === "boolean", `exercises[${index}].consequenceReveal.present must be boolean`);
  const hasConsequenceReveal = consequenceReveal.present === true;
  if (hasConsequenceReveal) {
    claimedConsequenceRevealBlockIds.push(consequenceReveal.revealBlockId);
    claimedConsequenceRevisionBlockIds.push(consequenceReveal.revisionBlockId);
    requireValue(
      blockTypeById.get(consequenceReveal.revealBlockId) === "consequence-reveal",
      `exercises[${index}] consequence reveal revealBlockId must reference a consequence-reveal semantic block`,
    );
    requireValue(
      blockTypeById.get(consequenceReveal.revisionBlockId) === "consequence-revision",
      `exercises[${index}] consequence reveal revisionBlockId must reference a consequence-revision semantic block`,
    );
    requireValue(
      blockById.get(consequenceReveal.revealBlockId)?.requiredAcrossSurfaces === true,
      `exercises[${index}] consequence reveal block must be requiredAcrossSurfaces`,
    );
    requireValue(
      blockById.get(consequenceReveal.revisionBlockId)?.requiredAcrossSurfaces === true,
      `exercises[${index}] consequence revision block must be requiredAcrossSurfaces`,
    );
  } else {
    requireValue(
      isSubstantive(consequenceReveal.notUsedReason, 40, 7),
      `exercises[${index}] without a consequence reveal needs a substantive notUsedReason`,
    );
  }
  for (const [surfaceName, order] of Object.entries(sequenceOrders)) {
    const commitmentIndex = order.indexOf(exercise?.commitmentBlockId);
    const challengeIndex = order.indexOf(exercise?.aiChallengeBlockId);
    const revisionIndex = order.indexOf(exercise?.revisionBlockId);
    if (hasConsequenceReveal) {
      const revealIndex = order.indexOf(consequenceReveal.revealBlockId);
      const consequenceRevisionIndex = order.indexOf(consequenceReveal.revisionBlockId);
      requireValue(
        commitmentIndex >= 0 && revealIndex >= 0 && consequenceRevisionIndex >= 0 && challengeIndex >= 0 && revisionIndex >= 0
          && commitmentIndex < revealIndex
          && consequenceRevisionIndex === revealIndex + 1
          && consequenceRevisionIndex < challengeIndex
          && challengeIndex < revisionIndex,
        `${surfaceName} must preserve commitment -> consequence reveal -> consequence revision -> AI challenge -> revision for exercises[${index}]`,
      );
    } else {
      requireValue(
        commitmentIndex >= 0 && challengeIndex >= 0 && revisionIndex >= 0
          && commitmentIndex < challengeIndex && challengeIndex < revisionIndex,
        `${surfaceName} must preserve commitment -> AI challenge -> revision for exercises[${index}]`,
      );
    }
  }
  requireValue(exercise?.usesIdentifiableData === false, `exercises[${index}] must default to no identifiable data`);
  requireValue(nonEmptyArray(exercise?.steps), `exercises[${index}].steps must not be empty`);
  const stepIds = (exercise?.steps ?? []).map((step) => step?.id).filter(Boolean);
  requireValue(duplicateValues(stepIds).length === 0, `exercises[${index}].step ids must be unique`);
  for (const [stepIndex, step] of (exercise?.steps ?? []).entries()) {
    requireValue(isNonEmpty(step?.id), `exercises[${index}].steps[${stepIndex}].id is required`);
    requireValue(isNonEmpty(step?.prompt), `exercises[${index}].steps[${stepIndex}].prompt is required`);
    requireValue(isNonEmpty(step?.output), `exercises[${index}].steps[${stepIndex}].output is required`);
    requireValue(nonEmptyArray(step?.requiredFieldIds), `exercises[${index}].steps[${stepIndex}].requiredFieldIds must not be empty`);
  }
  requireValue(nonEmptyArray(exercise?.participantFields), `exercises[${index}].participantFields must not be empty`);
  const participantFieldIds = (exercise?.participantFields ?? []).map((field) => field?.id).filter(Boolean);
  requireValue(duplicateValues(participantFieldIds).length === 0, `exercises[${index}].participant field ids must be unique`);
  for (const [fieldIndex, field] of (exercise?.participantFields ?? []).entries()) {
    requireValue(isNonEmpty(field?.id), `exercises[${index}].participantFields[${fieldIndex}].id is required`);
    requireValue(isSubstantive(field?.label, 12, 2), `exercises[${index}].participantFields[${fieldIndex}].label must be substantive`);
  }
  for (const [stepIndex, step] of (exercise?.steps ?? []).entries()) {
    for (const fieldId of step?.requiredFieldIds ?? []) {
      requireValue(participantFieldIds.includes(fieldId), `exercises[${index}].steps[${stepIndex}] references unknown participant field '${fieldId}'`);
    }
  }
  const fieldsWrittenBySteps = new Set(
    (exercise?.steps ?? []).flatMap((step) => step?.requiredFieldIds ?? []),
  );
  for (const fieldId of participantFieldIds) {
    requireValue(
      fieldsWrittenBySteps.has(fieldId),
      `exercises[${index}] participant field '${fieldId}' must be written by at least one exercise step`,
    );
  }

  if (hasConsequenceReveal) {
    const consequenceFieldIds = consequenceReveal.requiredFieldIds ?? [];
    requireValue(consequenceReveal.requiresParticipantInput === true, `exercises[${index}] consequence reveal must require participant input`);
    requireValue(nonEmptyArray(consequenceFieldIds), `exercises[${index}] consequence reveal needs requiredFieldIds`);
    requireValue(
      consequenceFieldIds.length < participantFieldIds.length,
      `exercises[${index}] consequence reveal requiredFieldIds must be a proper subset of participant fields`,
    );
    requireValue(
      duplicateValues(consequenceFieldIds).length === 0,
      `exercises[${index}] consequence reveal requiredFieldIds must be unique`,
    );
    for (const fieldId of consequenceFieldIds) {
      requireValue(participantFieldIds.includes(fieldId), `exercises[${index}] consequence reveal references unknown participant field '${fieldId}'`);
    }
    requireValue(
      isPositiveInteger(consequenceReveal.minimumAttemptCharacters) && Number(consequenceReveal.minimumAttemptCharacters) >= 12,
      `exercises[${index}] consequence reveal minimumAttemptCharacters must be at least 12`,
    );
    const afterStepIndex = stepIds.indexOf(consequenceReveal.afterStepId);
    const consequenceRevisionStepIndex = stepIds.indexOf(consequenceReveal.revisionStepId);
    requireValue(afterStepIndex >= 0, `exercises[${index}] consequence reveal afterStepId must reference a step`);
    requireValue(consequenceRevisionStepIndex >= 0, `exercises[${index}] consequence reveal revisionStepId must reference a step`);
    requireValue(
      consequenceRevisionStepIndex === afterStepIndex + 1,
      `exercises[${index}] consequence reveal revision step must immediately follow its trigger step`,
    );
    const writableBeforeReveal = new Set(
      (exercise?.steps ?? [])
        .slice(0, Math.max(0, afterStepIndex + 1))
        .flatMap((step) => step?.requiredFieldIds ?? []),
    );
    requireValue(
      consequenceFieldIds.every((fieldId) => writableBeforeReveal.has(fieldId)),
      `exercises[${index}] consequence reveal may require only fields writable at or before afterStepId`,
    );
    const consequenceRevisionStep = exercise?.steps?.[consequenceRevisionStepIndex];
    requireValue(
      (consequenceRevisionStep?.requiredFieldIds ?? []).some((fieldId) => !consequenceFieldIds.includes(fieldId)),
      `exercises[${index}] consequence revision step must write a field beyond the first commitment gate`,
    );
    requireValue(isSubstantive(consequenceReveal.revealedFact, 40, 7), `exercises[${index}] consequence reveal needs a substantive revealedFact`);
    requireValue(isSubstantive(consequenceReveal.provenance, 32, 5), `exercises[${index}] consequence reveal needs provenance`);
    requireValue(isSubstantive(consequenceReveal.decisionConsequence, 40, 7), `exercises[${index}] consequence reveal needs a decisionConsequence`);
  }

  const filledEditionReveal = exercise?.filledEditionReveal ?? {};
  requireValue(filledEditionReveal.requiresParticipantInput === true, `exercises[${index}] filled-edition reveal must require participant input`);
  requireValue(
    sameValuesInOrder(filledEditionReveal.requiredFieldIds, participantFieldIds),
    `exercises[${index}] filled-edition reveal must require every participant field in order`,
  );
  requireValue(
    isPositiveInteger(filledEditionReveal.minimumAttemptCharacters) && Number(filledEditionReveal.minimumAttemptCharacters) >= 12,
    `exercises[${index}] filled-edition reveal minimumAttemptCharacters must be at least 12`,
  );
  requireValue(filledEditionReveal.startsClosed === true, `exercises[${index}] filled-edition reveal must start closed`);
  requireValue(isNonEmpty(filledEditionReveal.controlLabel), `exercises[${index}] filled-edition reveal needs a control label`);
  requireValue(isNonEmpty(filledEditionReveal.fieldBindingAttribute), `exercises[${index}] filled-edition reveal needs a fieldBindingAttribute`);
  requireValue(filledEditionReveal.browserProofRequired === true, `exercises[${index}] filled-edition reveal must declare browser proof required`);
  requireValue(exercise?.filledEdition?.present === true, `exercises[${index}] needs a filled edition`);
  const filledFields = exercise?.filledEdition?.fields ?? [];
  const filledFieldIds = filledFields.map((field) => field?.id).filter(Boolean);
  requireValue(
    sameValuesInOrder(filledFieldIds, participantFieldIds),
    `exercises[${index}] filled-edition fields must match participant fields in order`,
  );
  for (const [fieldIndex, field] of filledFields.entries()) {
    requireValue(
      isSubstantive(field?.answer, 48, 8),
      `exercises[${index}].filledEdition.fields[${fieldIndex}].answer must be a realistic completed answer`,
    );
  }
  for (const field of ["actors", "liveAlternative", "evidenceDiscriminator", "authorityBoundary", "executableAction", "revisionCondition", "appealOrChallengeRoute"]) {
    requireValue(
      isSubstantive(exercise?.filledEdition?.completeness?.[field], 32, 5),
      `exercises[${index}] filled edition needs a substantive completeness.${field}`,
    );
  }
  requireValue(["challenge", "question", "stress-test"].includes(exercise?.aiRoleType), `exercises[${index}].aiRoleType must be challenge, question, or stress-test`);
  requireValue(isNonEmpty(exercise?.aiRole), `exercises[${index}].aiRole must explain the bounded AI move`);
  requireValue(isNonEmpty(exercise?.humanDecisionOwner), `exercises[${index}].humanDecisionOwner is required`);
  requireValue(isNonEmpty(exercise?.transferPrompt), `exercises[${index}].transferPrompt is required`);
  requireValue(isNonEmpty(exercise?.debriefQuestion), `exercises[${index}].debriefQuestion is required`);
  if (exercise?.game) {
    const game = exercise.game;
    requireValue(isSubstantive(game.stateMeaning, 32, 5), `exercises[${index}] game.stateMeaning must explain what state represents`);
    requireValue(nonEmptyArray(game.states) && game.states.length >= 2, `exercises[${index}] game.states needs at least two states`);
    const stateIds = (game.states ?? []).map((state) => state?.id).filter(Boolean);
    requireValue(duplicateValues(stateIds).length === 0, `exercises[${index}] game state ids must be unique`);
    requireValue(stateIds.includes(game.initialStateId), `exercises[${index}] game.initialStateId must reference a state`);
    for (const [stateIndex, state] of (game.states ?? []).entries()) {
      requireValue(isNonEmpty(state?.id), `exercises[${index}].game.states[${stateIndex}].id is required`);
      requireValue(isSubstantive(state?.visibleConsequence, 28, 4), `exercises[${index}].game.states[${stateIndex}].visibleConsequence must be substantive`);
    }
    requireValue(nonEmptyArray(game.choices) && game.choices.length >= 2, `exercises[${index}] game.choices needs at least two consequential choices`);
    const choiceIds = (game.choices ?? []).map((choice) => choice?.id).filter(Boolean);
    const choiceById = new Map((game.choices ?? []).map((choice) => [choice?.id, choice]));
    requireValue(duplicateValues(choiceIds).length === 0, `exercises[${index}] game choice ids must be unique`);
    for (const [choiceIndex, choice] of (game.choices ?? []).entries()) {
      requireValue(isNonEmpty(choice?.id), `exercises[${index}].game.choices[${choiceIndex}].id is required`);
      requireValue(stateIds.includes(choice?.fromStateId), `exercises[${index}].game.choices[${choiceIndex}].fromStateId must reference a state`);
      requireValue(stateIds.includes(choice?.toStateId), `exercises[${index}].game.choices[${choiceIndex}].toStateId must reference a state`);
      requireValue(choice?.fromStateId !== choice?.toStateId, `exercises[${index}].game.choices[${choiceIndex}] must change state`);
      requireValue(isSubstantive(choice?.stateDelta, 28, 4), `exercises[${index}].game.choices[${choiceIndex}].stateDelta must be substantive`);
      requireValue(isSubstantive(choice?.consequence, 32, 5), `exercises[${index}].game.choices[${choiceIndex}].consequence must be substantive`);
      requireValue(Array.isArray(choice?.nextChoiceIds), `exercises[${index}].game.choices[${choiceIndex}].nextChoiceIds must be an array`);
      requireValue(duplicateValues(choice?.nextChoiceIds ?? []).length === 0, `exercises[${index}].game.choices[${choiceIndex}].nextChoiceIds must be unique`);
      for (const nextChoiceId of choice?.nextChoiceIds ?? []) {
        requireValue(choiceIds.includes(nextChoiceId), `exercises[${index}].game.choices[${choiceIndex}] references unknown next choice '${nextChoiceId}'`);
        requireValue(
          choiceById.get(nextChoiceId)?.fromStateId === choice?.toStateId,
          `exercises[${index}].game.choices[${choiceIndex}] next choice '${nextChoiceId}' must begin at destination state '${choice?.toStateId}'`,
        );
      }
      const expectedNextChoiceIds = (game.choices ?? [])
        .filter((candidate) => candidate?.fromStateId === choice?.toStateId)
        .map((candidate) => candidate?.id)
        .filter(Boolean)
        .sort();
      const declaredNextChoiceIds = [...(choice?.nextChoiceIds ?? [])].sort();
      requireValue(
        JSON.stringify(declaredNextChoiceIds) === JSON.stringify(expectedNextChoiceIds),
        `exercises[${index}].game.choices[${choiceIndex}].nextChoiceIds must match the choices available from destination state '${choice?.toStateId}'`,
      );
    }
    const reachableStates = new Set([game.initialStateId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const choice of game.choices ?? []) {
        if (reachableStates.has(choice?.fromStateId) && !reachableStates.has(choice?.toStateId)) {
          reachableStates.add(choice.toStateId);
          changed = true;
        }
      }
    }
    requireValue(
      (game.states ?? []).every((state) => reachableStates.has(state?.id)),
      `exercises[${index}] game states must all be reachable from initialStateId`,
    );
    requireValue(
      (game.choices ?? []).every((choice) => reachableStates.has(choice?.fromStateId)),
      `exercises[${index}] game choices must all be reachable from initialStateId`,
    );
    const hasReachableFork = (game.states ?? []).some((state) => {
      if (!reachableStates.has(state?.id)) return false;
      const outgoingChoices = (game.choices ?? []).filter((choice) => choice?.fromStateId === state.id);
      return outgoingChoices.length >= 2
        && new Set(outgoingChoices.map((choice) => choice?.toStateId)).size >= 2;
    });
    requireValue(
      hasReachableFork,
      `exercises[${index}] game needs a reachable state with at least two choices leading to different states`,
    );
    requireValue(stateIds.includes(game?.replay?.resetsToStateId), `exercises[${index}] game replay must reset to a known state`);
    requireValue(nonEmptyArray(game?.replay?.preserves), `exercises[${index}] game replay must state what learner evidence is preserved`);
    requireValue(isSubstantive(game?.replay?.changes, 28, 4), `exercises[${index}] game replay must state what changes on replay`);
  }
}

for (const block of semanticBlocks.filter((item) => item.type === "consequence-reveal")) {
  requireValue(
    claimedConsequenceRevealBlockIds.filter((blockId) => blockId === block.id).length === 1,
    `consequence-reveal semantic block '${block.id}' must belong to exactly one exercise with consequenceReveal.present true`,
  );
}
for (const block of semanticBlocks.filter((item) => item.type === "consequence-revision")) {
  requireValue(
    claimedConsequenceRevisionBlockIds.filter((blockId) => blockId === block.id).length === 1,
    `consequence-revision semantic block '${block.id}' must belong to exactly one exercise with consequenceReveal.present true`,
  );
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
