# Nexova | Contexto tecnológico

## Sistemas actuales descritos

El briefing de la empresa describe un conjunto de herramientas tecnológicas desconectadas:

- CRM HubSpot.
- Zendesk heredado / sistema de soporte.
- Google Workspace.
- Un sistema propio de seguimiento de candidatos (ATS), creado a principios de la década de 2010.
- Varias hojas de cálculo, formularios, archivos PDF y documentos compartidos que utilizan los equipos.

El briefing indica que no hay telemetría ni logging centralizados, que la visibilidad operativa es limitada y que los despliegues son manuales. No documenta las API, los formatos de datos, el alojamiento, las bases de datos, la gestión de identidades ni los mecanismos de integración de los sistemas actuales.

## Capacidades técnicas solicitadas en el contexto de negocio

- Puntuación y clasificación de CV, y búsqueda semántica sobre los datos de candidatos.
- Automatización del soporte mediante RAG y búsqueda semántica en una base de conocimiento.
- Dashboards operativos, pipelines de datos, alertas y observabilidad centralizada.
- Portales y flujos de trabajo para candidatos, empleados y alumnos.
- Flujos de trabajo de ventas, marketing, formación e ingeniería asistidos por IA.

Estas son necesidades de negocio descritas, no evidencia de que las capacidades existan ni de que se haya elegido una implementación específica.

## Idea de proyecto registrada

`company-choice.md` propone cargar el CV de un candidato, configurar requisitos para el puesto (por ejemplo, experiencia en un sector pertinente) y hacer que un agente evalúe su adecuación mediante filtros cada vez más específicos. Identifica los requisitos del puesto y la información del CV o LinkedIn del candidato como posibles entradas.

## Organización prevista de las aplicaciones

Estas rutas definen dónde debe vivir el código de producto cuando se desarrollen las aplicaciones. No significan que las aplicaciones estén implementadas.

| Ruta | Responsabilidad prevista | Estado comprobado |
| --- | --- | --- |
| `/uis` | Proyectos frontend de Nexova. | Existe; contiene documentación README. |
| `/uis/website` | Sitio web corporativo público, con entrada en `/` y marca y contenido alineados con [`CONTEXT.md`](../CONTEXT.md). | No existe todavía. El README de `uis/` lo identifica como proyecto previsto. |
| `/uis/backoffice` | Aplicación interna, separada del sitio público, con layout propio y entrada en `/`. | No existe todavía. El README de `uis/` la identifica como proyecto previsto. |
| `/services` | APIs y servicios backend. | Existe; contiene documentación README, pero no se observaron subcarpetas de servicios concretos. |

Antes de desarrollar aplicaciones en estas rutas, deben seguirse los README e instrucciones disponibles en cada ubicación. Se debe respetar el contenido existente, no duplicar estructuras y no crear un segundo árbol de frontend o API en otra ubicación. La comprobación actual refleja que existen los directorios padre y su documentación, no aplicaciones funcionales.

## Estado de decisiones y restricciones

- **Confirmado:** las herramientas actuales de la empresa están fragmentadas; la búsqueda de candidatos se describe como manual; el flujo de selección propuesto utiliza criterios del puesto y perfiles de candidatos.
- **No especificado:** arquitectura de la aplicación, lenguajes o frameworks para la solución de Nexova, base de datos o almacén vectorial, modelo o proveedor, alojamiento, autenticación, integraciones, método de evaluación ni estrategia de despliegue.
- **No especificado:** reglas de acceso, conservación, consentimiento, seguridad y privacidad para los CV y la información obtenida de LinkedIn. Son aspectos pendientes de diseño porque el caso de uso propuesto procesa información de candidatos; aquí no se presupone ninguna política.
