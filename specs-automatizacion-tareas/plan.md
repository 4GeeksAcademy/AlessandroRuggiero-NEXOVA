# Plan de implementación

## Estrategia

Implementar de forma incremental y sin dependencias de ejecución: primero los tipos, después las utilidades por responsabilidad y finalmente la validación TypeScript del proyecto. Mantener las funciones puras, preservar los arrays de entrada y aplicar las aclaraciones aprobadas en [`requirements.md`](./requirements.md).

## Arquitectura y archivos

```text
src/types/models.ts                 Interfaces y tipos de dominio
src/utils/collections.ts            Filtros y ordenamientos
src/utils/search.ts                 Búsquedas lineal y binaria
src/utils/transformations.ts        Matching, ranking y agregaciones
src/utils/validations.ts            Reglas de negocio y email
specs-automatizacion-tareas/spec.md Especificación trazable
specs-automatizacion-tareas/plan.md Este plan
specs-automatizacion-tareas/task.md Checklist de trabajo
package.json                        Comando de desarrollo typecheck
tsconfig.json                       Compilación estricta sin emitir JS
```

La estructura actual incluye `src/`, `package.json` y `tsconfig.json` en la raíz, por lo que la ubicación `src/` solicitada está disponible. Aunque también existe `packages/shared/types/index.ts`, se conserva la ubicación solicitada conforme a A-07.

## Orden de desarrollo

1. Definir los modelos, unions y tipos de retorno.
2. Implementar validaciones para establecer contratos de datos.
3. Implementar filtros y ordenamientos, incluyendo estabilidad y no mutación.
4. Implementar búsquedas lineales y búsqueda binaria.
5. Implementar score/ranking y reportes en transformaciones.
6. Incorporar configuración TypeScript mínima y el script `npm run typecheck`.
7. Validar el proyecto y revisar que las decisiones estén reflejadas en la especificación y checklist.

## Estrategia de pruebas y validación

- Ejecutar `npm run typecheck` para validar tipos y compilación sin generar archivos.
- Usar los ejemplos originales de `requirements.md` para comprobar los flujos funcionales cuando se ejecute una suite de pruebas.
- Cubrir arrays vacíos, estabilidad de orden, ausencia de mutaciones, normalización/deduplicación de habilidades, límites de score y experiencia, y errores de validación.
- No se encontró configuración ni runner de tests en la raíz. No se incorpora un framework de pruebas en esta etapa; queda pendiente acordar uno si se requieren pruebas automatizadas.

## Consideraciones técnicas

- La raíz no tenía configuración de TypeScript; `package.json` declarará TypeScript como herramienta de desarrollo y expondrá `npm run typecheck`.
- La implementación de búsqueda conserva los contratos originales: búsqueda lineal devuelve `null`, búsqueda binaria devuelve `-1`.
- Los tipos de modelos mantienen obligatorios los campos especificados. Los validadores admiten `null` y `undefined` como entrada y responden con errores.
- Score se limita a 100 y la categoría de habilidades se limita a 40.
- No se añaden librerías de runtime ni se modifica el código existente del sitio, servicios o tipos compartidos.
