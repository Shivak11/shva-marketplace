#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
const requestedScope = process.argv[3] ?? "full";

if (!inputPath) {
  console.error("Usage: validate-programme-thesis.mjs <programme-thesis-record.json> [architecture|session-production|artifact-production|full]");
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
const allowedScopes = new Set(["architecture", "session-production", "artifact-production", "full"]);
const triggerKinds = new Set([
  "new-substantial-programme",
  "major-redesign",
  "under-specified-architecture",
  "approved-record-reuse",
]);
const interviewActions = new Set([
  "complete-interview",
  "continue-interview",
  "reuse-approved-record",
]);
const programmeFormats = new Set(["book", "workshop", "course", "programme"]);
const lensApplicability = new Set(["Central", "Supporting", "Not applicable"]);
const changedMechanisms = new Set([
  "representation",
  "prediction",
  "coordination",
  "execution",
  "monitoring",
  "memory",
  "agency",
]);
const dispositions = new Set(["preserve", "reframe", "combine", "resequence", "add", "omit"]);
const evidenceClasses = new Set([
  "established_external",
  "author_experience_or_teaching_observation",
  "author_synthesis",
  "open_hypothesis",
]);
const aiTermPattern = /\b(?:ai|artificial intelligence|generative ai|automation|algorithmic|computational (?:actors?|systems?)|machine actors?|machine learning|large language models?|llms?|foundation models?|neural networks?|chatgpt|claude|gemini|copilot)\b/i;
const foundationStatuses = new Set(["approved", "required", "not-applicable"]);
const stableIdPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/;

const isNonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const words = (value) => String(value ?? "").trim().split(/\s+/).filter(Boolean);
const isSubstantive = (value, minimumWords = 3, minimumCharacters = 16) =>
  isNonEmpty(value) && words(value).length >= minimumWords && value.trim().length >= minimumCharacters;
const isStringArray = (value) => Array.isArray(value) && value.every((item) => isNonEmpty(item));
const nonEmptyStringArray = (value) => isStringArray(value) && value.length > 0;
const normalise = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const duplicateValues = (values) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const isStableId = (value) => typeof value === "string" && stableIdPattern.test(value);

function requireValue(condition, message) {
  if (!condition) errors.push(message);
}

function requireExactKeys(value, keys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    const missing = expected.filter((key) => !actual.includes(key));
    const unsupported = actual.filter((key) => !expected.includes(key));
    if (missing.length > 0) errors.push(`${label} is missing keys: ${missing.join(", ")}`);
    if (unsupported.length > 0) errors.push(`${label} contains unsupported keys: ${unsupported.join(", ")}`);
  }
}

function flattenStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

function scopeIsCovered(scopes, scope) {
  return scopes.includes("full") || scopes.includes(scope);
}

function itemBlocksScope(item, scope) {
  const scopes = Array.isArray(item?.blockingScopes) ? item.blockingScopes : [];
  return scope === "full" ? scopes.length > 0 : scopes.includes(scope);
}

requireValue(allowedScopes.has(requestedScope), "requested scope must be architecture, session-production, artifact-production, or full");
requireExactKeys(record, [
  "recordId",
  "schemaVersion",
  "trigger",
  "programme",
  "thesis",
  "inheritedMaterial",
  "transformationLens",
  "evidenceBoundaries",
  "carriedProof",
  "capabilityProgression",
  "publicContribution",
  "exclusions",
  "openDecisions",
  "approval",
  "productionDecision",
], "record");
requireValue(isStableId(record?.recordId), "record.recordId must be a stable kebab-case identifier");
requireValue(record?.schemaVersion === "1.0", "schemaVersion must be '1.0'");

const trigger = record?.trigger ?? {};
requireExactKeys(trigger, [
  "kind",
  "reason",
  "inspectedEvidence",
  "reusedRecord",
  "materialChangeDetected",
  "interviewAction",
], "trigger");
requireValue(triggerKinds.has(trigger.kind), "trigger.kind must be a supported thesis-gate trigger");
requireValue(isSubstantive(trigger.reason), "trigger.reason must explain why the thesis gate applies");
requireValue(nonEmptyStringArray(trigger.inspectedEvidence), "trigger.inspectedEvidence must name evidence inspected before questioning");
requireValue(typeof trigger.materialChangeDetected === "boolean", "trigger.materialChangeDetected must be boolean");
requireValue(interviewActions.has(trigger.interviewAction), "trigger.interviewAction must be complete-interview, continue-interview, or reuse-approved-record");
requireValue(trigger.reusedRecord === null || isStableId(trigger.reusedRecord), "trigger.reusedRecord must be null or a stable record identifier");

