# Reglas comunes para el sistema de Tetris

## Reglas básicas del juego

1. **Tablero**: Matriz fija de 20 filas × 10 columnas con valores 0 (vacío) o 1 (ocupado).
2. **Tetraminos**: Limitados a matrices de 4×4, con 7 formas posibles (I, O, T, S, Z, J, L).
3. **Movimientos**:
   - Rotación: 90° en sentido horario o antihorario
   - Desplazamiento: izquierda, derecha, abajo
4. **Reglas de colisión**:
   - No se permite solapamiento de piezas
   - No se permite salirse de los límites del tablero
5. **Eliminación de líneas**:
   - Cuando una fila está completamente llena (todas las celdas = 1), se elimina
   - Las filas superiores bajan y se añade una fila vacía en la parte superior
6. **Fin del juego**:
   - Cuando una nueva pieza no puede colocarse en la parte superior del tablero

## Respuestas estandarizadas

- Las operaciones que pueden fallar deben retornar: `{ exito: boolean, motivo?: string }`
- El campo `motivo` es opcional y explica la razón del fallo cuando `exito` es `false`

## Documentación API

- Todos los endpoints deben estar documentados con Swagger
- Los DTOs deben incluir ejemplos y descripciones claras
- Los tipos de datos deben ser coherentes entre todos los microservicios
