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
const validator = path.join(scriptDir, "validate-programme-thesis.mjs");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdp-programme-thesis-"));
const clone = (value) => JSON.parse(JSON.stringify(value));

function fixture(name) {
  return path.join(fixturesDir, `programme-thesis.${name}.json`);
}

function readFixture(name) {
  return JSON.parse(fs.readFileSync(fixture(name), "utf8"));
}

function writeMutation(label, record) {
  const outputPath = path.join(tempDir, `${label}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(record, null, 2)}\n`);
  return outputPath;
}

function run(inputPath, scope = "full") {
  return spawnSync(process.execPath, [validator, inputPath, scope], { encoding: "utf8" });
}

function expectPass(label, inputPath, scope = "full") {
  const result = run(inputPath, scope);
  assert.equal(result.status, 0, `${label} should pass\n${result.stderr}${result.stdout}`);
  console.log(`PASS ${label}`);
}

function expectFailure(label, inputPath, expectedText, scope = "full") {
  const result = run(inputPath, scope);
  assert.notEqual(result.status, 0, `${label} should fail`);
  assert.match(
    `${result.stderr}${result.stdout}`,
    new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    `${label} should fail for '${expectedText}'`,
  );
  console.log(`PASS ${label} rejects ${expectedText}`);
}

function appendSynthesis(record, id, claim, inputClaimIds) {
  record.evidenceBoundaries.push({
    id,
    claim,
    evidenceClass: "author_synthesis",
    inputClaimIds,
    known: "The inspected inputs establish the design condition named in this audit decision.",
    uncertain: "The resulting learning move still requires testing with participants in the target setting.",
    allowedUse: "Use to justify this bounded architecture decision and revise it when learner evidence changes.",
  });
}

function makeUnderSpecified(base) {
  const record = clone(base);
  const decision = "Which workplace decision should anchor the participant exercise?";
  record.recordId = "programme-thesis-under-specified-workplace";
  record.trigger = {
    kind: "under-specified-architecture",
    reason: "The subject is known but the consequential learner decision and carried performance remain unapproved.",
    inspectedEvidence: [
      "Sponsor's one-page topic brief",
      "Available participant role list",
    ],
    reusedRecord: null,
    materialChangeDetected: true,
    interviewAction: "continue-interview",
  };
  record.openDecisions = [{
    decision,
    options: [
      "Use a customer exception decision",
      "Use a cross-functional investment decision",
      "Use an operational recovery decision",
    ],
    productionConsequence: "The choice changes the sustained case, required evidence, participant artifact, and session sequence.",
    blockingScopes: ["artifact-production"],
  }];
  record.approval = {
    status: "draft",
    scope: [],
    approvedBy: "",
    approvedAt: "",
    provenance: "The record remains provisional until the author selects the anchor decision in chat.",
  };
  record.productionDecision = {
    state: "stop",
    nextAction: "Continue in chat with a compact choice-led question before producing HTML or another artifact.",
    blockedBy: [decision],
    bookFoundation: {
      required: false,
      status: "not-applicable",
      record: "",
    },
  };
  return record;
}

function makeApprovedReuse(base) {
  const record = clone(base);
  record.trigger = {
    kind: "approved-record-reuse",
    reason: "The requested session is already inside the approved programme scope and introduces no material thesis change.",
    inspectedEvidence: [
      "Current approved Programme Thesis Record",
      "Requested session brief and its mapped progression stage",
    ],
    reusedRecord: record.recordId,
    materialChangeDetected: false,
    interviewAction: "reuse-approved-record",
  };
  return record;
}

