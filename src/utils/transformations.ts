import {
  Candidate,
  CandidateScore,
  CandidateStatus,
  EnglishLevel,
  ProcessStage,
  SelectionProcess,
  SeniorityLevel,
  SkillCount,
  Vacancy,
} from "../types/models";

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

export function calculateCandidateScore(
  candidate: Candidate,
  vacancy: Vacancy,
): number {
  const candidateSkills = new Set(candidate.skills.map(normalizeSkill));
  const requiredSkills = [
    ...new Set(vacancy.requiredSkills.map(normalizeSkill)),
  ];
  const preferredSkills = [
    ...new Set(vacancy.preferredSkills.map(normalizeSkill)),
  ];
  const matchedRequired = requiredSkills.filter((skill) =>
    candidateSkills.has(skill),
  ).length;
  const requiredScore =
    requiredSkills.length > 0 && matchedRequired === requiredSkills.length
      ? 40
      : requiredSkills.length > 0 &&
          matchedRequired / requiredSkills.length >= 0.5
        ? 20
        : 0;
  const preferredScore =
    Math.min(
      2,
      preferredSkills.filter((skill) => candidateSkills.has(skill)).length,
    ) * 10;
  const skillScore = Math.min(40, requiredScore + preferredScore);

  let experienceScore = 0;
  if (
    candidate.yearsOfExperience >= vacancy.minYearsExperience &&
    candidate.yearsOfExperience <= vacancy.maxYearsExperience
  ) {
    experienceScore = 20;
  } else {
    const deviation =
      candidate.yearsOfExperience < vacancy.minYearsExperience
        ? vacancy.minYearsExperience - candidate.yearsOfExperience
        : candidate.yearsOfExperience - vacancy.maxYearsExperience;
    if (deviation <= 2) experienceScore = 10;
  }

  const seniorityLevels: SeniorityLevel[] = [
    "Junior",
    "Semi-Senior",
    "Senior",
    "Lead",
    "Executive",
  ];
  const seniorityDistance = Math.abs(
    seniorityLevels.indexOf(candidate.seniority) -
      seniorityLevels.indexOf(vacancy.requiredSeniority),
  );
  const seniorityScore =
    seniorityDistance === 0 ? 15 : seniorityDistance === 1 ? 7 : 0;

  const englishLevels: EnglishLevel[] = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
    "Native",
  ];
  const englishScore =
    englishLevels.indexOf(candidate.englishLevel) >=
    englishLevels.indexOf(vacancy.requiredEnglishLevel)
      ? 15
      : 0;

  let salaryScore = 0;
  if (
    candidate.expectedSalary >= vacancy.salaryRangeMin &&
    candidate.expectedSalary <= vacancy.salaryRangeMax
  ) {
    salaryScore = 10;
  } else if (
    candidate.expectedSalary > vacancy.salaryRangeMax &&
    candidate.expectedSalary <= vacancy.salaryRangeMax * 1.2
  ) {
    salaryScore = 5;
  }

  return Math.min(
    100,
    skillScore + experienceScore + seniorityScore + englishScore + salaryScore,
  );
}

export function rankCandidatesForVacancy(
  candidates: Candidate[],
  vacancy: Vacancy,
): CandidateScore[] {
  return candidates
    .map((candidate, index) => ({
      candidate,
      score: calculateCandidateScore(candidate, vacancy),
      index,
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ candidate, score }) => ({ candidate, score }));
}

export function groupCandidatesBySeniority(
  candidates: Candidate[],
): Record<SeniorityLevel, Candidate[]> {
  const groups: Record<SeniorityLevel, Candidate[]> = {
    Junior: [],
    "Semi-Senior": [],
    Senior: [],
    Lead: [],
    Executive: [],
  };
  for (const candidate of candidates) groups[candidate.seniority].push(candidate);
  return groups;
}

export function countCandidatesByStatus(
  candidates: Candidate[],
): Record<CandidateStatus, number> {
  const counts: Record<CandidateStatus, number> = {
    Active: 0,
    "In process": 0,
    Hired: 0,
    Inactive: 0,
  };
  for (const candidate of candidates) counts[candidate.status] += 1;
  return counts;
}

export function calculateAverageSalary(candidates: Candidate[]): number {
  if (candidates.length === 0) return 0;
  const total = candidates.reduce(
    (sum, candidate) => sum + candidate.expectedSalary,
    0,
  );
  return Math.round((total / candidates.length) * 100) / 100;
}

export function findTopSkills(
  candidates: Candidate[],
  topN: number,
): SkillCount[] {
  if (!Number.isInteger(topN)) {
    throw new RangeError("topN debe ser un número entero.");
  }
  if (topN <= 0 || candidates.length === 0) return [];

  const counts = new Map<string, { skill: string; count: number }>();
  for (const candidate of candidates) {
    const uniqueSkills = new Set(candidate.skills.map(normalizeSkill));
    for (const normalizedSkill of uniqueSkills) {
      if (!normalizedSkill) continue;
      const current = counts.get(normalizedSkill);
      if (current) current.count += 1;
      else {
        const originalSkill = candidate.skills.find(
          (skill) => normalizeSkill(skill) === normalizedSkill,
        );
        counts.set(normalizedSkill, {
          skill: originalSkill?.trim() ?? normalizedSkill,
          count: 1,
        });
      }
    }
  }

  return [...counts.values()]
    .map((item, index) => ({ ...item, index }))
    .sort((left, right) => right.count - left.count || left.index - right.index)
    .slice(0, topN)
    .map(({ skill, count }) => ({ skill, count }));
}

export function calculateVacancyFillRate(
  processes: SelectionProcess[],
): number {
  if (processes.length === 0) return 0;
  const hiredCount = processes.filter(
    (process) => process.stage === ("Hired" satisfies ProcessStage),
  ).length;
  return Math.round((hiredCount / processes.length) * 10000) / 100;
}
