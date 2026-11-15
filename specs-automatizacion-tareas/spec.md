# Especificación de utilidades TypeScript

## Objetivo

Definir tipos y utilidades puras para filtrar, buscar, puntuar, resumir y validar candidatos, vacantes y procesos de selección de Nexova. La fuente funcional es [`requirements.md`](./requirements.md), incluidas sus aclaraciones aprobadas.

## Estructura de implementación solicitada

```text
src/
├── types/
│   └── models.ts
└── utils/
    ├── collections.ts
    ├── search.ts
    ├── transformations.ts
    └── validations.ts
```

La estructura real inspeccionada es un monorepo: no existe `src/`, `package.json` ni `tsconfig.json` en la raíz. Existe `packages/shared/types/index.ts` con tipos genéricos. Se mantiene la ubicación `src/` solicitada sin sustituirla por `packages/shared/`; esta diferencia queda documentada conforme a A-07.

## Tipos y modelos

### `Candidate`

Propiedades requeridas:

`id: string`, `fullName: string`, `email: string`, `phone: string`,
`yearsOfExperience: number`, `skills: string[]`, `englishLevel: EnglishLevel`,
`seniority: SeniorityLevel`, `currentSalary: number`, `expectedSalary: number`,
`availability: AvailabilityStatus`, `location: string`, `remoteOnly: boolean`,
`status: CandidateStatus`.

### `Vacancy`

Propiedades requeridas:

`id: string`, `title: string`, `companyName: string`,
`requiredSkills: string[]`, `preferredSkills: string[]`,
`minYearsExperience: number`, `maxYearsExperience: number`,
`requiredEnglishLevel: EnglishLevel`, `requiredSeniority: SeniorityLevel`,
`salaryRangeMin: number`, `salaryRangeMax: number`, `isRemote: boolean`,
`location: string`, `status: VacancyStatus`.

### `SelectionProcess`

Propiedades requeridas:

`id: string`, `candidateId: string`, `vacancyId: string`, `stage: ProcessStage`,
`score: number`, `notes: string`, `createdAt: Date`, `updatedAt: Date`.

### Tipos de dominio

- `EnglishLevel`: `"A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native"`.
- `SeniorityLevel`: `"Junior" | "Semi-Senior" | "Senior" | "Lead" | "Executive"`.
- `AvailabilityStatus`: `"Immediate" | "2 weeks" | "1 month" | "Not available"`.
- `CandidateStatus`: `"Active" | "In process" | "Hired" | "Inactive"`.
- `VacancyStatus`: `"Open" | "In progress" | "Closed" | "On hold"`.
- `ProcessStage`: `"Screening" | "Interview" | "Technical test" | "Final interview" | "Offer" | "Rejected" | "Hired"`.

Los modelos describen datos obligatorios y no anulables. Las funciones de validación aceptan `null` o `undefined` para poder devolver errores estructurados ante esos inputs.

## Funciones

### Colecciones — `src/utils/collections.ts`

- `filterCandidatesBySkills(candidates: Candidate[], requiredSkills: string[]): Candidate[]`: candidatos que incluyen todas las habilidades requeridas.
- `filterCandidatesBySeniority(candidates: Candidate[], seniority: SeniorityLevel): Candidate[]`: coincidencia exacta de seniority.
- `filterCandidatesByAvailability(candidates: Candidate[], availability: AvailabilityStatus[]): Candidate[]`: coincidencia con cualquiera de las disponibilidades pedidas.
- `sortCandidatesBySalary(candidates: Candidate[], order: "asc" | "desc"): Candidate[]`: orden por salario esperado; no muta el array recibido.
- `sortCandidatesByExperience(candidates: Candidate[], order: "asc" | "desc"): Candidate[]`: orden por años de experiencia; no muta el array recibido.

Los filtros comparan habilidades sin distinguir mayúsculas y eliminando espacios en los extremos. Una habilidad repetida cuenta una sola vez por lista. Los ordenamientos son estables.

### Búsqueda — `src/utils/search.ts`

- `findCandidateById(candidates: Candidate[], id: string): Candidate | null`: búsqueda lineal; `null` si no existe, también en lista vacía.
- `findCandidateByEmail(candidates: Candidate[], email: string): Candidate | null`: búsqueda lineal con comparación de email case-insensitive.
- `binarySearchCandidateBySalary(sortedCandidates: Candidate[], targetSalary: number): number`: búsqueda binaria sobre salario esperado ascendente; índice coincidente o `-1`, incluso para lista vacía.

### Transformaciones, scoring y reportes — `src/utils/transformations.ts`

