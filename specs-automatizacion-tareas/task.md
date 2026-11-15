# Tareas de implementación

## Modelos — `spec.md`: Tipos y modelos

- [x] Definir interfaces `Candidate`, `Vacancy` y `SelectionProcess` en `src/types/models.ts`.
- [x] Definir todos los tipos union y tipos de retorno requeridos en `src/types/models.ts`.

## Validaciones — `spec.md`: Validaciones

- [x] Implementar `isValidEmail` conforme a A-06.
- [x] Implementar `validateCandidate`, incluidos campos obligatorios, valores y reglas de negocio.
- [x] Implementar `validateVacancy`, incluidos campos obligatorios, valores y reglas de negocio.

## Colecciones — `spec.md`: Colecciones

- [x] Implementar los filtros por habilidades, seniority y disponibilidad.
- [x] Implementar ordenamiento por salario esperado y experiencia sin mutación.
- [x] Garantizar estabilidad en ambos ordenamientos.

## Búsquedas — `spec.md`: Búsqueda

- [x] Implementar búsqueda lineal por ID y email.
- [x] Implementar búsqueda binaria por salario esperado ascendente.
- [x] Mantener contratos en entradas vacías: `null` para búsqueda lineal y `-1` para binaria.

## Transformaciones y reportes — `spec.md`: Transformaciones, scoring y reportes

- [x] Implementar normalización/deduplicación de habilidades para matching y conteo.
- [x] Implementar score por habilidades con tope de 40 y score global de 100.
- [x] Implementar score de experiencia, seniority, inglés y salario según los límites especificados.
- [x] Implementar ranking descendente, estable ante empates.
- [x] Implementar agrupación por seniority y conteo por estado con todas las claves.
- [x] Implementar promedio vacío como `0` y redondeo a dos decimales.
- [x] Implementar top skills; rechazar decimales y devolver `[]` para enteros `topN <= 0`.
- [x] Implementar fill rate vacío como `0` y redondear a dos decimales.

## Herramientas y validación — `spec.md`: Criterios de aceptación

- [x] Añadir `tsconfig.json` estricto para `src/`, sin emitir JavaScript.
- [x] Añadir script `npm run typecheck` y dependencia de desarrollo TypeScript.
- [x] Crear `src/demo.ts` con los datos de ejemplo de `./requirements.md` e invocar las utilidades.
- [x] Ejecutar `npx tsx src/demo.ts` e imprimir sus resultados y un error de validación.
- [x] Confirmar que no se modificaron implementaciones ajenas ni se cambió la ubicación solicitada.
