import type { Candidate, Vacancy } from "./types/models";
import {
  filterCandidatesByAvailability,
  filterCandidatesBySeniority,
  filterCandidatesBySkills,
  sortCandidatesByExperience,
  sortCandidatesBySalary,
} from "./utils/collections";
import {
  binarySearchCandidateBySalary,
  findCandidateByEmail,
  findCandidateById,
} from "./utils/search";
import {
  calculateAverageSalary,
  calculateCandidateScore,
  calculateVacancyFillRate,
  countCandidatesByStatus,
  findTopSkills,
  groupCandidatesBySeniority,
  rankCandidatesForVacancy,
} from "./utils/transformations";
import {
  isValidEmail,
  validateCandidate,
  validateVacancy,
} from "./utils/validations";

const sampleCandidates: Candidate[] = [
  {
    id: "C-2024-0451",
    fullName: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+56912345678",
    yearsOfExperience: 5,
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    englishLevel: "B2",
    seniority: "Semi-Senior",
    currentSalary: 3500,
    expectedSalary: 4200,
    availability: "1 month",
    location: "Valencia, España",
    remoteOnly: false,
    status: "Active",
  },
  {
    id: "C-2024-0452",
    fullName: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+56987654321",
    yearsOfExperience: 3,
    skills: ["JavaScript", "React", "CSS", "HTML"],
    englishLevel: "B1",
    seniority: "Junior",
    currentSalary: 2200,
    expectedSalary: 2800,
    availability: "Immediate",
    location: "Miami, Florida, Estados Unidos",
    remoteOnly: true,
    status: "Active",
  },
  {
    id: "C-2024-0453",
    fullName: "Carolina Silva",
    email: "carolina.silva@email.com",
    phone: "+56911223344",
    yearsOfExperience: 8,
    skills: ["TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
    englishLevel: "C1",
    seniority: "Senior",
    currentSalary: 5500,
    expectedSalary: 6500,
    availability: "2 weeks",
    location: "Valencia, España",
    remoteOnly: false,
    status: "Active",
  },
];

const sampleVacancy: Vacancy = {
  id: "V-2024-0892",
  title: "Senior Full-Stack Developer",
  companyName: "TechCorp Solutions",
  requiredSkills: ["TypeScript", "React", "Node.js"],
  preferredSkills: ["PostgreSQL", "Docker"],
  minYearsExperience: 4,
  maxYearsExperience: 8,
  requiredEnglishLevel: "B2",
  requiredSeniority: "Senior",
  salaryRangeMin: 5000,
  salaryRangeMax: 7000,
  isRemote: true,
  location: "Remote",
  status: "Open",
};

function logResult(label: string, result: unknown): void {
  console.log(`\n${label}:`);
  console.dir(result, { depth: null });
}

logResult("isValidEmail", isValidEmail(sampleCandidates[0].email));
logResult(
  "validateCandidate",
  sampleCandidates.map((candidate) => validateCandidate(candidate)),
);
logResult("validateVacancy", validateVacancy(sampleVacancy));

const invalidCandidateValidation = validateCandidate(null);
console.error("\nErrores de validación para un candidato inválido:");
for (const error of invalidCandidateValidation.errors) {
  console.error(`- ${error}`);
}

logResult(
  "filterCandidatesBySkills",
  filterCandidatesBySkills(sampleCandidates, sampleVacancy.requiredSkills),
);
logResult(
  "filterCandidatesBySeniority",
  filterCandidatesBySeniority(sampleCandidates, sampleVacancy.requiredSeniority),
);
logResult(
  "filterCandidatesByAvailability",
  filterCandidatesByAvailability(
    sampleCandidates,
    sampleCandidates.map((candidate) => candidate.availability),
  ),
);

const candidatesBySalary = sortCandidatesBySalary(sampleCandidates, "asc");
logResult("sortCandidatesBySalary", candidatesBySalary);
logResult(
  "sortCandidatesByExperience",
  sortCandidatesByExperience(sampleCandidates, "desc"),
);

logResult(
  "findCandidateById",
  findCandidateById(sampleCandidates, sampleCandidates[0].id),
);
logResult(
  "findCandidateByEmail",
  findCandidateByEmail(sampleCandidates, sampleCandidates[0].email),
);
logResult(
  "binarySearchCandidateBySalary",
  binarySearchCandidateBySalary(
    candidatesBySalary,
    sampleCandidates[0].expectedSalary,
  ),
);

logResult(
  "calculateCandidateScore",
  sampleCandidates.map((candidate) =>
    calculateCandidateScore(candidate, sampleVacancy),
  ),
);
logResult(
  "rankCandidatesForVacancy",
  rankCandidatesForVacancy(sampleCandidates, sampleVacancy),
);
logResult("groupCandidatesBySeniority", groupCandidatesBySeniority(sampleCandidates));
logResult("countCandidatesByStatus", countCandidatesByStatus(sampleCandidates));
logResult("calculateAverageSalary", calculateAverageSalary(sampleCandidates));
logResult("findTopSkills", findTopSkills(sampleCandidates, 3));
logResult(
  "calculateVacancyFillRate (sin procesos de ejemplo)",
  calculateVacancyFillRate([]),
);
