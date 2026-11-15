# Separación entre interfaz pública e interna

## Objetivo

Evitar mezclar el sitio corporativo público con las funciones internas de Nexova.

## Alcance

Por patrón de archivo: `uis/website/**/*` y `uis/backoffice/**/*`.

## Instrucciones

- Ubica el contenido dirigido a visitantes y clientes en `uis/website/`.
- Ubica los flujos de trabajo internos de empleados en `uis/backoffice/`.
- Antes de modificar estas rutas, lee el README correspondiente y respeta la estructura existente.
- Si no está claro si una función es pública o interna, señala la duda antes de implementarla.
- Esta regla no autoriza crear aplicaciones ni carpetas; hazlo solo si la tarea lo solicita expresamente.

## Ejemplos

El sitio corporativo corresponde a `uis/website/`; las solicitudes internas de vacaciones o el acceso a políticas de empleados corresponden a `uis/backoffice/`. Estos ejemplos indican ubicación, no que las aplicaciones ya existan.

Si un posible cliente quiere conocer los servicios o contactar a Nexova, esa experiencia va en el sitio público. Si un empleado quiere solicitar vacaciones o consultar sus beneficios, va en la aplicación interna.
