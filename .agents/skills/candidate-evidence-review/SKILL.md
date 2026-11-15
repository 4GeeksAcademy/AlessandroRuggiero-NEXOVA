---
name: candidate-evidence-review
description: Compara los requisitos de una vacante con evidencia explícita en uno o varios CV y genera una matriz verificable para revisión humana. No clasifica ni descarta candidatos.
---

# Revisión de evidencia de candidatos

## Objetivo

Ayudar al equipo de Nexova a revisar CV de forma ordenada. La skill compara lo que pide una vacante con lo que cada CV dice explícitamente, para que una persona pueda ver qué información está respaldada, qué no aparece y qué necesita aclaración. No elige ni descarta candidatos.

## En pocas palabras

Se le entregan los requisitos del puesto y los CV. La skill devuelve una tabla que muestra qué requisito aparece en cada CV y dónde, qué información no consta o qué no queda claro. La persona responsable revisa la tabla y toma la decisión.

## Inputs

- **Requisitos de la vacante:** texto de la vacante o lista de criterios; deben indicar cuáles son obligatorios y cuáles preferidos. Si no se distinguen, pide aclaración o registra esa limitación sin decidir por cuenta propia.
- **CV:** uno o varios archivos legibles o su texto extraído, identificados individualmente con un ID. Usa identificadores anónimos si están disponibles.
- **Idioma de salida:** opcional. Si no se indica, responde en el idioma de los requisitos.

No continúes la comparación de un archivo ilegible o de requisitos incompletos como si estuvieran disponibles. Indica qué input falta o no se pudo leer.

## Procedimiento

1. Enumera los requisitos de la vacante sin agregar ni reinterpretar criterios.
2. Revisa cada CV por separado frente a cada requisito.
3. Asigna uno de estos estados por requisito:
   - **Evidencia encontrada:** el CV contiene información explícita relacionada.
   - **No consta en el CV:** no se encontró información explícita; esto no demuestra que la persona carezca de esa experiencia o habilidad.
   - **Ambiguo:** la información no permite determinar claramente si se cumple el requisito.
4. Para cada estado de evidencia encontrada o ambigua, incluye una cita breve y una referencia a la página, sección o fragmento disponible. No inventes números de página.
5. Limita el análisis a los requisitos laborales proporcionados. Ignora datos personales o sensibles que no sean pertinentes.
6. No infieras cualidades, no calcules puntuaciones, no ordenes perfiles y no recomiendes contratar, entrevistar o descartar.

## Output

Entrega una matriz para cada candidato con las columnas:

| Requisito | Tipo (obligatorio/preferido/no especificado) | Estado | Evidencia y ubicación |
| --- | --- | --- | --- |

Si el tipo de un requisito no está definido en los inputs, indica **no especificado** y no lo reclasifiques. Después de cada matriz, lista las limitaciones o inputs faltantes y señala que la valoración y decisión corresponden a una persona.

## Ejemplo de uso

**Ejemplo ficticio.** La vacante indica como requisito obligatorio 2 años de experiencia en ventas B2B y como preferencia inglés C1. El CV de `C-01` indica 3 años como ejecutivo de ventas B2B (Experiencia, pág. 2) e inglés C1 (Idiomas, pág. 3).

| Requisito | Tipo (obligatorio/preferido/no especificado) | Estado | Evidencia y ubicación |
| --- | --- | --- | --- |
| 2 años de experiencia en ventas B2B | Obligatorio | Evidencia encontrada | «3 años como ejecutivo de ventas B2B»; Experiencia, pág. 2. |
| Inglés C1 | Preferido | Evidencia encontrada | «Inglés C1»; Idiomas, pág. 3. |

La matriz documenta lo que aparece en el CV; no asigna una puntuación ni recomienda una decisión de contratación.

## Criterios de aceptación

La tarea está completa solo si se cumplen todos estos puntos:

- Cada requisito proporcionado aparece en la matriz de cada candidato revisado.
- Cada requisito tiene exactamente uno de los tres estados definidos.
- Toda evidencia encontrada o ambigua incluye una referencia verificable al CV, sin inventar citas ni ubicaciones.
- La falta de evidencia se expresa como «No consta en el CV», no como incumplimiento demostrado.
- Los requisitos no se agregan, eliminan ni cambian de tipo; los tipos ausentes se marcan como no especificados.
- El resultado no contiene puntuaciones, rankings ni recomendaciones automáticas de selección o descarte.
- Los archivos ilegibles, requisitos faltantes y demás limitaciones se informan explícitamente.