const programme = record?.programme ?? {};
requireExactKeys(programme, ["subject", "scope", "format", "audience", "startingPoint"], "programme");
for (const field of ["subject", "scope", "audience", "startingPoint"]) {
  requireValue(isSubstantive(programme[field]), `programme.${field} must be substantive`);
}
requireValue(programmeFormats.has(programme.format), "programme.format must be book, workshop, course, or programme");

const thesis = record?.thesis ?? {};
requireExactKeys(thesis, [
  "recognisedProblem",
  "recognisedProblemEvidenceId",
  "promisedLearnerChange",
  "promisedLearnerChangeId",
  "centralQuestion",
  "distinctiveArgument",
  "distinctiveArgumentEvidenceId",
  "argumentBoundary",
  "changedCondition",
  "changedConditionEvidenceId",
], "thesis");
for (const field of ["recognisedProblem", "promisedLearnerChange", "centralQuestion", "distinctiveArgument", "argumentBoundary", "changedCondition"]) {
  requireValue(isSubstantive(thesis[field]), `thesis.${field} must be substantive`);
}
for (const field of ["recognisedProblemEvidenceId", "promisedLearnerChangeId", "distinctiveArgumentEvidenceId", "changedConditionEvidenceId"]) {
  requireValue(isStableId(thesis[field]), `thesis.${field} must be a stable kebab-case identifier`);
}

const inherited = record?.inheritedMaterial ?? {};
const inheritedSources = Array.isArray(inherited.sources) ? inherited.sources : [];
const inheritedAudit = Array.isArray(inherited.audit) ? inherited.audit : [];
requireExactKeys(inherited, ["present", "sources", "audit"], "inheritedMaterial");
requireValue(typeof inherited.present === "boolean", "inheritedMaterial.present must be boolean");
requireValue(Array.isArray(inherited.sources), "inheritedMaterial.sources must be an array");
requireValue(Array.isArray(inherited.audit), "inheritedMaterial.audit must be an array");
for (const [index, source] of inheritedSources.entries()) {
  const label = `inheritedMaterial.sources[${index}]`;
  requireExactKeys(source, ["id", "label"], label);
  requireValue(isStableId(source?.id), `${label}.id must be a stable kebab-case identifier`);
  requireValue(isSubstantive(source?.label, 2, 8), `${label}.label must identify the inherited source`);
}
const inheritedSourceIds = inheritedSources.map((source) => source?.id);
requireValue(duplicateValues(inheritedSourceIds).length === 0, "inheritedMaterial source ids must be unique");
if (inherited.present === true) {
  requireValue(inheritedSources.length > 0, "inherited material requires at least one named source");
  requireValue(inheritedAudit.length > 0, "inherited material requires an item-level transformation audit");
} else {
  requireValue(inheritedSources.length === 0, "greenfield work cannot declare inherited sources");
  requireValue(inheritedAudit.length === 0, "greenfield work cannot perform a ceremonial inherited-item audit");
}

