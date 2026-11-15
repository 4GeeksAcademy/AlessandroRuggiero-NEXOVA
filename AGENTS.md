# Instrucciones para agentes

## Inicio de cada sesión

1. Lee `memory-bank/projectBrief.md`, `memory-bank/techContext.md` y `memory-bank/progress.md` antes de empezar.
2. Si falta algún documento, indícalo; no inventes su contenido ni lo crees automáticamente. El documento técnico disponible se llama `techContext.md` (no `techContentex.md`).
3. Lee `README.md` o `README.es.md`, y el README e instrucciones disponibles en la carpeta donde trabajarás.
4. Inspecciona la estructura y el código existentes. Contrasta el Memory Bank con el repositorio y señala contradicciones relevantes antes de proponer cambios.

## Organización del monorepo

| Ruta | Responsabilidad |
| --- | --- |
| `/uis` | Proyectos frontend de la empresa. |
| `/uis/website` | Web corporativa pública, con entrada en `/` y marca y contenido alineados con `CONTEXT.md`. |
| `/uis/backoffice` | Aplicación interna, separada del sitio público, con layout propio y entrada en `/`. |
| `/services` | APIs y servicios backend. |

Estas rutas definen dónde debe vivir el código cuando se desarrollen las aplicaciones; no implican que ya existan. Comprueba la estructura real antes de trabajar y sigue los README e instrucciones disponibles en cada ubicación. Utiliza las rutas previstas cuando la tarea incluya desarrollar las aplicaciones. No crees aplicaciones, carpetas o proyectos como consecuencia de estas instrucciones ni crees un segundo árbol de frontend o API. Respeta el contenido existente e informa de rutas ausentes o contradicciones antes de proponer cambios estructurales.

Antes de modificar archivos en `uis/`, consulta `.agents/rules/ui-boundaries.md`. Esta regla está documentada en el repositorio, pero no se debe asumir que una herramienta la carga automáticamente.

## Alcance y seguridad

- Realiza solo los cambios necesarios para la tarea solicitada.
- No sobrescribas, descartes, muevas ni renombres cambios preexistentes del desarrollador.
- No inventes requisitos, estado de implementación ni decisiones técnicas.
- Solicita confirmación antes de modificar estas rutas cuando no formen parte explícita de la tarea: `CONTEXT.md`, `CONTEXT.es.md`, `.devcontainer/`, `.gitignore`, `packages/shared/`, `infra/`, `README.md`, `README.es.md` y este `AGENTS.md`.
- No copies secretos o credenciales al Memory Bank, a `AGENTS.md`, a registros ni a respuestas. Si encuentras archivos o valores sensibles, no reveles su contenido; informa solo de la ubicación y el riesgo.

## Procedimiento obligatorio antes de cada commit

1. **Revisar cambios:** inspecciona el estado del repositorio y los archivos modificados. Distingue los cambios propios de los preexistentes.
2. **Comprobar alcance:** confirma que cada cambio corresponde a la tarea y que no hay modificaciones accidentales o ajenas.
3. **Validar:** ejecuta las pruebas y verificaciones pertinentes documentadas para los componentes afectados. Revisa README, configuraciones y scripts; no inventes comandos.
4. **Revisar resultados:** informa de errores y de comprobaciones que no pudiste ejecutar. Nunca afirmes que una prueba pasó si no se ejecutó correctamente.
5. **Revisar documentación:** determina si el Memory Bank debe reflejar decisiones o cambios importantes y actualízalo solo dentro del alcance autorizado.
6. **Preparar el commit:** revisa exactamente qué archivos y cambios se incluirían. Excluye secretos, archivos sensibles y cambios ajenos a la tarea.

Si una comprobación falla o aparece un cambio inesperado, detente e informa. No realices el commit hasta resolverlo o recibir autorización explícita para una excepción. Preparar cambios, crear un commit y publicar cambios remotos son acciones distintas. No hagas commit ni publiques cambios sin autorización explícita.

## Cierre de la tarea

Resume los cambios realizados, las comprobaciones ejecutadas y sus resultados, y los problemas pendientes.
