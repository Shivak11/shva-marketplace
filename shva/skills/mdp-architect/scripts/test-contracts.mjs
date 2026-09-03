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

function run(validator, fixturePath, validatorArgs = []) {
  return spawnSync(process.execPath, [validator, fixturePath, ...validatorArgs], { encoding: "utf8" });
}

function expectPass(label, validator, fixturePath, validatorArgs = []) {
  const result = run(validator, fixturePath, validatorArgs);
  assert.equal(result.status, 0, `${label} should pass\n${result.stderr}${result.stdout}`);
  console.log(`PASS ${label}`);
}

function expectFailure(label, validator, fixturePath, expectedText, validatorArgs = []) {
  const result = run(validator, fixturePath, validatorArgs);
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
  const approvedFoundationRecord = JSON.parse(fs.readFileSync(approvedFoundation, "utf8"));
  const validSession = JSON.parse(fs.readFileSync(validSessionPath, "utf8"));

  expectPass("approved full book foundation", foundationValidator, approvedFoundation, ["full"]);
  expectPass("approved book foundation defaults to full", foundationValidator, approvedFoundation);
  expectFailure("draft book foundation", foundationValidator, draftFoundation, "status must be approved before production");

  const proseOnlyFoundation = clone(approvedFoundationRecord);
  proseOnlyFoundation.approval.scopes = ["prose"];
  proseOnlyFoundation.titleSystems = [];
  proseOnlyFoundation.selectedTitleSystem = "";
  proseOnlyFoundation.authorAndFrontMatter = {};
  proseOnlyFoundation.visualIdentity = { directions: [], selectedDirection: "" };
  proseOnlyFoundation.openItems.deferred.push({
    field: "title and visual identity",
    blocksScopes: ["front-matter", "visual-production", "full"],
    reason: "The author approved manuscript prose while deliberately deferring the book identity work",
  });
  const proseOnlyPath = writeMutation("prose-only-foundation", proseOnlyFoundation);
  expectPass("approved prose-only foundation", foundationValidator, proseOnlyPath, ["prose"]);
  expectFailure("prose-only foundation requested as full", foundationValidator, proseOnlyPath, "does not approve requested 'full' work", ["full"]);
  expectFailure("prose-only foundation without explicit scope", foundationValidator, proseOnlyPath, "does not approve requested 'full' work");

  const deferredProseBlocker = clone(approvedFoundationRecord);
  deferredProseBlocker.openItems.deferred.push({
    field: "opening scene",
    blocksScopes: ["prose"],
    reason: "The opening evidence is deliberately deferred, so prose production cannot yet begin",
  });
  expectFailure(
    "scoped blocker inside deferred items",
    foundationValidator,
    writeMutation("deferred-prose-blocker", deferredProseBlocker),
    "openItems contains an item that blocks requested 'prose' work",
    ["prose"],
  );

  const fullOnlyBlocker = clone(approvedFoundationRecord);
  fullOnlyBlocker.openItems.blocking.push({
    field: "whole-book jacket assembly",
    blocksScopes: ["full"],
    reason: "The complete package cannot ship until final jacket assembly, while manuscript prose may continue",
  });
  expectPass(
    "full-only blocker does not block explicit prose work",
    foundationValidator,
    writeMutation("full-only-blocker", fullOnlyBlocker),
    ["prose"],
  );

  const duplicateTitleFoundation = clone(approvedFoundationRecord);
  duplicateTitleFoundation.titleSystems[1] = {
    ...duplicateTitleFoundation.titleSystems[0],
    name: "Renamed duplicate",
  };
  expectFailure(
    "renamed duplicate title system",
    foundationValidator,
    writeMutation("duplicate-title-foundation", duplicateTitleFoundation),
    "titleSystems must be materially different beyond their names",
    ["full"],
  );

  const duplicateVisualFoundation = clone(approvedFoundationRecord);
  duplicateVisualFoundation.visualIdentity.directions[1] = {
    ...duplicateVisualFoundation.visualIdentity.directions[0],
    name: "Renamed visual duplicate",
  };
  expectFailure(
    "renamed duplicate visual direction",
    foundationValidator,
    writeMutation("duplicate-visual-foundation", duplicateVisualFoundation),
    "visualIdentity.directions must be materially different beyond their names",
    ["full"],
  );

  expectPass("valid session model", sessionValidator, validSessionPath);
  expectFailure("broad invalid session model", sessionValidator, broadInvalidPath, "must commit before AI");

  const duplicateExerciseRecord = clone(validSession);
  duplicateExerciseRecord.session.exercises.push(clone(duplicateExerciseRecord.session.exercises[0]));
  duplicateExerciseRecord.session.exercises[1].name = "Contradictory duplicate exercise record";
  duplicateExerciseRecord.session.exercises[1].consequenceReveal = {
    present: false,
    notUsedReason: "This duplicate record claims that changed information is unnecessary for the same canonical exercise.",
  };
  expectFailure(
    "duplicate exercise record id",
    sessionValidator,
    writeMutation("duplicate-exercise-record-id", duplicateExerciseRecord),
    "exercise record ids must be unique",
  );

  const unboundExerciseBlock = clone(validSession);
  const canonicalExerciseBlock = unboundExerciseBlock.session.semanticBlocks.find((block) => block.type === "exercise");
  unboundExerciseBlock.session.semanticBlocks.push({
    ...clone(canonicalExerciseBlock),
    id: "exercise-without-record",
    text: "A second visible workbook exercise appears in every surface but has no executable exercise record.",
  });
  const canonicalExerciseLedger = unboundExerciseBlock.session.sourceLedger.find((entry) => entry.claimId === canonicalExerciseBlock.id);
  unboundExerciseBlock.session.sourceLedger.push({
    ...clone(canonicalExerciseLedger),
    claimId: "exercise-without-record",
    origin: "Adversarial contract fixture for an unbound visible exercise",
  });
  for (const surfaceName of ["book", "teaching", "slides"]) {
    unboundExerciseBlock.session.surfaces[surfaceName].semanticBlockIds.push("exercise-without-record");
  }
  unboundExerciseBlock.session.surfaces.teaching.coreSegments.at(-1).semanticBlockIds.push("exercise-without-record");
  unboundExerciseBlock.session.surfaces.slides.beats.push({
    id: "unbound-exercise",
    semanticBlockIds: ["exercise-without-record"],
  });
  expectFailure(
    "visible exercise block without exercise record",
    sessionValidator,
    writeMutation("visible-exercise-without-record", unboundExerciseBlock),
    "each exercise semantic block must map to exactly one exercise record",
  );

  const noVisual = clone(validSession);
  noVisual.session.surfaces.book.visuals = [];
  expectPass("zero-visual chapter", sessionValidator, writeMutation("zero-visual", noVisual));

  const thirdVisual = clone(validSession);
  const sourceVisual = thirdVisual.session.surfaces.book.visuals[0];
  thirdVisual.session.surfaces.book.visuals.push(
    { ...sourceVisual, id: "second-substantive-visual" },
    { ...sourceVisual, id: "third-substantive-visual" },
  );
  expectFailure("third substantive visual", sessionValidator, writeMutation("third-visual", thirdVisual), "book.visuals must contain no more than 2 substantive visuals");

  const ungatedConsequenceReveal = clone(validSession);
  ungatedConsequenceReveal.session.exercises[0].consequenceReveal.requiresParticipantInput = false;
  expectFailure("ungated consequence reveal", sessionValidator, writeMutation("ungated-consequence-reveal", ungatedConsequenceReveal), "consequence reveal must require participant input");

  const allFieldsBeforeConsequence = clone(validSession);
  allFieldsBeforeConsequence.session.exercises[0].consequenceReveal.requiredFieldIds = allFieldsBeforeConsequence.session.exercises[0].participantFields.map((field) => field.id);
  expectFailure(
    "first gate requiring every participant field",
    sessionValidator,
    writeMutation("all-fields-before-consequence", allFieldsBeforeConsequence),
    "consequence reveal requiredFieldIds must be a proper subset of participant fields",
  );

  const unwritableConsequenceField = clone(validSession);
  unwritableConsequenceField.session.exercises[0].consequenceReveal.requiredFieldIds = ["live-alternative"];
  expectFailure(
    "consequence gate requiring a later field",
    sessionValidator,
    writeMutation("unwritable-consequence-field", unwritableConsequenceField),
    "consequence reveal may require only fields writable at or before afterStepId",
  );

  const delayedConsequenceRevision = clone(validSession);
  delayedConsequenceRevision.session.exercises[0].consequenceReveal.revisionStepId = "test";
  expectFailure(
    "delayed consequence revision",
    sessionValidator,
    writeMutation("delayed-consequence-revision", delayedConsequenceRevision),
    "consequence reveal revision step must immediately follow its trigger step",
  );

  const consequenceAfterAI = clone(validSession);
  for (const surface of Object.values(consequenceAfterAI.session.surfaces)) {
    const order = surface.semanticBlockIds;
    const reveal = order.splice(order.indexOf("reveal-omitted-correction"), 1)[0];
    const revision = order.splice(order.indexOf("revision-after-consequence"), 1)[0];
    order.splice(order.indexOf("ai-challenge-map") + 1, 0, reveal, revision);
  }
  expectFailure(
    "consequence reveal after AI",
    sessionValidator,
    writeMutation("consequence-after-ai", consequenceAfterAI),
    "book must preserve commitment -> consequence reveal -> consequence revision -> AI challenge -> revision",
  );

  const teachingSequenceDrift = clone(validSession);
  const teachingSegments = teachingSequenceDrift.session.surfaces.teaching.coreSegments;
  const consequenceSegmentIndex = teachingSegments.findIndex((segment) => segment.id === "consequence-and-revision");
  const aiSegmentIndex = teachingSegments.findIndex((segment) => segment.id === "ai-challenge");
  [teachingSegments[consequenceSegmentIndex], teachingSegments[aiSegmentIndex]] = [teachingSegments[aiSegmentIndex], teachingSegments[consequenceSegmentIndex]];
  expectFailure(
    "teaching segments contradict declared reveal order",
    sessionValidator,
    writeMutation("teaching-sequence-drift", teachingSequenceDrift),
    "teaching.coreSegments must preserve the order of teaching.semanticBlockIds",
  );

  const slideSequenceDrift = clone(validSession);
  const slideBeats = slideSequenceDrift.session.surfaces.slides.beats;
  const consequenceBeatIndex = slideBeats.findIndex((beat) => beat.id === "consequence");
  const aiBeatIndex = slideBeats.findIndex((beat) => beat.id === "ai-challenge");
  [slideBeats[consequenceBeatIndex], slideBeats[aiBeatIndex]] = [slideBeats[aiBeatIndex], slideBeats[consequenceBeatIndex]];
  expectFailure(
    "slide beats contradict declared reveal order",
    sessionValidator,
    writeMutation("slide-sequence-drift", slideSequenceDrift),
    "slides.beats must preserve the order of slides.semanticBlockIds",
  );

  const noChangedInformation = clone(validSession);
  const consequenceBlockIds = new Set(["reveal-omitted-correction", "revision-after-consequence"]);
  noChangedInformation.session.semanticBlocks = noChangedInformation.session.semanticBlocks.filter((block) => !consequenceBlockIds.has(block.id));
  noChangedInformation.session.sourceLedger = noChangedInformation.session.sourceLedger.filter((entry) => !consequenceBlockIds.has(entry.claimId));
  for (const surface of Object.values(noChangedInformation.session.surfaces)) {
    surface.semanticBlockIds = surface.semanticBlockIds.filter((id) => !consequenceBlockIds.has(id));
  }
  const removedConsequenceSegment = noChangedInformation.session.surfaces.teaching.coreSegments.find((segment) => segment.id === "consequence-and-revision");
  noChangedInformation.session.surfaces.teaching.coreSegments.find((segment) => segment.id === "participant-commitment").minutes += removedConsequenceSegment.minutes;
  noChangedInformation.session.surfaces.teaching.coreSegments = noChangedInformation.session.surfaces.teaching.coreSegments.filter((segment) => segment.id !== "consequence-and-revision");
  noChangedInformation.session.surfaces.slides.beats = noChangedInformation.session.surfaces.slides.beats.filter((beat) => beat.id !== "consequence");
  noChangedInformation.session.exercises[0].consequenceReveal = {
    present: false,
    notUsedReason: "The learning comes from comparing two already visible authority designs; no new fact or counter-signal changes the decision.",
  };
  expectPass("exercise without changed-information reveal", sessionValidator, writeMutation("no-changed-information", noChangedInformation));

  const declaredAbsentRevealWithLiveBlocks = clone(validSession);
  declaredAbsentRevealWithLiveBlocks.session.exercises[0].consequenceReveal = {
    present: false,
    notUsedReason: "The author says the exercise compares visible alternatives and therefore needs no changed information at all.",
  };
  expectFailure(
    "absent reveal declaration retaining live reveal blocks",
    sessionValidator,
    writeMutation("absent-reveal-live-blocks", declaredAbsentRevealWithLiveBlocks),
    "must belong to exactly one exercise with consequenceReveal.present true",
  );

  const ungatedFilledReveal = clone(validSession);
  ungatedFilledReveal.session.exercises[0].filledEditionReveal.requiresParticipantInput = false;
  expectFailure("ungated filled-edition reveal", sessionValidator, writeMutation("ungated-filled-reveal", ungatedFilledReveal), "filled-edition reveal must require participant input");

  const mismatchedFilledEdition = clone(validSession);
  mismatchedFilledEdition.session.exercises[0].filledEdition.fields.pop();
  expectFailure("mismatched filled edition", sessionValidator, writeMutation("mismatched-filled-edition", mismatchedFilledEdition), "filled-edition fields must match participant fields in order");

  const orphanedParticipantField = clone(validSession);
  orphanedParticipantField.session.exercises[0].steps.find((step) => step.id === "revise").requiredFieldIds = ["executable-action"];
  expectFailure(
    "participant field with no writing step",
    sessionValidator,
    writeMutation("orphaned-participant-field", orphanedParticipantField),
    "participant field 'revision-condition' must be written by at least one exercise step",
  );

  const disconnectedExercise = clone(validSession);
  disconnectedExercise.session.exercises[0].chapterConnection.unresolvedConsequence = "Connected.";
  expectFailure("disconnected exercise", sessionValidator, writeMutation("disconnected-exercise", disconnectedExercise), "chapterConnection.unresolvedConsequence must state the live chapter problem");

  const aiFirst = clone(validSession);
  const bookOrder = aiFirst.session.surfaces.book.semanticBlockIds;
  const commitmentIndex = bookOrder.indexOf("commitment-first-map");
  const challengeIndex = bookOrder.indexOf("ai-challenge-map");
  [bookOrder[commitmentIndex], bookOrder[challengeIndex]] = [bookOrder[challengeIndex], bookOrder[commitmentIndex]];
  expectFailure("AI before commitment", sessionValidator, writeMutation("ai-before-commitment", aiFirst), "book must preserve commitment -> consequence reveal -> consequence revision -> AI challenge -> revision");

  const addUnboundLifecycleBlock = ({ type, id, text, insertBeforeId, teachingSegmentId, slideBeatId }) => {
    const mutation = clone(validSession);
    const sourceBlock = mutation.session.semanticBlocks.find((block) => block.type === type);
    mutation.session.semanticBlocks.push({ ...clone(sourceBlock), id, text });
    const sourceLedgerEntry = mutation.session.sourceLedger.find((entry) => entry.claimId === sourceBlock.id);
    mutation.session.sourceLedger.push({
      ...clone(sourceLedgerEntry),
      claimId: id,
      origin: `Adversarial contract fixture for an unbound ${type} block`,
    });
    for (const surfaceName of ["book", "teaching", "slides"]) {
      const ids = mutation.session.surfaces[surfaceName].semanticBlockIds;
      ids.splice(ids.indexOf(insertBeforeId), 0, id);
    }
    mutation.session.surfaces.teaching.coreSegments.find((segment) => segment.id === teachingSegmentId).semanticBlockIds.push(id);
    mutation.session.surfaces.slides.beats.find((beat) => beat.id === slideBeatId).semanticBlockIds.push(id);
    return mutation;
  };

  const unboundCommitment = addUnboundLifecycleBlock({
    type: "commitment",
    id: "unbound-commitment",
    text: "A second participant commitment appears before the canonical exercise without belonging to any exercise record.",
    insertBeforeId: "commitment-first-map",
    teachingSegmentId: "mechanism",
    slideBeatId: "path",
  });
  expectFailure(
    "unbound commitment block",
    sessionValidator,
    writeMutation("unbound-commitment", unboundCommitment),
    "commitment semantic block 'unbound-commitment' must belong to exactly one exercise",
  );

  const unboundAiChallenge = addUnboundLifecycleBlock({
    type: "ai-challenge",
    id: "unbound-ai-challenge",
    text: "An AI challenge appears before the participant's commitment without belonging to any exercise record.",
    insertBeforeId: "commitment-first-map",
    teachingSegmentId: "mechanism",
    slideBeatId: "path",
  });
  expectFailure(
    "unbound AI challenge before commitment",
    sessionValidator,
    writeMutation("unbound-ai-challenge", unboundAiChallenge),
    "ai-challenge semantic block 'unbound-ai-challenge' must belong to exactly one exercise",
  );

  const unboundRevision = addUnboundLifecycleBlock({
    type: "revision",
    id: "unbound-revision",
    text: "A second final revision appears without belonging to any exercise record or named decision sequence.",
    insertBeforeId: "transition-rule-placement",
    teachingSegmentId: "human-revision",
    slideBeatId: "final-revision",
  });
  expectFailure(
    "unbound final revision block",
    sessionValidator,
    writeMutation("unbound-revision", unboundRevision),
    "revision semantic block 'unbound-revision' must belong to exactly one exercise",
  );

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
  expectFailure("collapsed evidence mechanisms", sessionValidator, writeMutation("collapsed-comparison", collapsedComparison), "differentMechanisms must be substantive");

  const declaredSlideCompression = clone(validSession);
  declaredSlideCompression.session.surfaces.slides.semanticBlockIds = declaredSlideCompression.session.surfaces.slides.semanticBlockIds.filter((id) => id !== "lateral-port-drill");
  declaredSlideCompression.session.surfaces.slides.beats = declaredSlideCompression.session.surfaces.slides.beats.filter((beat) => beat.id !== "lateral");
  declaredSlideCompression.session.sourceLedger.find((entry) => entry.claimId === "lateral-port-drill").surfaces = ["book", "teaching"];
  expectPass("declared slide compression", sessionValidator, writeMutation("declared-slide-compression", declaredSlideCompression));

  const coreCaseOmitted = clone(validSession);
  coreCaseOmitted.session.semanticBlocks.find((block) => block.id === "case-return-to-work").requiredAcrossSurfaces = false;
  coreCaseOmitted.session.surfaces.book.semanticBlockIds = coreCaseOmitted.session.surfaces.book.semanticBlockIds.filter((id) => id !== "case-return-to-work");
  coreCaseOmitted.session.sourceLedger.find((entry) => entry.claimId === "case-return-to-work").surfaces = ["teaching", "slides"];
  expectFailure("core case omitted from Book", sessionValidator, writeMutation("core-case-omitted", coreCaseOmitted), "must be requiredAcrossSurfaces");

  const vacuousHinges = clone(validSession);
  for (const hinge of Object.values(vacuousHinges.session.narrativeHinges)) hinge.bridge = "Therefore.";
  expectFailure("vacuous narrative hinges", sessionValidator, writeMutation("vacuous-hinges", vacuousHinges), "bridge must state a substantive causal relation");

  const wrongHingeTypes = clone(validSession);
  wrongHingeTypes.session.narrativeHinges.sceneToConcept = {
    ...wrongHingeTypes.session.narrativeHinges.sceneToConcept,
    fromBlockId: "mechanism-exception-path",
    toBlockId: "transition-rule-placement",
  };
  expectFailure("mis-typed narrative hinge", sessionValidator, writeMutation("wrong-hinge-types", wrongHingeTypes), "fromBlockId has the wrong semantic type");

  const negativeMinutes = clone(validSession);
  negativeMinutes.session.surfaces.teaching.coreSegments[0].minutes = -8;
  negativeMinutes.session.surfaces.teaching.coreSegments[1].minutes = 28;
  expectFailure("negative segment minutes", sessionValidator, writeMutation("negative-minutes", negativeMinutes), "minutes must be a positive integer");

  const oneBlobSchedule = clone(validSession);
  oneBlobSchedule.session.surfaces.teaching.coreSegments = [{
    ...oneBlobSchedule.session.surfaces.teaching.coreSegments[0],
    id: "entire-session",
    minutes: 90,
    semanticBlockIds: [...oneBlobSchedule.session.surfaces.teaching.semanticBlockIds],
  }];
  expectFailure("one-blob schedule", sessionValidator, writeMutation("one-blob-schedule", oneBlobSchedule), "needs at least 6 distinct facilitation segments");

  const selfDeclaredOneBlobSchedule = clone(oneBlobSchedule);
  selfDeclaredOneBlobSchedule.programme.planningProfile.minimumCoreSegments = 1;
  expectFailure(
    "one-blob schedule hidden by planning profile",
    sessionValidator,
    writeMutation("self-declared-one-blob-schedule", selfDeclaredOneBlobSchedule),
    "needs at least 3 segments for a 90-minute session regardless of the selected planning profile",
  );

  const renamedCoreBlob = clone(validSession);
  const repeatedCoreSegment = clone(renamedCoreBlob.session.surfaces.teaching.coreSegments[0]);
  renamedCoreBlob.session.surfaces.teaching.coreSegments = Array.from({ length: 9 }, (_, index) => ({
    ...clone(repeatedCoreSegment),
    id: `renamed-core-${index + 1}`,
    minutes: 10,
  }));
  expectFailure(
    "one core move cloned behind unique ids",
    sessionValidator,
    writeMutation("renamed-core-blob", renamedCoreBlob),
    "teaching core segments must be materially distinct beyond their ids",
  );

  const renamedReserveBlob = clone(validSession);
  const repeatedReserve = clone(renamedReserveBlob.session.surfaces.teaching.depthReserves[0]);
  renamedReserveBlob.session.surfaces.teaching.depthReserves = Array.from({ length: 3 }, (_, index) => ({
    ...clone(repeatedReserve),
    id: `renamed-reserve-${index + 1}`,
    minutes: 10,
  }));
  expectFailure(
    "one reserve move cloned behind unique ids",
    sessionValidator,
    writeMutation("renamed-reserve-blob", renamedReserveBlob),
    "teaching depth reserves must be materially distinct beyond their ids",
  );

  const emptySourceFacts = clone(validSession);
  emptySourceFacts.session.semanticBlocks.find((block) => block.id === "claim-exception").sourceClass = "source-backed";
  const fabricatedLedger = emptySourceFacts.session.sourceLedger.find((entry) => entry.claimId === "claim-exception");
  fabricatedLedger.classification = "source-backed";
  fabricatedLedger.url = "https://example.org/not-a-source";
  fabricatedLedger.sourceTitle = "Placeholder source";
  fabricatedLedger.locator = "Unknown page";
  fabricatedLedger.supportedFacts = [];
  expectFailure("source-backed empty fact mapping", sessionValidator, writeMutation("empty-source-facts", emptySourceFacts), "needs at least one supported fact");

  const placeholderSourceUrl = clone(validSession);
  placeholderSourceUrl.session.semanticBlocks.find((block) => block.id === "claim-exception").sourceClass = "source-backed";
  const placeholderLedger = placeholderSourceUrl.session.sourceLedger.find((entry) => entry.claimId === "claim-exception");
  placeholderLedger.classification = "source-backed";
  placeholderLedger.url = "https://example.org/not-a-source";
  placeholderLedger.sourceTitle = "Placeholder source";
  placeholderLedger.locator = "Section labelled as an illustrative placeholder";
  placeholderLedger.supportedFacts = ["The hypothetical source is claimed to support this exception-authority statement."];
  expectFailure("placeholder source URL", sessionValidator, writeMutation("placeholder-source-url", placeholderSourceUrl), "cannot use a placeholder URL");

  const missingTermAudit = clone(validSession);
  delete missingTermAudit.session.terms;
  expectFailure("missing term register", sessionValidator, writeMutation("missing-terms", missingTermAudit), "session.terms must be an array");

  const missingComparisonAudit = clone(validSession);
  delete missingComparisonAudit.session.comparisonAudit;
  expectFailure("missing empty-comparison rationale", sessionValidator, writeMutation("missing-comparison-audit", missingComparisonAudit), "noComparisonNeededReason is required");

  const placeholderDecisionFork = clone(validSession);
  placeholderDecisionFork.session.exercises[0].decisionFork.question = "Decide.";
  expectFailure("placeholder decision fork", sessionValidator, writeMutation("placeholder-decision-fork", placeholderDecisionFork), "decisionFork.question must be substantive");

  const freeTextAiAuthorityBypass = clone(validSession);
  freeTextAiAuthorityBypass.session.exercises[0].aiRole = "AI will approve, deny, certify, and decide whether the named policy exception should proceed.";
  expectFailure(
    "free-text AI decision-authority bypass",
    sessionValidator,
    writeMutation("free-text-ai-authority", freeTextAiAuthorityBypass),
    "aiRole free text is not allowed",
  );

  const structuredAiAuthorityBypass = clone(validSession);
  structuredAiAuthorityBypass.session.exercises[0].aiAuthorityBoundary.mayDecide = true;
  expectFailure(
    "structured AI decision authority",
    sessionValidator,
    writeMutation("structured-ai-authority", structuredAiAuthorityBypass),
    "aiAuthorityBoundary.mayDecide must be false",
  );

  const shadowAiAuthorityFields = clone(validSession);
  shadowAiAuthorityFields.session.exercises[0].aiAuthorityBoundary.mayAuthorize = true;
  shadowAiAuthorityFields.session.exercises[0].aiAuthorityBoundary.mayWriteInitialAnswer = true;
  expectFailure(
    "shadow AI authority fields",
    sessionValidator,
    writeMutation("shadow-ai-authority-fields", shadowAiAuthorityFields),
    "aiAuthorityBoundary must contain only the five declared authority flags",
  );

  const aiSmuggledIntoHumanOwner = clone(validSession);
  aiSmuggledIntoHumanOwner.session.exercises[0].humanDecisionOwner = "The AI system is the final human decision owner for this policy exception.";
  expectFailure(
    "AI smuggled into free-text human owner",
    sessionValidator,
    writeMutation("ai-as-human-owner", aiSmuggledIntoHumanOwner),
    "humanDecisionOwner.actorType must be human-role",
  );

  const automatedDecisionOwner = clone(validSession);
  automatedDecisionOwner.session.exercises[0].humanDecisionOwner.actorType = "ai-system";
  automatedDecisionOwner.session.exercises[0].humanDecisionOwner.automationEligible = true;
  expectFailure(
    "automated actor declared as decision owner",
    sessionValidator,
    writeMutation("automated-decision-owner", automatedDecisionOwner),
    "humanDecisionOwner.actorType must be human-role",
  );

  const shadowHumanOwnerAuthority = clone(validSession);
  shadowHumanOwnerAuthority.session.exercises[0].humanDecisionOwner.delegateToAI = true;
  expectFailure(
    "shadow authority on human decision owner",
    sessionValidator,
    writeMutation("shadow-human-owner-authority", shadowHumanOwnerAuthority),
    "humanDecisionOwner must contain only the declared human-owner fields",
  );

  const unregisteredHumanDecisionOwner = clone(validSession);
  unregisteredHumanDecisionOwner.session.exercises[0].humanDecisionOwner.actorId = "ai-system";
  expectFailure(
    "unregistered actor id smuggled into human decision owner",
    sessionValidator,
    writeMutation("unregistered-human-decision-owner", unregisteredHumanDecisionOwner),
    "humanDecisionOwner.actorId must reference a declared actor",
  );

  const registeredAiDecisionOwner = clone(validSession);
  registeredAiDecisionOwner.session.actorRegistry.push({
    id: "ai-system",
    displayName: "AI decision system",
    actorType: "ai-system",
    automationEligible: true,
    introducedInBlockId: "case-return-to-work",
  });
  registeredAiDecisionOwner.session.semanticBlocks.find((block) => block.id === "case-return-to-work").actorIds.push("ai-system");
  registeredAiDecisionOwner.session.exercises[0].humanDecisionOwner.actorId = "ai-system";
  expectFailure(
    "registered AI actor smuggled into human decision owner",
    sessionValidator,
    writeMutation("registered-ai-decision-owner", registeredAiDecisionOwner),
    "humanDecisionOwner must reference a registered human-role",
  );

  const humanOwnerIntroducedAfterCommitment = clone(validSession);
  const lateOwnerBookOrder = humanOwnerIntroducedAfterCommitment.session.surfaces.book.semanticBlockIds;
  lateOwnerBookOrder.splice(lateOwnerBookOrder.indexOf("case-return-to-work"), 1);
  lateOwnerBookOrder.splice(lateOwnerBookOrder.indexOf("commitment-first-map") + 1, 0, "case-return-to-work");
  expectFailure(
    "human decision owner first introduced after commitment",
    sessionValidator,
    writeMutation("late-human-decision-owner", humanOwnerIntroducedAfterCommitment),
    "book must introduce the exercise case and its human decision owner before commitment",
  );

  const aiChallengeProseOverridesBoundary = clone(validSession);
  aiChallengeProseOverridesBoundary.session.semanticBlocks.find((block) => block.type === "ai-challenge").text = "AI reviews the evidence, approves or denies the exception, authorises the action, and makes the final decision for the organisation.";
  expectFailure(
    "canonical AI-challenge prose overrides authority boundary",
    sessionValidator,
    writeMutation("ai-challenge-prose-authority", aiChallengeProseOverridesBoundary),
    "ai-challenge must not contain free-text visible content",
  );

  const duplicateDecisionOptions = clone(validSession);
  duplicateDecisionOptions.session.exercises[0].decisionFork.options[1].action = duplicateDecisionOptions.session.exercises[0].decisionFork.options[0].action;
  duplicateDecisionOptions.session.exercises[0].decisionFork.options[1].acceptedConsequence = duplicateDecisionOptions.session.exercises[0].decisionFork.options[0].acceptedConsequence;
  expectFailure(
    "renamed duplicate decision option",
    sessionValidator,
    writeMutation("duplicate-decision-option", duplicateDecisionOptions),
    "decisionFork options must be materially distinct",
  );

  const placeholderVisual = clone(validSession);
  placeholderVisual.session.surfaces.book.visuals[0].visualJob = "Looks good";
  placeholderVisual.session.surfaces.book.visuals[0].proseRemoved = "None";
  expectFailure("decorative visual declaration", sessionValidator, writeMutation("placeholder-visual", placeholderVisual), "visualJob must name the relation made easier to see");

  const placeholderFilledEdition = clone(validSession);
  placeholderFilledEdition.session.exercises[0].filledEdition.fields[0].answer = "x";
  expectFailure("placeholder filled-edition answer", sessionValidator, writeMutation("placeholder-filled", placeholderFilledEdition), "must be a realistic completed answer");

  const falseGame = clone(validSession);
  falseGame.session.exercises[0].game = {
    choiceChangesState: true,
    revealChangesNextChoice: true,
    scoreMeaning: "A higher score means a better answer",
  };
  expectFailure("interface-theatre game", sessionValidator, writeMutation("false-game", falseGame), "game.states needs at least two states");

  const statefulGame = clone(validSession);
  statefulGame.session.exercises[0].game = {
    stateMeaning: "The visible state records whether the exception remains automatic, paused, or bounded by review.",
    initialStateId: "automatic",
    states: [
      { id: "automatic", visibleConsequence: "The ordinary recommendation proceeds while the omitted correction remains outside the record." },
      { id: "paused", visibleConsequence: "Execution stops temporarily while named evidence is gathered and tested." },
      { id: "bounded", visibleConsequence: "A time-bound exception proceeds with an owner, explanation, and review trigger." },
      { id: "ordinary-rule", visibleConsequence: "The ordinary recommendation proceeds and its accepted loss of local context remains visible." },
    ],
    choices: [
      {
        id: "pause-after-omission",
        decisionOptionId: "pause-case",
        fromStateId: "automatic",
        toStateId: "paused",
        stateDelta: "The recommendation stops and an evidence deadline becomes visible.",
        consequence: "Delay increases, but the omitted correction can influence the decision before execution.",
        nextChoiceIds: ["authorise-bounded-exception"],
      },
      {
        id: "authorise-bounded-exception",
        decisionOptionId: "bounded-exception",
        fromStateId: "paused",
        toStateId: "bounded",
        stateDelta: "The paused case becomes a time-bound and reviewable exception.",
        consequence: "Local context changes the outcome while precedent and challenge duties become explicit.",
        nextChoiceIds: [],
      },
      {
        id: "authorise-without-pause",
        decisionOptionId: "bounded-exception",
        fromStateId: "automatic",
        toStateId: "bounded",
        stateDelta: "The ordinary recommendation is replaced immediately by a bounded exception.",
        consequence: "The omitted correction affects the decision quickly, but the learner accepts less time for independent evidence testing.",
        nextChoiceIds: [],
      },
      {
        id: "apply-ordinary-rule",
        decisionOptionId: "follow-rule",
        fromStateId: "automatic",
        toStateId: "ordinary-rule",
        stateDelta: "The recommendation leaves the exception path and becomes an ordinary execution decision.",
        consequence: "Consistency is preserved while the learner explicitly accepts that the omitted correction will not alter this decision.",
        nextChoiceIds: [],
      },
    ],
    replay: {
      resetsToStateId: "automatic",
      preserves: ["the learner's first commitment", "the revealed omission"],
      changes: "The learner chooses again with the prior consequence and explanation still visible.",
    },
  };
  expectPass("stateful consequential game", sessionValidator, writeMutation("stateful-game", statefulGame));

  const gameChoiceWithoutDecisionOption = clone(statefulGame);
  delete gameChoiceWithoutDecisionOption.session.exercises[0].game.choices[0].decisionOptionId;
  expectFailure(
    "game choice disconnected from decision fork",
    sessionValidator,
    writeMutation("game-choice-without-decision-option", gameChoiceWithoutDecisionOption),
    "decisionOptionId must reference a decisionFork option",
  );

  const indistinguishableGameChoices = clone(statefulGame);
  const repeatedStateDelta = indistinguishableGameChoices.session.exercises[0].game.choices[0].stateDelta;
  const repeatedChoiceConsequence = indistinguishableGameChoices.session.exercises[0].game.choices[0].consequence;
  indistinguishableGameChoices.session.exercises[0].game.choices[2].stateDelta = repeatedStateDelta;
  indistinguishableGameChoices.session.exercises[0].game.choices[2].consequence = repeatedChoiceConsequence;
  expectFailure(
    "different game routes with indistinguishable consequences",
    sessionValidator,
    writeMutation("indistinguishable-game-choices", indistinguishableGameChoices),
    "choices from game state 'automatic' must have visibly distinct consequences",
  );

  const invisibleStateGame = clone(statefulGame);
  const repeatedVisibleConsequence = invisibleStateGame.session.exercises[0].game.states[0].visibleConsequence;
  for (const state of invisibleStateGame.session.exercises[0].game.states) {
    state.visibleConsequence = repeatedVisibleConsequence;
  }
  expectFailure(
    "different state ids with no visible difference",
    sessionValidator,
    writeMutation("invisible-state-game", invisibleStateGame),
    "game state visible consequences must be distinct",
  );

  const forcedLinearGame = clone(statefulGame);
  forcedLinearGame.session.exercises[0].game.choices = forcedLinearGame.session.exercises[0].game.choices.filter(
    (choice) => !["authorise-without-pause", "apply-ordinary-rule"].includes(choice.id),
  );
  expectFailure(
    "forced linear click-through presented as game",
    sessionValidator,
    writeMutation("forced-linear-game", forcedLinearGame),
    "game needs a reachable state with at least two choices leading to different states",
  );

  const disconnectedGame = clone(statefulGame);
  disconnectedGame.session.exercises[0].game.choices[0].nextChoiceIds = ["pause-after-omission"];
  expectFailure(
    "game next choice disconnected from reached state",
    sessionValidator,
    writeMutation("disconnected-game", disconnectedGame),
    "next choice 'pause-after-omission' must begin at destination state 'paused'",
  );

  const replaySkipsInitialFork = clone(statefulGame);
  replaySkipsInitialFork.session.exercises[0].game.replay.resetsToStateId = "paused";
  expectFailure(
    "game replay skips initial decision fork",
    sessionValidator,
    writeMutation("replay-skips-initial-fork", replaySkipsInitialFork),
    "game replay must reset to initialStateId",
  );

  const sixtyMinuteProfile = clone(validSession);
  sixtyMinuteProfile.programme.officialSessionMinutes = 60;
  sixtyMinuteProfile.programme.preparedRunwayMinutes = 75;
  sixtyMinuteProfile.programme.planningProfile.narrativeWordRange = { minimum: 2500, maximum: 3600 };
  sixtyMinuteProfile.session.surfaces.book.narrativeWords = 3100;
  const sixtyMinuteCore = [5, 7, 10, 6, 4, 10, 8, 5, 5];
  sixtyMinuteProfile.session.surfaces.teaching.coreSegments.forEach((segment, index) => {
    segment.minutes = sixtyMinuteCore[index];
  });
  sixtyMinuteProfile.session.surfaces.teaching.depthReserves.forEach((reserve) => {
    reserve.minutes = 5;
  });
  expectPass("configured 60-minute profile", sessionValidator, writeMutation("sixty-minute-profile", sixtyMinuteProfile));

  const nonHrForwardModel = clone(validSession);
  nonHrForwardModel.programme.title = "Operating Through Port Disruption";
  nonHrForwardModel.session.title = "Who May Close the Channel?";
  nonHrForwardModel.session.bookReader = "A general reader interested in accountable decisions under operational uncertainty";
  nonHrForwardModel.session.participantAudience = "Port operations, safety, finance, and logistics leaders";
  nonHrForwardModel.session.assumedKnowledge.book = "No prior knowledge of port operations, maritime safety, or decision-system design";
  nonHrForwardModel.session.assumedKnowledge.teaching = "Experience with operational trade-offs; maritime terms are introduced before use";
  nonHrForwardModel.session.sourceLedger.find((entry) => entry.claimId === "case-return-to-work").origin = "Composite port-closure workflow created for cross-domain schema testing";
  nonHrForwardModel.session.sourceLedger.find((entry) => entry.claimId === "case-return-to-work").sourceType = "composite operations case";
  expectPass("non-HR forward model", sessionValidator, writeMutation("non-hr-forward-model", nonHrForwardModel));

  console.log("PASS all MDP Architect contract tests");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