const inheritedAuditFields = [
  "id",
  "sourceItemIds",
  "sourceConceptOrQuestion",
  "originalPurpose",
  "enduringRequirementOrFunction",
  "inheritedForm",
  "changedCondition",
  "authorClaimOrSynthesis",
  "disposition",
  "dispositionReason",
  "programmeFit",
  "evidenceStatus",
  "evidenceBoundaryId",
  "destination",
  "learnerMove",
  "artifactProof",
];
const addAuditFields = [
  "id",
  "newContribution",
  "changedCondition",
  "authorClaimOrSynthesis",
  "disposition",
  "dispositionReason",
  "programmeFit",
  "evidenceStatus",
  "evidenceBoundaryId",
  "destination",
  "learnerMove",
  "artifactProof",
];
const omitAuditFields = [
  "id",
  "sourceItemIds",
  "sourceConceptOrQuestion",
  "originalPurpose",
  "enduringRequirementOrFunction",
  "inheritedForm",
  "changedCondition",
  "authorClaimOrSynthesis",
  "disposition",
  "dispositionReason",
  "programmeFit",
  "evidenceStatus",
  "evidenceBoundaryId",
  "omissionConsequence",
];
const ceremonialDispositionPattern = /\b(?:because it (?:was|is) already there|because it is old|fresh start|keep everything|replace everything|start from scratch)\b/i;
for (const [index, item] of inheritedAudit.entries()) {
  const label = `inheritedMaterial.audit[${index}]`;
  requireValue(dispositions.has(item?.disposition), `${label}.disposition must be preserve, reframe, combine, resequence, add, or omit`);
  const expectedFields = item?.disposition === "add"
    ? addAuditFields
    : item?.disposition === "omit"
      ? omitAuditFields
      : inheritedAuditFields;
  requireExactKeys(item, expectedFields, label);
  requireValue(isStableId(item?.id), `${label}.id must be a stable kebab-case identifier`);
  requireValue(isStableId(item?.evidenceBoundaryId), `${label}.evidenceBoundaryId must reference a stable evidence boundary`);
  for (const field of [
    "changedCondition",
    "authorClaimOrSynthesis",
    "dispositionReason",
    "programmeFit",
  ]) {
    requireValue(isSubstantive(item?.[field], 2, 10), `${label}.${field} must be substantive`);
  }
  requireValue(evidenceClasses.has(item?.evidenceStatus), `${label}.evidenceStatus must use a declared evidence class`);
  requireValue(!ceremonialDispositionPattern.test(item?.dispositionReason ?? ""), `${label}.dispositionReason cannot justify ceremonial preservation or reinvention`);

  if (item?.disposition === "add") {
    requireValue(isSubstantive(item?.newContribution, 2, 10), `${label}.newContribution must identify what the audit adds`);
    for (const field of ["destination", "learnerMove", "artifactProof"]) {
      requireValue(isSubstantive(item?.[field], 2, 8), `${label}.${field} must be substantive`);
    }
  } else {
    const sourceItemIds = Array.isArray(item?.sourceItemIds) ? item.sourceItemIds : [];
    requireValue(sourceItemIds.length > 0, `${label}.sourceItemIds must reference inherited source items`);
    requireValue(sourceItemIds.every((id) => inheritedSourceIds.includes(id)), `${label}.sourceItemIds contains an unknown inherited source id`);
    requireValue(duplicateValues(sourceItemIds).length === 0, `${label}.sourceItemIds must be unique`);
    for (const field of ["sourceConceptOrQuestion", "originalPurpose", "enduringRequirementOrFunction", "inheritedForm"]) {
      requireValue(isSubstantive(item?.[field], 2, 10), `${label}.${field} must be substantive`);
    }
    if (item?.disposition === "combine") {
      requireValue(sourceItemIds.length >= 2, `${label}.combine must reference at least two inherited source items`);
    } else {
      requireValue(sourceItemIds.length === 1, `${label}.${item?.disposition} must reference exactly one inherited source item`);
    }
    if (item?.disposition === "omit") {
      requireValue(isSubstantive(item?.omissionConsequence, 2, 10), `${label}.omissionConsequence must state what becomes possible or remains at risk`);
    } else {
      for (const field of ["destination", "learnerMove", "artifactProof"]) {
        requireValue(isSubstantive(item?.[field], 2, 8), `${label}.${field} must be substantive`);
      }
    }
  }
}
const auditIds = inheritedAudit.map((item) => item?.id);
requireValue(duplicateValues(auditIds).length === 0, "transformation audit ids must be unique");
const auditReasons = inheritedAudit.map((item) => normalise(item?.dispositionReason));
if (auditReasons.length > 1) {
  requireValue(duplicateValues(auditReasons).length === 0, "transformation audit needs item-specific disposition reasons");
}

const lens = record?.transformationLens ?? {};
const lensMechanisms = Array.isArray(lens.changedMechanisms) ? lens.changedMechanisms : [];
requireExactKeys(lens, ["applicability", "reason", "governingQuestion", "changedMechanisms"], "transformationLens");
requireValue(lensApplicability.has(lens.applicability), "transformationLens.applicability must be Central, Supporting, or Not applicable");
requireValue(isSubstantive(lens.reason), "transformationLens.reason must be substantive");
requireValue(isStringArray(lens.changedMechanisms), "transformationLens.changedMechanisms must be an array of supported mechanism names");
requireValue(lensMechanisms.every((mechanism) => changedMechanisms.has(mechanism)), "transformationLens.changedMechanisms contains an unsupported mechanism");
requireValue(duplicateValues(lensMechanisms).length === 0, "transformationLens.changedMechanisms must be unique");
if (lens.applicability === "Not applicable") {
  requireValue(!isNonEmpty(lens.governingQuestion), "Not applicable transformation lens must not invent a governing question");
  requireValue(lensMechanisms.length === 0, "Not applicable transformation lens must not force an AI-age mechanism");
} else {
  requireValue(isSubstantive(lens.governingQuestion), "Central or Supporting transformation lens requires a governing question");
}
const aiRelevantCondition = aiTermPattern.test(
  flattenStrings({ programme, thesis, transformationLens: lens }).join("\n"),
);
if (lens.applicability !== "Not applicable" && aiRelevantCondition) {
  requireValue(lensMechanisms.length > 0, "AI-relevant transformation must name the changed mechanism rather than add generic AI vocabulary");
}