try {
  const ob = readFixture("ob-ai-redesign");
  const product = readFixture("product-thinking-greenfield");
  const leadership = readFixture("non-ai-leadership");
  const visualCraft = readFixture("visual-craft");
  const strategy = readFixture("strategy-preserved");
  const book = readFixture("book-shaped");
  const workshop = readFixture("workshop");

  // Required cross-domain behaviour cases 1-6.
  expectPass("existing OB syllabus redesigned for an AI-shaped workplace", fixture("ob-ai-redesign"));
  expectPass("greenfield product-thinking from author practice", fixture("product-thinking-greenfield"));
  expectPass("non-AI leadership with transformation lens not applicable", fixture("non-ai-leadership"));
  expectPass("non-organisational visual craft programme", fixture("visual-craft"));
  expectPass("existing strategy outline largely preserved", fixture("strategy-preserved"));
  expectPass("book-shaped work with separate approved Book Foundation", fixture("book-shaped"));
  expectPass("workshop thesis without book-identity gate", fixture("workshop"));

  // Required routing cases 7-8 are deterministic mutations of valid unrelated domains.
  const underSpecified = makeUnderSpecified(workshop);
  const underSpecifiedPath = writeMutation("under-specified-stops-in-chat", underSpecified);
  expectPass("under-specified request stops in chat before artifact production", underSpecifiedPath, "artifact-production");

  const approvedReuse = makeApprovedReuse(product);
  const approvedReusePath = writeMutation("approved-record-reuse", approvedReuse);
  expectPass("approved unchanged request reuses thesis without re-interview", approvedReusePath);

  const wrongReuseIdentity = clone(approvedReuse);
  wrongReuseIdentity.trigger.reusedRecord = "different-approved-record";
  expectFailure("approved reuse must name the governing record", writeMutation("wrong-reuse-identity", wrongReuseIdentity), "must reference the Programme Thesis Record being validated");

  // Scoped approval and blockers.
  const sessionOnly = clone(product);
  sessionOnly.approval.scope = ["session-production"];
  expectPass("session-only approval permits session work", writeMutation("session-only-approval", sessionOnly), "session-production");
  expectFailure(
    "session-only approval cannot authorize artifact production",
    writeMutation("session-only-artifact-request", sessionOnly),
    "approval.scope does not approve requested 'artifact-production' work",
    "artifact-production",
  );

  const artifactBlocked = clone(product);
  artifactBlocked.openDecisions.push({
    decision: "Which observable product decision will appear in the public prototype?",
    options: ["Use the onboarding decision", "Use the pricing decision"],
    productionConsequence: "The answer changes the public case, data boundary, and artifact fields.",
    blockingScopes: ["artifact-production"],
  });
  expectPass("artifact blocker does not stop separately approved session work", writeMutation("artifact-blocker-session", artifactBlocked), "session-production");
  expectFailure(
    "artifact blocker stops artifact work",
    writeMutation("artifact-blocker-artifact", artifactBlocked),
    "openDecisions contains an item that blocks requested 'artifact-production' work",
    "artifact-production",
  );

  const draftProceed = clone(underSpecified);
  draftProceed.productionDecision.state = "proceed";
  draftProceed.productionDecision.blockedBy = [];
  expectFailure("draft record cannot proceed", writeMutation("draft-proceed", draftProceed), "production cannot proceed before the Programme Thesis Record is approved", "artifact-production");

  const draftWithApprover = clone(underSpecified);
  draftWithApprover.approval.approvedBy = "Premature approver";
  expectFailure("draft record cannot imply approval", writeMutation("draft-with-approver", draftWithApprover), "draft thesis record cannot name an approver", "artifact-production");

  // Book and workshop gates remain distinct.
  const bookFoundationPending = clone(book);
  bookFoundationPending.productionDecision.bookFoundation.status = "required";
  bookFoundationPending.productionDecision.bookFoundation.record = "";
  expectFailure("book cannot proceed with foundation pending", writeMutation("book-foundation-pending", bookFoundationPending), "book production cannot proceed until the separate Book Foundation Record is approved");

  const workshopWithBookGate = clone(workshop);
  workshopWithBookGate.productionDecision.bookFoundation = {
    required: true,
    status: "approved",
    record: "book-foundation-unwanted-workshop",
  };
  expectFailure("workshop cannot be forced through book questions", writeMutation("workshop-forced-book-gate", workshopWithBookGate), "non-book work must not force the Book Foundation interview");

  // Transformation applicability and generic-AI leakage.
  const invalidLens = clone(product);
  invalidLens.transformationLens.applicability = "Mandatory";
  expectFailure("unsupported transformation applicability", writeMutation("invalid-lens", invalidLens), "must be Central, Supporting, or Not applicable");

  const forcedMechanism = clone(leadership);
  forcedMechanism.transformationLens.changedMechanisms = ["agency"];
  expectFailure("not-applicable lens cannot force a mechanism", writeMutation("forced-mechanism", forcedMechanism), "must not force an AI-age mechanism");

  const forcedAi = clone(product);
  forcedAi.thesis.distinctiveArgument = "Use AI for insights across every product decision in the programme.";
  expectFailure("not-applicable lens cannot smuggle generic AI into the architecture", writeMutation("forced-generic-ai", forcedAi), "cannot substitute generic AI language");

  const aiWithoutMechanism = clone(ob);
  aiWithoutMechanism.transformationLens.changedMechanisms = [];
  expectFailure("AI redesign must name changed mechanism", writeMutation("ai-without-mechanism", aiWithoutMechanism), "AI-relevant transformation must name the changed mechanism");

  const aiOnlyInArgument = clone(strategy);
  aiOnlyInArgument.thesis.distinctiveArgument = "Artificial intelligence compresses assumption review, so the course must make the resulting coordination work visible and testable.";
  expectFailure("AI named only in the argument still needs a mechanism", writeMutation("ai-only-in-argument", aiOnlyInArgument), "AI-relevant transformation must name the changed mechanism");

  const pluralLlmOnlyInArgument = clone(strategy);
  pluralLlmOnlyInArgument.thesis.distinctiveArgument = "Large language models can challenge strategic assumptions quickly, so the course must redesign how that contribution enters review.";
  expectFailure("plural large language models still need a mechanism", writeMutation("plural-llm-only-in-argument", pluralLlmOnlyInArgument), "AI-relevant transformation must name the changed mechanism");

  const speculativeFuture = clone(ob);
  speculativeFuture.thesis.changedCondition = "Automation will inevitably replace every manager and remove all coordination work.";
  expectFailure("speculative inevitability", writeMutation("speculative-inevitability", speculativeFuture), "cannot present a speculative future as inevitable");

  const genericOutcomeJargon = clone(product);
  genericOutcomeJargon.capabilityProgression[0].learnerMove = "CLO 1 asks learners to understand product thinking concepts.";
  expectFailure("CLO shorthand cannot replace capability", writeMutation("clo-jargon", genericOutcomeJargon), "rather than CLO/PLO shorthand");

  const domainLeakage = clone(product);
  domainLeakage.exclusions.outOfScope.push("CHRO audience");
  domainLeakage.programme.audience = "A CHRO audience buying an unrelated employment transformation course";
  expectFailure("foreign domain leakage", writeMutation("foreign-domain-leakage", domainLeakage), "contains excluded or foreign framing 'CHRO audience'");

  // Evidence classes, provenance, and epistemic boundaries.
  const invalidEvidenceClass = clone(product);
  invalidEvidenceClass.evidenceBoundaries[0].evidenceClass = "anecdote";
  expectFailure("undeclared evidence class", writeMutation("invalid-evidence-class", invalidEvidenceClass), "must use a declared evidence class");

  const missingExternalLocator = clone(book);
  delete missingExternalLocator.evidenceBoundaries[0].locator;
  expectFailure("external evidence without locator", writeMutation("missing-external-locator", missingExternalLocator), "is missing keys: locator");

  const placeholderExternalUrl = clone(book);
  placeholderExternalUrl.evidenceBoundaries[0].sourceUrl = "https://example.org/source";
  expectFailure("placeholder external source", writeMutation("placeholder-external-url", placeholderExternalUrl), "cannot be a placeholder URL");

  const unattributedExperience = clone(product);
  delete unattributedExperience.evidenceBoundaries[0].attribution;
  expectFailure("author experience without attribution", writeMutation("unattributed-experience", unattributedExperience), "is missing keys: attribution");

  const anecdoteAsFact = clone(product);
  anecdoteAsFact.evidenceBoundaries[0].allowedUse = "This proves a universal pattern across every product organisation.";
  expectFailure("author observation presented as universal fact", writeMutation("anecdote-as-fact", anecdoteAsFact), "cannot turn author experience into a general fact");

  const unknownSynthesisInput = clone(product);
  unknownSynthesisInput.evidenceBoundaries.find((item) => item.evidenceClass === "author_synthesis").inputClaimIds = ["evidence-missing-input"];
  expectFailure("synthesis without real inputs", writeMutation("unknown-synthesis-input", unknownSynthesisInput), "contains an unknown evidence-boundary id");

  const openHypothesis = clone(product);
  openHypothesis.evidenceBoundaries.push({
    id: "evidence-product-open-transfer",
    claim: "The commitment record may transfer effectively to public-sector product teams.",
    evidenceClass: "open_hypothesis",
    falsificationCondition: "Two bounded trials fail to improve how teams explain or revise their selected commitment.",
    dependentScopes: ["artifact-production"],
    known: "The current evidence comes only from commercial product settings.",
    uncertain: "Transfer to public-sector constraints has not yet been tested.",
    allowedUse: "Use only as a hypothesis for a bounded trial, never as an established programme claim.",
  });
  openHypothesis.thesis.distinctiveArgumentEvidenceId = "evidence-product-open-transfer";
  expectPass("open hypothesis may remain open outside dependent scope", writeMutation("open-hypothesis-architecture", openHypothesis), "architecture");
  expectFailure("open hypothesis cannot authorize dependent artifact scope", writeMutation("open-hypothesis-artifact", openHypothesis), "cannot be treated as settled for dependent 'artifact-production' production", "artifact-production");

  const missingFalsification = clone(openHypothesis);
  delete missingFalsification.evidenceBoundaries.find((item) => item.id === "evidence-product-open-transfer").falsificationCondition;
  expectFailure("open hypothesis without falsification condition", writeMutation("missing-falsification", missingFalsification), "is missing keys: falsificationCondition", "architecture");

  const unknownLoadBearingEvidence = clone(product);
  unknownLoadBearingEvidence.thesis.recognisedProblemEvidenceId = "evidence-product-unknown";
  expectFailure("load-bearing claim without evidence boundary", writeMutation("unknown-load-evidence", unknownLoadBearingEvidence), "references unknown evidence boundary 'evidence-product-unknown'");

  const reusedLoadBearingEvidence = clone(product);
  reusedLoadBearingEvidence.thesis.distinctiveArgumentEvidenceId = reusedLoadBearingEvidence.thesis.recognisedProblemEvidenceId;
  expectFailure("distinct claims cannot share one evidence label ceremonially", writeMutation("duplicate-load-evidence", reusedLoadBearingEvidence), "each load-bearing thesis, audit, and public-contribution claim needs a unique evidenceBoundaryId");

  const auditClassMismatch = clone(strategy);
  auditClassMismatch.inheritedMaterial.audit[0].evidenceStatus = "established_external";
  expectFailure("audit evidence status must match evidence record", writeMutation("audit-evidence-mismatch", auditClassMismatch), "evidenceStatus must match its referenced evidence boundary class");

  // Transformation-audit dispositions have different executable shapes.
  const strategyWithAdd = clone(strategy);
  appendSynthesis(
    strategyWithAdd,
    "evidence-strategy-add-rehearsal",
    "A short revision rehearsal should be added after the preserved choice sequence.",
    ["evidence-strategy-review-gap", "evidence-strategy-sponsor-change"],
  );
  strategyWithAdd.inheritedMaterial.audit.push({
    id: "audit-strategy-add-rehearsal",
    newContribution: "A timed rehearsal in which new evidence forces the learner to revisit a chosen strategy.",
    changedCondition: "The revised brief requires leaders to practise reopening a decision during execution.",
    authorClaimOrSynthesis: "A new rehearsal is necessary because no inherited item makes learners revise a live commitment.",
    disposition: "add",
    dispositionReason: "The new performance cannot be produced by relabelling the preserved diagnosis or choice exercises.",
    programmeFit: "Adds observable revision practice after the coordinated action work.",
    evidenceStatus: "author_synthesis",
    evidenceBoundaryId: "evidence-strategy-add-rehearsal",
    destination: "Session six close",
    learnerMove: "Learners revise the strategy after receiving contradictory execution evidence.",
    artifactProof: "The record preserves the first choice and the reason for its revision.",
  });
  const strategyWithAddPath = writeMutation("valid-add-disposition", strategyWithAdd);
  expectPass("add disposition has a new contribution rather than fake inheritance", strategyWithAddPath);

  const addWithInheritedForm = clone(strategyWithAdd);
  addWithInheritedForm.inheritedMaterial.audit.at(-1).inheritedForm = "A fictional inherited lecture";
  expectFailure("add cannot invent inherited form", writeMutation("add-with-inherited-form", addWithInheritedForm), "contains unsupported keys: inheritedForm");

  const strategyWithOmit = clone(strategy);
  appendSynthesis(
    strategyWithOmit,
    "evidence-strategy-omit-history",
    "A chronological history lecture can be omitted without removing the course's diagnostic function.",
    ["evidence-strategy-review-gap"],
  );
  strategyWithOmit.inheritedMaterial.audit.push({
    id: "audit-strategy-omit-history",
    sourceItemIds: ["source-strategy-outline"],
    sourceConceptOrQuestion: "Chronological schools of strategy",
    originalPurpose: "Orient learners to the development of several strategy traditions.",
    enduringRequirementOrFunction: "Learners still need to recognise that different strategic diagnoses make different assumptions.",
    inheritedForm: "A chronological lecture surveying named schools before the applied cases.",
    changedCondition: "The revised course has six sessions and prioritises application to a live strategic record.",
    authorClaimOrSynthesis: "The historical survey can be omitted while its comparative function moves into the case sequence.",
    disposition: "omit",
    dispositionReason: "The applied cases preserve comparison while the chronological survey consumes time needed for observable revision practice.",
    programmeFit: "Its comparative function is retained elsewhere without retaining the standalone lecture.",
    evidenceStatus: "author_synthesis",
    evidenceBoundaryId: "evidence-strategy-omit-history",
    omissionConsequence: "The course loses chronology but gains time for practice; facilitator notes must preserve source attribution for the surviving distinctions."
  });
  const strategyWithOmitPath = writeMutation("valid-omit-disposition", strategyWithOmit);
  expectPass("omit disposition records consequence without a fake destination", strategyWithOmitPath);

  const omitWithDestination = clone(strategyWithOmit);
  omitWithDestination.inheritedMaterial.audit.at(-1).destination = "Nowhere in programme";
  expectFailure("omit cannot masquerade as resequencing", writeMutation("omit-with-destination", omitWithDestination), "contains unsupported keys: destination");

  const omitWithoutConsequence = clone(strategyWithOmit);
  delete omitWithoutConsequence.inheritedMaterial.audit.at(-1).omissionConsequence;
  expectFailure("omit must state omission consequence", writeMutation("omit-without-consequence", omitWithoutConsequence), "is missing keys: omissionConsequence");

  const combineOneSource = clone(strategy);
  combineOneSource.inheritedMaterial.audit.find((item) => item.disposition === "combine").sourceItemIds = ["source-strategy-outline"];
  expectFailure("combine must reference two source items", writeMutation("combine-one-source", combineOneSource), "combine must reference at least two inherited source items");

  const ceremonialPreserve = clone(strategy);
  ceremonialPreserve.inheritedMaterial.audit[0].dispositionReason = "Keep everything because it was already there.";
  expectFailure("ceremonial preservation", writeMutation("ceremonial-preserve", ceremonialPreserve), "cannot justify ceremonial preservation or reinvention");

  const duplicateAuditReason = clone(strategy);
  duplicateAuditReason.inheritedMaterial.audit[1].dispositionReason = duplicateAuditReason.inheritedMaterial.audit[0].dispositionReason;
  expectFailure("copy-pasted audit rationale", writeMutation("duplicate-audit-reason", duplicateAuditReason), "needs item-specific disposition reasons");

  const unknownInheritedSource = clone(strategy);
  unknownInheritedSource.inheritedMaterial.audit[0].sourceItemIds = ["source-strategy-missing"];
  expectFailure("audit must reference real inherited source", writeMutation("unknown-inherited-source", unknownInheritedSource), "contains an unknown inherited source id");

  // Stable alignment references, not duplicated prose, carry the architecture chain.
  assert.notEqual(
    product.capabilityProgression.at(-1).learnerMove,
    product.thesis.promisedLearnerChange,
    "fixture should prove alignment without duplicated learner-change prose",
  );
  assert.notEqual(
    product.capabilityProgression.at(-1).proofAdded,
    product.carriedProof.successEvidence,
    "fixture should prove alignment without duplicated proof prose",
  );
  console.log("PASS alignment uses stable references rather than duplicated prose");

  const wrongFinalChange = clone(product);
  wrongFinalChange.capabilityProgression.at(-1).learnerChangeId = "change-product-wrong-final";
  expectFailure("final capability must reference promised learner change", writeMutation("wrong-final-change", wrongFinalChange), "final capability learnerChangeId must reference thesis.promisedLearnerChangeId");

  const wrongFinalProof = clone(product);
  wrongFinalProof.capabilityProgression.at(-1).proofId = "proof-product-wrong-final";
  expectFailure("final capability must reference carried proof evidence", writeMutation("wrong-final-proof", wrongFinalProof), "final capability proofId must reference carriedProof.successEvidenceId");

  // Interview behavior should be specific and should preserve settled decisions.
  const genericQuestion = clone(underSpecified);
  genericQuestion.openDecisions[0].decision = "What do you think?";
  genericQuestion.productionDecision.blockedBy = ["What do you think?"];
  expectFailure("generic survey question", writeMutation("generic-survey-question", genericQuestion), "cannot be a generic survey question", "artifact-production");

  const ceremonialReinterview = clone(approvedReuse);
  ceremonialReinterview.trigger.interviewAction = "complete-interview";
  expectFailure("approved record cannot trigger ceremonial re-interview", writeMutation("ceremonial-reinterview", ceremonialReinterview), "must reuse the record without a ceremonial re-interview");

  const staleReuse = clone(approvedReuse);
  staleReuse.trigger.materialChangeDetected = true;
  expectFailure("material change cannot reuse stale approval", writeMutation("stale-record-reuse", staleReuse), "a materially changed request cannot reuse the prior thesis approval");

  const missingRequiredField = clone(product);
  delete missingRequiredField.thesis.centralQuestion;
  expectFailure("required thesis field", writeMutation("missing-central-question", missingRequiredField), "thesis is missing keys: centralQuestion");

  const leakedLegacyDefaults = clone(product);
  leakedLegacyDefaults.legacyCHRODefaults = true;
  expectFailure("unsupported legacy domain defaults", writeMutation("legacy-domain-defaults", leakedLegacyDefaults), "record contains unsupported keys: legacyCHRODefaults");

  console.log("PASS all Programme Thesis behavior and mutation tests");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