- `calculateCandidateScore(candidate: Candidate, vacancy: Vacancy): number`: puntaje de 0 a 100.
- `rankCandidatesForVacancy(candidates: Candidate[], vacancy: Vacancy): Array<{ candidate: Candidate; score: number }>`: puntuación descendente; empates mantienen el orden de entrada.
- `groupCandidatesBySeniority(candidates: Candidate[]): Record<SeniorityLevel, Candidate[]>`: incluye todas las claves de seniority, aunque sus listas estén vacías.
- `countCandidatesByStatus(candidates: Candidate[]): Record<CandidateStatus, number>`: incluye todos los estados, con cero cuando no haya candidatos en uno.
- `calculateAverageSalary(candidates: Candidate[]): number`: promedio de salario esperado, redondeado a dos decimales; lista vacía produce `0`.
- `findTopSkills(candidates: Candidate[], topN: number): Array<{ skill: string; count: number }>`: cuenta candidatos con la habilidad (no repeticiones dentro de un mismo candidato) y devuelve frecuencia descendente. Un `topN` entero no positivo devuelve `[]`; un `topN` no entero produce `RangeError`, incluso si es negativo.
- `calculateVacancyFillRate(processes: SelectionProcess[]): number`: porcentaje de procesos con etapa `"Hired"`, redondeado a dos decimales; lista vacía produce `0`.

#### Cálculo de puntuación

- Habilidades requeridas: 40 puntos si están todas; 20 si se alcanza al menos el 50%; si no, 0.
- Habilidades preferidas: 10 por cada una, hasta 20 puntos.
- Los puntos de requeridas y preferidas se suman, con tope global de 40 para habilidades.
- Experiencia: 20 dentro del rango inclusivo; 10 si la distancia al límite excedido más cercano es de hasta 2 años; en otro caso 0. Se admiten fracciones.
- Seniority: 15 exacto; 7 si está un nivel por encima o debajo; en otro caso 0. El orden de niveles es el declarado por `SeniorityLevel`.
- Inglés: 15 si alcanza o supera el requerido; en otro caso 0. El orden es el declarado por `EnglishLevel`.
- Salario esperado: 10 dentro del rango; 5 por encima del máximo hasta un 20%; en otro caso 0.
- La suma máxima es 100.

Las habilidades preferidas y requeridas se normalizan (trim y case-insensitive) antes de compararse. Los duplicados no suman más de una vez.

### Validaciones — `src/utils/validations.ts`

- `validateCandidate(candidate: Candidate | null | undefined): { valid: boolean; errors: string[] }`.
- `validateVacancy(vacancy: Vacancy | null | undefined): { valid: boolean; errors: string[] }`.
- `isValidEmail(email: string): boolean`.

Además de los campos obligatorios ausentes o vacíos y los tipos de campos, se aplican las reglas de negocio:

- Candidato: experiencia entre 0 y 50; salarios actual y esperado mayores que 0; al menos una habilidad; email válido; teléfono no vacío.
- Vacante: al menos una habilidad requerida; experiencia mínima no negativa; máxima no menor que mínima; ambos salarios positivos y máximo no menor que mínimo.
- Email: exactamente un `@`, texto a ambos lados, sin espacios y al menos un punto en el dominio con texto antes y después.

Las validaciones devuelven mensajes descriptivos y no lanzan excepciones por datos incompletos. `findTopSkills` lanza `RangeError` si `topN` no es entero.

## Ejemplos originales

Los ejemplos originales `sampleCandidates` (María González, Juan Pérez y Carolina Silva) y `sampleVacancy` (Senior Full-Stack Developer) permanecen íntegros en [`requirements.md`](./requirements.md). Deben utilizarse como fixture de referencia para evaluar filtros, score y ranking.

## Casos límite y criterios de aceptación

- Arrays vacíos: filtros y ordenamientos devuelven arrays vacíos; búsqueda lineal devuelve `null`; binaria devuelve `-1`; promedio y fill rate devuelven `0`.
- Las búsquedas y filtros respetan las reglas de comparación indicadas.
- Los ordenamientos no mutan la entrada y son estables; los rankings conservan el orden original en empates.
- Los reportes devuelven todas las claves de los `Record` especificados.
- Puntajes y tasas quedan dentro de sus límites definidos y se redondean solo donde se especifica.
- Las validaciones detectan campos obligatorios ausentes/vacíos y reglas de negocio, con errores claros.
- Funciones puras: resultados determinados por argumentos, sin mutar arrays de entrada ni depender de estado global.
- TypeScript en modo estricto valida los archivos de `src/` mediante `npm run typecheck`.

## Puntos todavía no especificados

- El texto de los errores de validación no está fijado literalmente.
- No se define el desempate de `findTopSkills` ni la representación (mayúsculas/minúsculas) elegida para mostrar una habilidad normalizada.
- Para campos fuera del contrato de tipos, salvo validadores y `topN`, no se prescribe un resultado alternativo; las funciones de negocio reciben datos válidos.