requireValue(Array.isArray(record?.evidenceBoundaries) && record.evidenceBoundaries.length > 0, "evidenceBoundaries must contain at least one claim boundary");
const evidenceBoundaries = Array.isArray(record?.evidenceBoundaries) ? record.evidenceBoundaries : [];
const commonEvidenceFields = ["id", "claim", "evidenceClass", "known", "uncertain", "allowedUse"];
const evidenceFieldsByClass = {
  established_external: [...commonEvidenceFields, "sourceUrl", "sourceTitle", "locator"],
  author_experience_or_teaching_observation: [...commonEvidenceFields, "attribution", "observedScope"],
  author_synthesis: [...commonEvidenceFields, "inputClaimIds"],
  open_hypothesis: [...commonEvidenceFields, "falsificationCondition", "dependentScopes"],
};
const inevitablePattern = /\b(?:inevitable|inevitably|guaranteed to|will certainly|will replace (?:all|every))\b/i;
for (const [index, item] of evidenceBoundaries.entries()) {
  const label = `evidenceBoundaries[${index}]`;
  const expectedFields = evidenceFieldsByClass[item?.evidenceClass] ?? commonEvidenceFields;
  requireExactKeys(item, expectedFields, label);
  requireValue(isStableId(item?.id), `${label}.id must be a stable kebab-case identifier`);
  for (const field of ["claim", "known", "uncertain", "allowedUse"]) {
    requireValue(isSubstantive(item?.[field], 2, 10), `${label}.${field} must be substantive`);
  }
  requireValue(evidenceClasses.has(item?.evidenceClass), `${label}.evidenceClass must use a declared evidence class`);
  requireValue(!inevitablePattern.test(item?.claim ?? ""), `${label}.claim cannot present a speculative future as inevitable`);
  if (item?.evidenceClass === "established_external") {
    requireValue(/^https?:\/\/[^\s]+$/i.test(item?.sourceUrl ?? ""), `${label}.sourceUrl must be an HTTP(S) source URL`);
    requireValue(!/^https?:\/\/(?:www\.)?example\.(?:com|org|net)(?:\/|$)/i.test(item?.sourceUrl ?? ""), `${label}.sourceUrl cannot be a placeholder URL`);
    requireValue(isSubstantive(item?.sourceTitle, 2, 8), `${label}.sourceTitle must identify the external source`);
    requireValue(isSubstantive(item?.locator, 2, 6), `${label}.locator must identify where the source supports the claim`);
  }
  if (item?.evidenceClass === "author_experience_or_teaching_observation") {
    requireValue(isSubstantive(item?.attribution, 2, 8), `${label}.attribution must name whose experience or observation this is`);
    requireValue(isSubstantive(item?.observedScope, 3, 12), `${label}.observedScope must bound where the observation was made`);
    requireValue(!/\b(?:proves?|universal(?:ly)?|true for every)\b/i.test(item?.allowedUse ?? ""), `${label} cannot turn author experience into a general fact`);
  }
  if (item?.evidenceClass === "author_synthesis") {
    const inputClaimIds = Array.isArray(item?.inputClaimIds) ? item.inputClaimIds : [];
    requireValue(nonEmptyStringArray(item?.inputClaimIds), `${label}.inputClaimIds must reference the claims combined by the author`);
    requireValue(inputClaimIds.every(isStableId), `${label}.inputClaimIds must contain stable evidence-boundary ids`);
    requireValue(!inputClaimIds.includes(item?.id), `${label}.inputClaimIds cannot reference the synthesis itself`);
    requireValue(duplicateValues(inputClaimIds).length === 0, `${label}.inputClaimIds must be unique`);
  }
  if (item?.evidenceClass === "open_hypothesis") {
    const dependentScopes = Array.isArray(item?.dependentScopes) ? item.dependentScopes : [];
    requireValue(isSubstantive(item?.falsificationCondition, 3, 12), `${label}.falsificationCondition must state what evidence would disconfirm the hypothesis`);
    requireValue(Array.isArray(item?.dependentScopes), `${label}.dependentScopes must be an array`);
    requireValue(dependentScopes.every((scope) => allowedScopes.has(scope)), `${label}.dependentScopes contains an unsupported scope`);
    requireValue(
      !/\b(?:use|treat|present)(?: this| it)? as (?:an? )?(?:established|settled|proven fact)\b/i.test(item?.allowedUse ?? ""),
      `${label} cannot present an open hypothesis as established evidence`,
    );
  }
}
const evidenceIds = evidenceBoundaries.map((item) => item?.id);
requireValue(duplicateValues(evidenceIds).length === 0, "evidenceBoundary ids must be unique");
const evidenceById = new Map(evidenceBoundaries.map((item) => [item?.id, item]));
for (const [index, item] of evidenceBoundaries.entries()) {
  if (item?.evidenceClass !== "author_synthesis") continue;
  const inputClaimIds = Array.isArray(item?.inputClaimIds) ? item.inputClaimIds : [];
  requireValue(
    inputClaimIds.every((id) => evidenceById.has(id)),
    `evidenceBoundaries[${index}].inputClaimIds contains an unknown evidence-boundary id`,
  );
}
const evidenceClaims = evidenceBoundaries.map((item) => normalise(item?.claim));
requireValue(duplicateValues(evidenceClaims).length === 0, "evidenceBoundaries claims must be distinct");

