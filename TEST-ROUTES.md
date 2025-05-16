# Guía de Pruebas para Sistema Tetris

Este documento proporciona ejemplos de cómo probar las diferentes funcionalidades del sistema Tetris a través de sus APIs.

## Iniciar una partida

```bash
# Iniciar el tablero
curl -X POST http://localhost:8080/juego/iniciar

# Obtener el estado actual del tablero
curl -X GET http://localhost:8080/juego/tablero
```

## Generar y manejar piezas

```bash
# Generar una nueva pieza de Tetris
curl -X POST http://localhost:8080/juego/tetramino

# Girar la pieza activa a la derecha
curl -X POST http://localhost:8080/juego/girar -H "Content-Type: application/json" -d '{"direccion": "derecha"}'

# Girar la pieza activa a la izquierda
curl -X POST http://localhost:8080/juego/girar -H "Content-Type: application/json" -d '{"direccion": "izquierda"}'

# Mover la pieza activa a la izquierda
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "izquierda"}'

# Mover la pieza activa a la derecha
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "derecha"}'

# Mover la pieza activa hacia abajo
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "abajo"}'
```

## Pruebas directas a los microservicios

### VerificadorTablero

```bash
# Iniciar un tablero nuevo
curl -X POST http://localhost:3003/tablero/iniciar

# Obtener el estado actual del tablero
curl -X GET http://localhost:3003/tablero

# Obtener la pieza activa
curl -X GET http://localhost:3003/tablero/activo

# Actualizar el tablero con una pieza (ejemplo)
curl -X POST http://localhost:3003/tablero/colocar -H "Content-Type: application/json" \
-d '{
  "tetramino": {
    "tipo": "I",
    "matriz": [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ]
  },
  "x": 3,
  "y": 0
}'
```

### Generador

```bash
# Generar un tetramino aleatorio
curl -X POST http://localhost:3001/tetramino

# Obtener un tetramino aleatorio sin colocarlo
curl -X GET http://localhost:3001/tetramino
```

### Girador

```bash
# Rotar un tetramino (ejemplo)
curl -X POST http://localhost:3002/rotar -H "Content-Type: application/json" \
-d '{
  "tetramino": {
    "tipo": "I",
    "matriz": [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ]
  },
  "direccion": "derecha"
}'
```

### Deslizador

```bash
# Mover la pieza activa
curl -X POST http://localhost:3004/deslizar -H "Content-Type: application/json" \
-d '{"direccion": "derecha"}'

# Deslizar un tetramino específico
curl -X POST http://localhost:3004/deslizar/tetramino -H "Content-Type: application/json" \
-d '{
  "tetramino": {
    "tipo": "I",
    "matriz": [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ]
  },
  "x": 3,
  "y": 5,
  "direccion": "abajo"
}'
```

## Flujo típico de juego

1. Iniciar tablero: `POST /juego/iniciar`
2. Generar primera pieza: `POST /juego/tetramino`
3. Ver el tablero: `GET /juego/tablero`
4. Mover la pieza: `POST /juego/deslizar` (izquierda/derecha/abajo)
5. Girar la pieza: `POST /juego/girar` (izquierda/derecha)
6. Repetir movimientos hasta que la pieza se fije
7. Generar siguiente pieza: `POST /juego/tetramino`
8. Continuar hasta game over (cuando no se pueda colocar una nueva pieza)

## Verificando errores comunes

- **Game Over**: Cuando `POST /juego/tetramino` retorna `{ "exito": false, "motivo": "GAME_OVER" }`
- **Colisión**: Cuando un movimiento o rotación retorna `{ "exito": false, "motivo": "COLISION" }`
- **Pieza fijada**: Cuando mover hacia abajo retorna `{ "exito": false, "motivo": "FIJADA" }`
