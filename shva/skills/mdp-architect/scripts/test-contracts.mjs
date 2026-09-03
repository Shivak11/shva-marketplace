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

  const ungatedFilledReveal = clone(validSession);
  ungatedFilledReveal.session.exercises[0].filledEditionReveal.requiresParticipantInput = false;
  expectFailure("ungated filled-edition reveal", sessionValidator, writeMutation("ungated-filled-reveal", ungatedFilledReveal), "filled-edition reveal must require participant input");

  const mismatchedFilledEdition = clone(validSession);
  mismatchedFilledEdition.session.exercises[0].filledEdition.fields.pop();
  expectFailure("mismatched filled edition", sessionValidator, writeMutation("mismatched-filled-edition", mismatchedFilledEdition), "filled-edition fields must match participant fields in order");

  const disconnectedExercise = clone(validSession);
  disconnectedExercise.session.exercises[0].chapterConnection.unresolvedConsequence = "Connected.";
  expectFailure("disconnected exercise", sessionValidator, writeMutation("disconnected-exercise", disconnectedExercise), "chapterConnection.unresolvedConsequence must state the live chapter problem");

  const aiFirst = clone(validSession);
  const bookOrder = aiFirst.session.surfaces.book.semanticBlockIds;
  const commitmentIndex = bookOrder.indexOf("commitment-first-map");
  const challengeIndex = bookOrder.indexOf("ai-challenge-map");
  [bookOrder[commitmentIndex], bookOrder[challengeIndex]] = [bookOrder[challengeIndex], bookOrder[commitmentIndex]];
  expectFailure("AI before commitment", sessionValidator, writeMutation("ai-before-commitment", aiFirst), "book must preserve commitment -> consequence reveal -> consequence revision -> AI challenge -> revision");

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
    ],
    choices: [
      {
        id: "pause-after-omission",
        fromStateId: "automatic",
        toStateId: "paused",
        stateDelta: "The recommendation stops and an evidence deadline becomes visible.",
        consequence: "Delay increases, but the omitted correction can influence the decision before execution.",
        nextChoiceIds: ["authorise-bounded-exception"],
      },
      {
        id: "authorise-bounded-exception",
        fromStateId: "paused",
        toStateId: "bounded",
        stateDelta: "The paused case becomes a time-bound and reviewable exception.",
        consequence: "Local context changes the outcome while precedent and challenge duties become explicit.",
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

  const disconnectedGame = clone(statefulGame);
  disconnectedGame.session.exercises[0].game.choices[0].nextChoiceIds = ["pause-after-omission"];
  expectFailure(
    "game next choice disconnected from reached state",
    sessionValidator,
    writeMutation("disconnected-game", disconnectedGame),
    "next choice 'pause-after-omission' must begin at destination state 'paused'",
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