const carriedProof = record?.carriedProof ?? {};
requireExactKeys(carriedProof, [
  "carriedProofId",
  "supportsLearnerChangeId",
  "successEvidenceId",
  "type",
  "name",
  "initialState",
  "finalState",
  "successEvidence",
], "carriedProof");
for (const field of ["carriedProofId", "supportsLearnerChangeId", "successEvidenceId"]) {
  requireValue(isStableId(carriedProof[field]), `carriedProof.${field} must be a stable kebab-case identifier`);
}
for (const field of ["type", "name", "initialState", "finalState", "successEvidence"]) {
  requireValue(isSubstantive(carriedProof[field], 2, 8), `carriedProof.${field} must be substantive`);
}
requireValue(carriedProof.supportsLearnerChangeId === thesis.promisedLearnerChangeId, "carriedProof.supportsLearnerChangeId must reference thesis.promisedLearnerChangeId");

requireValue(Array.isArray(record?.capabilityProgression) && record.capabilityProgression.length >= 2, "capabilityProgression must contain at least two learner moves");
const capabilityProgression = Array.isArray(record?.capabilityProgression) ? record.capabilityProgression : [];
const capabilityFields = ["stageId", "stage", "learnerChangeId", "learnerMove", "proofId", "proofAdded", "handoff"];
for (const [index, item] of capabilityProgression.entries()) {
  const label = `capabilityProgression[${index}]`;
  requireExactKeys(item, capabilityFields, label);
  for (const field of ["stage", "learnerMove", "proofAdded", "handoff"]) {
    requireValue(isSubstantive(item?.[field], 2, 8), `${label}.${field} must be substantive`);
  }
  for (const field of ["stageId", "learnerChangeId", "proofId"]) {
    requireValue(isStableId(item?.[field]), `${label}.${field} must be a stable kebab-case identifier`);
  }
}
const capabilityStageIds = capabilityProgression.map((item) => item?.stageId);
requireValue(duplicateValues(capabilityStageIds).length === 0, "capabilityProgression stageIds must be unique");
const capabilityLearnerChangeIds = capabilityProgression.map((item) => item?.learnerChangeId);
requireValue(duplicateValues(capabilityLearnerChangeIds).length === 0, "capabilityProgression learnerChangeIds must be unique");
const capabilityProofIds = capabilityProgression.map((item) => item?.proofId);
requireValue(duplicateValues(capabilityProofIds).length === 0, "capabilityProgression proofIds must be unique");
const capabilityStages = capabilityProgression.map((item) => normalise(item?.stage));
requireValue(duplicateValues(capabilityStages).length === 0, "capabilityProgression stages must be unique");
const finalCapability = capabilityProgression.at(-1) ?? {};
requireValue(finalCapability.learnerChangeId === thesis.promisedLearnerChangeId, "final capability learnerChangeId must reference thesis.promisedLearnerChangeId");
requireValue(finalCapability.proofId === carriedProof.successEvidenceId, "final capability proofId must reference carriedProof.successEvidenceId");

const publicContribution = record?.publicContribution ?? {};
requireExactKeys(publicContribution, ["intended", "claim", "audience", "evidenceBoundaryId"], "publicContribution");
requireValue(typeof publicContribution.intended === "boolean", "publicContribution.intended must be boolean");
if (publicContribution.intended === true) {
  requireValue(isSubstantive(publicContribution.claim), "publicContribution.claim is required when a public contribution is intended");
  requireValue(isSubstantive(publicContribution.audience), "publicContribution.audience is required when a public contribution is intended");
  requireValue(isStableId(publicContribution.evidenceBoundaryId), "publicContribution.evidenceBoundaryId must reference a stable evidence boundary");
} else {
  requireValue(!isNonEmpty(publicContribution.claim), "publicContribution.claim must be empty when no public contribution is intended");
  requireValue(!isNonEmpty(publicContribution.audience), "publicContribution.audience must be empty when no public contribution is intended");
  requireValue(publicContribution.evidenceBoundaryId === null, "publicContribution.evidenceBoundaryId must be null when no public contribution is intended");
}

