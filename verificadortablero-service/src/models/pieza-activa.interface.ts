import { TetraminoDto } from "src/dto/tetramino.dto";

export interface PiezaActiva {
    tetramino: TetraminoDto; // matriz 4×4
    x: number;               // columna superior‑izquierda
    y: number;               // fila superior‑izquierda
} 