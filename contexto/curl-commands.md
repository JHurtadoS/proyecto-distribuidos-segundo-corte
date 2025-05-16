# Curl Commands for Testing Tetris Microservices

This document provides curl commands to test the various microservices in the Tetris application.

## Prerequisites

Ensure that Docker Compose is running with:

```bash
docker-compose up
```

## Cliente Service (Port 8080)

The Cliente service is the entry point for the application.

```bash
# Get client status
curl http://localhost:8080/status

# Get client health check
curl http://localhost:8080/health

# Initialize a new game/board
curl -X POST http://localhost:8080/juego/iniciar

# Get the current board state
curl http://localhost:8080/juego/tablero

# Generate a new piece
curl -X POST http://localhost:8080/juego/tetramino

# Rotate the active piece
curl -X POST http://localhost:8080/juego/girar -H "Content-Type: application/json" -d '{"direccion": "derecha"}'
# Note: The client will automatically retrieve the active tetromino from the board

# Move the active piece
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "abajo"}'
```

## Generador Service (Port 3001)

The Generador service is responsible for generating Tetris pieces.

```bash
# Get a random Tetris piece without placing it
curl http://localhost:3001/tetramino

# Generate a new Tetris piece and place it on the board (POST request)
curl -X POST http://localhost:3001/tetramino

# Response includes:
# - success status (exito)
# - tetromino object (in orchestrated mode)
# - reason if failed (motivo)
```

## Girador Service (Port 3002)

The Girador service handles piece rotation.

```bash
# Rotate the active piece (simplest form - direction only)
curl -X POST http://localhost:3002/rotar -H "Content-Type: application/json" -d '{"direccion": "derecha"}'
# Note: The service automatically retrieves the active tetromino from the board

# Rotate a specific tetramino (advanced form - when you have the tetramino)
curl -X POST http://localhost:3002/rotar -H "Content-Type: application/json" -d '{
  "direccion": "izquierda",
  "actualizarTablero": true
}'

# Response includes:
# - rotated tetramino
# - success status (exito)
# - failure reason if applicable (motivo)
```

## Verificador Tablero Service (Port 3003)

The Verificador Tablero service validates the game board.

```bash
# Initialize a new board
curl -X POST http://localhost:3003/tablero/iniciar

# Get the current board state (complete 20x10 matrix)
curl http://localhost:3003/tablero

# Get the active piece and its position
curl http://localhost:3003/tablero/activo

# Check if a position is valid / place a piece (POST request)
curl -X POST http://localhost:3003/tablero/colocar -H "Content-Type: application/json" -d '{
  "tetramino": {
    "tipo": "I",
    "matriz": [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]
  },
  "x": 3,
  "y": 0
}'
```

## Deslizador Service (Port 3004)

The Deslizador service handles piece movement.

```bash
# Move the active piece (POST request)
curl -X POST http://localhost:3004/deslizar -H "Content-Type: application/json" -d '{"direccion": "abajo"}'
# Note: The service will retrieve the active tetromino and update the board

# Response indicates success (true) or if movement failed (false)
# If direction is "abajo" and returns false, it means the piece has been fixed at its current position
```

## Testing Complete Flow with Sample Data

The following sequence demonstrates a typical flow for playing Tetris:

```bash
# 1. Start a new game
curl -X POST http://localhost:8080/juego/iniciar

# 2. Get the initial board state (should be empty)
curl http://localhost:8080/juego/tablero

# 3. Generate a new piece
curl -X POST http://localhost:8080/juego/tetramino

# 4. Get the current board with the new piece
curl http://localhost:8080/juego/tablero

# 5. Rotate the piece
curl -X POST http://localhost:8080/juego/girar -H "Content-Type: application/json" -d '{"direccion": "derecha"}'

# 6. Get the updated board after rotation
curl http://localhost:8080/juego/tablero

# 7. Move the piece down
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "abajo"}'

# 8. Get the updated board after movement
curl http://localhost:8080/juego/tablero

# 9. Move left/right
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "izquierda"}'

# 10. Continue moving down until the piece is fixed
# (Keep calling the move endpoint with "abajo" until it returns false)
curl -X POST http://localhost:8080/juego/deslizar -H "Content-Type: application/json" -d '{"direccion": "abajo"}'

# 11. Generate the next piece
curl -X POST http://localhost:8080/juego/tetramino
```

## Testing Direct Service Endpoints

For debugging purposes, you can test individual services:

### Testing Piece Generation and Board Placement

```bash
# Initialize a board first
curl -X POST http://localhost:3003/tablero/iniciar

# Generate a piece and verify it was placed
curl -X POST http://localhost:3001/tetramino
curl http://localhost:3003/tablero

# See what piece is active
curl http://localhost:3003/tablero/activo
```

### Testing Rotation

```bash
# Get the active piece
curl http://localhost:3003/tablero/activo

# Rotate it and see the result
curl -X POST http://localhost:3002/rotar -H "Content-Type: application/json" -d '{"direccion": "derecha"}'

# Verify the board was updated
curl http://localhost:3003/tablero
```

## Notes

- The above examples use simple test data. Adjust the JSON payloads as needed.
- For the tetramino matrices, these are 4x4 arrays where 1 represents a block and 0 is empty.
- Available tetromino types: I, O, T, S, Z, J, L
- If any service returns an error, check that:
  1. Docker containers are running
  2. The services are properly connected
  3. Your JSON payload matches the expected format