const loadBearingEvidenceRefs = [
  ["thesis.recognisedProblem", thesis.recognisedProblemEvidenceId],
  ["thesis.distinctiveArgument", thesis.distinctiveArgumentEvidenceId],
  ["thesis.changedCondition", thesis.changedConditionEvidenceId],
  ...inheritedAudit.map((item, index) => [`inheritedMaterial.audit[${index}].authorClaimOrSynthesis`, item?.evidenceBoundaryId]),
  ...(publicContribution.intended ? [["publicContribution.claim", publicContribution.evidenceBoundaryId]] : []),
];
for (const [label, evidenceId] of loadBearingEvidenceRefs) {
  requireValue(evidenceById.has(evidenceId), `${label} references unknown evidence boundary '${evidenceId}'`);
}
const loadBearingEvidenceIds = loadBearingEvidenceRefs.map(([, evidenceId]) => evidenceId);
requireValue(duplicateValues(loadBearingEvidenceIds).length === 0, "each load-bearing thesis, audit, and public-contribution claim needs a unique evidenceBoundaryId");
for (const [index, item] of inheritedAudit.entries()) {
  const boundary = evidenceById.get(item?.evidenceBoundaryId);
  if (boundary) {
    requireValue(
      item?.evidenceStatus === boundary.evidenceClass,
      `inheritedMaterial.audit[${index}].evidenceStatus must match its referenced evidence boundary class`,
    );
  }
}

const exclusions = record?.exclusions ?? {};
requireExactKeys(exclusions, ["outOfScope", "antiGoals"], "exclusions");
requireValue(nonEmptyStringArray(exclusions.outOfScope), "exclusions.outOfScope must contain at least one explicit boundary");
requireValue(nonEmptyStringArray(exclusions.antiGoals), "exclusions.antiGoals must contain at least one anti-goal");

requireValue(Array.isArray(record?.openDecisions), "openDecisions must be an array");
const openDecisions = Array.isArray(record?.openDecisions) ? record.openDecisions : [];
const openDecisionFields = ["decision", "options", "productionConsequence", "blockingScopes"];
const genericSurveyPattern = /^(?:what do you think|tell me more|any preferences|anything else|share your thoughts)[?.!]*$/i;
for (const [index, item] of openDecisions.entries()) {
  const label = `openDecisions[${index}]`;
  requireExactKeys(item, openDecisionFields, label);
  requireValue(isSubstantive(item?.decision), `${label}.decision must be a material, choice-led question`);
  requireValue(!genericSurveyPattern.test(String(item?.decision ?? "").trim()), `${label}.decision cannot be a generic survey question`);
  requireValue(Array.isArray(item?.options) && item.options.length >= 2 && item.options.length <= 3, `${label}.options must contain two or three meaningful choices`);
  const options = Array.isArray(item?.options) ? item.options : [];
  requireValue(isStringArray(item?.options) && options.every((option) => isSubstantive(option, 2, 6)), `${label}.options must be substantive`);
  requireValue(isSubstantive(item?.productionConsequence), `${label}.productionConsequence must explain what the answer changes`);
  requireValue(Array.isArray(item?.blockingScopes), `${label}.blockingScopes must be an array`);
  const blockingScopes = Array.isArray(item?.blockingScopes) ? item.blockingScopes : [];
  requireValue(blockingScopes.every((scope) => allowedScopes.has(scope)), `${label}.blockingScopes contains an unsupported scope`);
}
const openDecisionNames = openDecisions.map((item) => item?.decision);
requireValue(duplicateValues(openDecisionNames.map(normalise)).length === 0, "openDecisions must be distinct");

