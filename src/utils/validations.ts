import {
  AvailabilityStatus,
  Candidate,
  CandidateStatus,
  EnglishLevel,
  SeniorityLevel,
  ValidationResult,
  Vacancy,
  VacancyStatus,
} from "../types/models";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOneOf<T extends string>(
  value: unknown,
  options: readonly T[],
): value is T {
  return typeof value === "string" && options.some((option) => option === value);
}

function validateStringField(
  record: Record<string, unknown>,
  field: string,
  label: string,
  errors: string[],
): void {
  if (!isNonEmptyString(record[field])) {
    errors.push(`${label} es obligatorio y no puede estar vacío.`);
  }
}

function validateNumberField(
  record: Record<string, unknown>,
  field: string,
  label: string,
  errors: string[],
): number | undefined {
  if (!(field in record)) {
    errors.push(`${label} es obligatorio.`);
    return undefined;
  }
  const value = record[field];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.push(`${label} debe ser un número válido.`);
    return undefined;
  }
  return value;
}

function validateStringArray(
  record: Record<string, unknown>,
  field: string,
  label: string,
  errors: string[],
  mustContainOne: boolean,
): void {
  if (!(field in record)) {
    errors.push(`${label} es obligatorio.`);
    return;
  }
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isNonEmptyString)) {
    errors.push(`${label} debe ser un array de textos no vacíos.`);
    return;
  }
  if (mustContainOne && value.length === 0) {
    errors.push(`${label} debe contener al menos una habilidad.`);
  }
}

function validationResult(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function isValidEmail(email: string): boolean {
  if (/\s/.test(email)) return false;
  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.indexOf(".");
  return dotIndex > 0 && dotIndex < domain.length - 1;
}

export function validateCandidate(
  candidate: Candidate | null | undefined,
): ValidationResult {
  if (!isRecord(candidate)) {
    return validationResult(["El candidato es obligatorio y debe ser un objeto."]);
  }

  const errors: string[] = [];
  validateStringField(candidate, "id", "id", errors);
  validateStringField(candidate, "fullName", "fullName", errors);
  validateStringField(candidate, "email", "email", errors);
  validateStringField(candidate, "phone", "phone", errors);
  validateStringField(candidate, "location", "location", errors);
  validateStringArray(candidate, "skills", "skills", errors, true);

  const email = candidate.email;
  if (isNonEmptyString(email) && !isValidEmail(email)) {
    errors.push("email no tiene un formato válido.");
  }

  const experience = validateNumberField(
    candidate,
    "yearsOfExperience",
    "yearsOfExperience",
    errors,
  );
  if (experience !== undefined && (experience < 0 || experience > 50)) {
    errors.push("yearsOfExperience debe estar entre 0 y 50.");
  }

  for (const field of ["currentSalary", "expectedSalary"]) {
    const salary = validateNumberField(candidate, field, field, errors);
    if (salary !== undefined && salary <= 0) {
      errors.push(`${field} debe ser mayor que 0.`);
    }
  }

  if (
    !isOneOf(candidate.englishLevel, [
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2",
      "Native",
    ] satisfies EnglishLevel[])
  ) {
    errors.push("englishLevel no es válido.");
  }
  if (
    !isOneOf(candidate.seniority, [
      "Junior",
      "Semi-Senior",
      "Senior",
      "Lead",
      "Executive",
    ] satisfies SeniorityLevel[])
  ) {
    errors.push("seniority no es válido.");
  }
  if (
    !isOneOf(candidate.availability, [
      "Immediate",
      "2 weeks",
      "1 month",
      "Not available",
    ] satisfies AvailabilityStatus[])
  ) {
    errors.push("availability no es válido.");
  }
  if (
    !isOneOf(candidate.status, [
      "Active",
      "In process",
      "Hired",
      "Inactive",
    ] satisfies CandidateStatus[])
  ) {
    errors.push("status no es válido.");
  }
  if (typeof candidate.remoteOnly !== "boolean") {
    errors.push("remoteOnly debe ser un valor booleano.");
  }

  return validationResult(errors);
}

export function validateVacancy(
  vacancy: Vacancy | null | undefined,
): ValidationResult {
  if (!isRecord(vacancy)) {
    return validationResult(["La vacante es obligatoria y debe ser un objeto."]);
  }

  const errors: string[] = [];
  for (const field of ["id", "title", "companyName", "location"]) {
    validateStringField(vacancy, field, field, errors);
  }
  validateStringArray(
    vacancy,
    "requiredSkills",
    "requiredSkills",
    errors,
    true,
  );
  validateStringArray(
    vacancy,
    "preferredSkills",
    "preferredSkills",
    errors,
    false,
  );

  const minimumExperience = validateNumberField(
    vacancy,
    "minYearsExperience",
    "minYearsExperience",
    errors,
  );
  const maximumExperience = validateNumberField(
    vacancy,
    "maxYearsExperience",
    "maxYearsExperience",
    errors,
  );
  if (minimumExperience !== undefined && minimumExperience < 0) {
    errors.push("minYearsExperience debe ser mayor o igual que 0.");
  }
  if (
    minimumExperience !== undefined &&
    maximumExperience !== undefined &&
    maximumExperience < minimumExperience
  ) {
    errors.push("maxYearsExperience debe ser mayor o igual que minYearsExperience.");
  }

  const minimumSalary = validateNumberField(
    vacancy,
    "salaryRangeMin",
    "salaryRangeMin",
    errors,
  );
  const maximumSalary = validateNumberField(
    vacancy,
    "salaryRangeMax",
    "salaryRangeMax",
    errors,
  );
  if (minimumSalary !== undefined && minimumSalary <= 0) {
    errors.push("salaryRangeMin debe ser mayor que 0.");
  }
  if (maximumSalary !== undefined && maximumSalary <= 0) {
    errors.push("salaryRangeMax debe ser mayor que 0.");
  }
  if (
    minimumSalary !== undefined &&
    maximumSalary !== undefined &&
    maximumSalary < minimumSalary
  ) {
    errors.push("salaryRangeMax debe ser mayor o igual que salaryRangeMin.");
  }

  if (
    !isOneOf(vacancy.requiredEnglishLevel, [
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2",
      "Native",
    ] satisfies EnglishLevel[])
  ) {
    errors.push("requiredEnglishLevel no es válido.");
  }
  if (
    !isOneOf(vacancy.requiredSeniority, [
      "Junior",
      "Semi-Senior",
      "Senior",
      "Lead",
      "Executive",
    ] satisfies SeniorityLevel[])
  ) {
    errors.push("requiredSeniority no es válido.");
  }
  if (
    !isOneOf(vacancy.status, [
      "Open",
      "In progress",
      "Closed",
      "On hold",
    ] satisfies VacancyStatus[])
  ) {
    errors.push("status no es válido.");
  }
  if (typeof vacancy.isRemote !== "boolean") {
    errors.push("isRemote debe ser un valor booleano.");
  }

  return validationResult(errors);
}
