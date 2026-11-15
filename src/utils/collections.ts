import {
  AvailabilityStatus,
  Candidate,
  SeniorityLevel,
} from "../types/models";

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

export function filterCandidatesBySkills(
  candidates: Candidate[],
  requiredSkills: string[],
): Candidate[] {
  const required = new Set(requiredSkills.map(normalizeSkill));
  return candidates.filter((candidate) => {
    const candidateSkills = new Set(candidate.skills.map(normalizeSkill));
    return [...required].every((skill) => candidateSkills.has(skill));
  });
}

export function filterCandidatesBySeniority(
  candidates: Candidate[],
  seniority: SeniorityLevel,
): Candidate[] {
  return candidates.filter((candidate) => candidate.seniority === seniority);
}

export function filterCandidatesByAvailability(
  candidates: Candidate[],
  availability: AvailabilityStatus[],
): Candidate[] {
  const accepted = new Set(availability);
  return candidates.filter((candidate) => accepted.has(candidate.availability));
}

export function sortCandidatesBySalary(
  candidates: Candidate[],
  order: "asc" | "desc",
): Candidate[] {
  const direction = order === "asc" ? 1 : -1;
  return candidates
    .map((candidate, index) => ({ candidate, index }))
    .sort(
      (left, right) =>
        direction *
          (left.candidate.expectedSalary - right.candidate.expectedSalary) ||
        left.index - right.index,
    )
    .map(({ candidate }) => candidate);
}

export function sortCandidatesByExperience(
  candidates: Candidate[],
  order: "asc" | "desc",
): Candidate[] {
  const direction = order === "asc" ? 1 : -1;
  return candidates
    .map((candidate, index) => ({ candidate, index }))
    .sort(
      (left, right) =>
        direction *
          (left.candidate.yearsOfExperience -
            right.candidate.yearsOfExperience) ||
        left.index - right.index,
    )
    .map(({ candidate }) => candidate);
}