const approval = record?.approval ?? {};
requireExactKeys(approval, ["status", "scope", "approvedBy", "approvedAt", "provenance"], "approval");
requireValue(["draft", "approved"].includes(approval.status), "approval.status must be draft or approved");
requireValue(Array.isArray(approval.scope), "approval.scope must be an array");
const approvalScopes = Array.isArray(approval.scope) ? approval.scope : [];
requireValue(approvalScopes.every((scope) => allowedScopes.has(scope)), "approval.scope contains an unsupported scope");
requireValue(duplicateValues(approvalScopes).length === 0, "approval.scope must be unique");
if (approval.status === "approved") {
  requireValue(approvalScopes.length > 0, "approved thesis record requires at least one approval scope");
  requireValue(isNonEmpty(approval.approvedBy), "approval.approvedBy is required for an approved thesis record");
  requireValue(/^\d{4}-\d{2}-\d{2}$/.test(approval.approvedAt ?? ""), "approval.approvedAt must be YYYY-MM-DD");
  requireValue(isSubstantive(approval.provenance), "approval.provenance must state how approval was recorded");
} else {
  requireValue(approvalScopes.length === 0, "draft thesis record cannot carry approval scopes");
  requireValue(!isNonEmpty(approval.approvedBy), "draft thesis record cannot name an approver");
  requireValue(!isNonEmpty(approval.approvedAt), "draft thesis record cannot carry an approval date");
  requireValue(isSubstantive(approval.provenance), "draft approval.provenance must state what remains unresolved");
}

const decision = record?.productionDecision ?? {};
const decisionBlockedBy = Array.isArray(decision.blockedBy) ? decision.blockedBy : [];
requireExactKeys(decision, ["state", "nextAction", "blockedBy", "bookFoundation"], "productionDecision");
requireValue(["stop", "proceed"].includes(decision.state), "productionDecision.state must be stop or proceed");
requireValue(isSubstantive(decision.nextAction), "productionDecision.nextAction must be substantive");
requireValue(isStringArray(decision.blockedBy), "productionDecision.blockedBy must be an array of decision labels");
const foundation = decision?.bookFoundation ?? {};
requireExactKeys(foundation, ["required", "status", "record"], "productionDecision.bookFoundation");
requireValue(typeof foundation.required === "boolean", "productionDecision.bookFoundation.required must be boolean");
requireValue(foundationStatuses.has(foundation.status), "productionDecision.bookFoundation.status must be approved, required, or not-applicable");
requireValue(typeof foundation.record === "string", "productionDecision.bookFoundation.record must be a string");
if (foundation.status === "approved") {
  requireValue(isStableId(foundation.record), "approved Book Foundation gate must reference a stable record id");
}

const blockingDecision = openDecisions.find((item) => itemBlocksScope(item, requestedScope));
const approvalCoversRequest = scopeIsCovered(approvalScopes, requestedScope);
if (decision.state === "proceed") {
  requireValue(approval.status === "approved", "production cannot proceed before the Programme Thesis Record is approved");
  requireValue(approvalCoversRequest, `approval.scope does not approve requested '${requestedScope}' work`);
  requireValue(!blockingDecision, `openDecisions contains an item that blocks requested '${requestedScope}' work`);
  requireValue(decisionBlockedBy.length === 0, "proceed decision cannot name blockers");
} else {
  requireValue(decisionBlockedBy.length > 0, "stop decision must name the unresolved decision that blocks production");
  for (const blocker of decisionBlockedBy) {
    requireValue(openDecisionNames.includes(blocker), `productionDecision.blockedBy references unknown decision '${blocker}'`);
  }
}

const evidenceDependencyIds = new Set();
const evidenceStack = [...loadBearingEvidenceIds];
while (evidenceStack.length > 0) {
  const evidenceId = evidenceStack.pop();
  if (evidenceDependencyIds.has(evidenceId)) continue;
  evidenceDependencyIds.add(evidenceId);
  const boundary = evidenceById.get(evidenceId);
  if (boundary?.evidenceClass === "author_synthesis") {
    evidenceStack.push(...(Array.isArray(boundary.inputClaimIds) ? boundary.inputClaimIds : []));
  }
}
for (const evidenceId of evidenceDependencyIds) {
  const boundary = evidenceById.get(evidenceId);
  if (boundary?.evidenceClass !== "open_hypothesis") continue;
  const dependentScopes = Array.isArray(boundary.dependentScopes) ? boundary.dependentScopes : [];
  const blocksRequestedScope = requestedScope === "full"
    ? dependentScopes.length > 0
    : dependentScopes.includes(requestedScope);
  if (blocksRequestedScope) {
    requireValue(
      decision.state === "stop",
      `open hypothesis '${evidenceId}' cannot be treated as settled for dependent '${requestedScope}' production`,
    );
  }
}

