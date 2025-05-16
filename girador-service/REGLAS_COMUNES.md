# REGLAS COMUNES

## 1. Formato y Tamaño del Tablero

El tablero de juego es una matriz de 10 columnas × 20 filas (ancho × alto).

- Dimensiones: `10 × 20`
- Los índices comienzan en 0
- Representación: `number[][]` con valores 0 (celda vacía) o 1 (bloque ocupado)
- Posición (0,0): esquina superior izquierda

## 2. Definición de Tetraminos

Los tetraminos son piezas formadas por 4 bloques conectados. Cada tetramino se representa por:

- Tipo: Enum `TetraminoTipo` con valores `I`, `O`, `T`, `S`, `Z`, `J`, `L`
- Matriz: Array 2D de `4×4` con valores 0 (vacío) o 1 (bloque)

### Formas Base

```
I:  [[0,0,0,0],    O:  [[0,0,0,0],    T:  [[0,0,0,0],
     [1,1,1,1],         [0,1,1,0],         [0,1,0,0],
     [0,0,0,0],         [0,1,1,0],         [1,1,1,0],
     [0,0,0,0]]         [0,0,0,0]]         [0,0,0,0]]

S:  [[0,0,0,0],    Z:  [[0,0,0,0],    J:  [[0,0,0,0],
     [0,1,1,0],         [1,1,0,0],         [1,0,0,0],
     [1,1,0,0],         [0,1,1,0],         [1,1,1,0],
     [0,0,0,0]]         [0,0,0,0]]         [0,0,0,0]]

L:  [[0,0,0,0],
     [0,0,1,0],
     [1,1,1,0],
     [0,0,0,0]]
```

## 3. Códigos de Error / Éxito

Todas las respuestas de API deben incluir:

- `exito`: boolean - indica si la operación fue exitosa
- `motivo`: string (opcional) - descripción del error, si aplica
- `timestamp`: number (opcional) - timestamp de la respuesta

Códigos de error comunes:

- `GAME_OVER` - no es posible colocar una nueva pieza (tablero lleno hasta arriba)
- `COLLISION` - la pieza colisiona con bloques existentes o los límites del tablero

## 4. Versionado Semántico y Branch-Naming

- Versionado: Seguir [SemVer](https://semver.org/) (MAJOR.MINOR.PATCH)
- Branches:
  - `main` - versión estable
  - `coordinada` - implementación con llamadas directas entre servicios
  - `orquestada` - implementación con middleware orquestador
  - `feature/*` - para desarrollo de nuevas funcionalidades

## 5. Variables de Entorno Mínimas

- `PORT` - puerto interno del servicio
- `NODE_ENV` - 'development', 'production', etc.
- `*_URL` - URLs de servicios dependientes (GIRADOR_URL, TABLERO_URL, etc.)
- `MODO` - 'coordinada' o 'orquestada'