if (programme.format === "book") {
  requireValue(foundation.required === true, "book-shaped work requires a separate Book Foundation gate");
  requireValue(foundation.status !== "not-applicable", "book-shaped work cannot mark the Book Foundation gate not-applicable");
  if (decision.state === "proceed") {
    requireValue(foundation.status === "approved", "book production cannot proceed until the separate Book Foundation Record is approved");
    requireValue(isNonEmpty(foundation.record), "approved Book Foundation gate must reference its separate record");
  }
  if (foundation.status === "required") {
    requireValue(decision.state === "stop", "production must stop while the Book Foundation gate is still required");
  }
} else {
  requireValue(foundation.required === false, "non-book work must not force the Book Foundation interview");
  requireValue(foundation.status === "not-applicable", "non-book work must mark the Book Foundation gate not-applicable");
  requireValue(!isNonEmpty(foundation.record), "non-book work must not invent a Book Foundation record");
}

if (trigger.kind === "under-specified-architecture") {
  requireValue(trigger.interviewAction === "continue-interview", "under-specified work must continue the interview before production");
  requireValue(approval.status === "draft", "under-specified work must remain draft");
  requireValue(decision.state === "stop", "under-specified work must stop in chat before artifact production");
  requireValue(/\bchat\b/i.test(decision.nextAction ?? ""), "under-specified work must continue in chat before artifact production");
  requireValue(Boolean(blockingDecision), `under-specified work needs an open decision blocking requested '${requestedScope}' work`);
}

if (trigger.kind === "approved-record-reuse") {
  requireValue(isNonEmpty(trigger.reusedRecord), "approved record reuse requires a reusedRecord reference");
  requireValue(trigger.reusedRecord === record.recordId, "approved record reuse must reference the Programme Thesis Record being validated");
  requireValue(trigger.materialChangeDetected === false, "a materially changed request cannot reuse the prior thesis approval");
  requireValue(trigger.interviewAction === "reuse-approved-record", "approved unchanged work must reuse the record without a ceremonial re-interview");
  requireValue(approval.status === "approved", "record reuse requires a current approved thesis record");
} else {
  requireValue(trigger.reusedRecord === null, "reusedRecord must be null unless trigger.kind is approved-record-reuse");
  requireValue(trigger.interviewAction !== "reuse-approved-record", "reuse-approved-record action requires the approved-record-reuse trigger");
}

if (trigger.interviewAction === "reuse-approved-record") {
  requireValue(trigger.materialChangeDetected === false, "a material change requires a fresh or resumed Programme Thesis Interview");
}
if (trigger.reusedRecord && trigger.materialChangeDetected === false && approval.status === "approved") {
  requireValue(trigger.interviewAction === "reuse-approved-record", "current approved decisions must not be re-questioned ceremonially");
}
if (approval.status === "approved" && decision.state === "proceed" && trigger.kind !== "approved-record-reuse") {
  requireValue(trigger.interviewAction === "complete-interview", "new or redesigned approved work must complete the Programme Thesis Interview");
}

const forwardFacingValues = flattenStrings({
  programme,
  thesis,
  carriedProof,
  capabilityProgression: record?.capabilityProgression,
  publicContribution,
});
const forwardFacingText = forwardFacingValues.join("\n");
const genericAiPattern = /\b(?:leverage ai|ai[- ]powered insights?|use ai for insights?|ai will transform everything|ai changes everything|unlock(?:ing)? ai(?:'s)? potential)\b/i;
requireValue(!genericAiPattern.test(forwardFacingText), "programme architecture cannot substitute generic AI language for a changed mechanism");
requireValue(!inevitablePattern.test(forwardFacingText), "programme architecture cannot present a speculative future as inevitable");
const cloPloPattern = /\b(?:CLO|PLO)(?:s|\s*\d+)?\b|\blearning outcome\s+\d+\b/i;
requireValue(!cloPloPattern.test(forwardFacingText), "programme architecture must state learner capability in plain language rather than CLO/PLO shorthand");
if (lens.applicability === "Not applicable") {
  requireValue(!aiTermPattern.test(forwardFacingText), "Not applicable transformation lens cannot force AI into the forward programme architecture");
}

const excludedPhrases = Array.isArray(exclusions.outOfScope) ? exclusions.outOfScope : [];
for (const excluded of excludedPhrases) {
  const phrase = normalise(excluded);
  if (phrase.split(" ").length >= 2) {
    requireValue(!normalise(forwardFacingText).includes(phrase), `forward programme architecture contains excluded or foreign framing '${excluded}'`);
  }
}

if (errors.length > 0) {
  console.error(`FAIL ${path.basename(inputPath)} (${errors.length} errors)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS ${path.basename(inputPath)}`);
console.log(`- ${programme.format} thesis is ${approval.status} for requested '${requestedScope}' scope`);
console.log(`- transformation lens: ${lens.applicability}; inherited items audited: ${inherited.audit.length}`);
console.log(`- production decision: ${decision.state}; interview action: ${trigger.interviewAction}`);
