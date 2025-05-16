import { Injectable } from '@nestjs/common';
import { TableroRepository } from './repository/tablero.repository';
import { ActualizarTableroDto } from './dto/actualizar-tablero.dto';
import { TableroDto } from './dto/tablero.dto';
import { PiezaActivaDto } from './dto/pieza-activa.dto';
import { PiezaActiva } from './models/pieza-activa.interface';

@Injectable()
export class VerificadorTableroService {
    constructor(private readonly tableroRepository: TableroRepository) { }

    iniciarTablero(): TableroDto {
        // Crear matriz 20x10 llena de ceros
        const matriz: number[][] = Array(20).fill(null).map(() => Array(10).fill(0));
        this.tableroRepository.setMatriz(matriz);
        this.tableroRepository.setPiezaActiva(null);

        return { estado: matriz };
    }

    obtenerTablero(): TableroDto {
        // Clonar la matriz de bloques fijos
        const matriz = this.clonarMatriz(this.tableroRepository.getMatriz());
        const piezaActiva = this.tableroRepository.getPiezaActiva();

        // Si hay pieza activa, superponerla sobre la copia
        if (piezaActiva) {
            this.superponerPieza(matriz, piezaActiva);
        }

        return { estado: matriz };
    }

    getTablero(): TableroDto {
        return this.obtenerTablero();
    }

    obtenerPiezaActiva(): PiezaActivaDto | null {
        const piezaActiva = this.tableroRepository.getPiezaActiva();
        if (!piezaActiva) return null;

        return {
            tetramino: piezaActiva.tetramino,
            x: piezaActiva.x,
            y: piezaActiva.y
        };
    }

    actualizarTablero(dto: ActualizarTableroDto): boolean {
        const { tetramino, x, y } = dto;
        const piezaActiva = this.tableroRepository.getPiezaActiva();
        const matriz = this.tableroRepository.getMatriz();

        // Si no hay pieza activa, es una nueva pieza
        if (piezaActiva === null) {
            // Validar si puede colocarse en la posición inicial
            if (!this.validarColocacion(matriz, tetramino.matriz, x, y)) {
                // Si no se puede colocar en y=0, es GAME_OVER
                if (y === 0) {
                    return false; // GAME_OVER
                }
                return false; // No se puede colocar
            }

            // Guardar la nueva pieza activa
            this.tableroRepository.setPiezaActiva({ tetramino, x, y });
            return true;
        } else {
            // Es un movimiento/rotación de la pieza actual
            if (!this.validarColocacion(matriz, tetramino.matriz, x, y)) {
                // Si era movimiento hacia abajo (y > piezaActiva.y) y falló
                if (y > piezaActiva.y) {
                    // Fijar la pieza actual en su posición
                    this.fijarPieza(piezaActiva);
                    // Limpiar líneas completas
                    this.limpiarLineasCompletas();
                    // Ya no hay pieza activa
                    this.tableroRepository.setPiezaActiva(null);
                    return false; // Indica que ya no pudo bajar más
                }
                return false; // No se puede mover/rotar
            }

            // Actualizar la posición/forma de la pieza activa
            this.tableroRepository.setPiezaActiva({ tetramino, x, y });
            return true;
        }
    }

    // Alias para mantener compatibilidad
    colocarPieza(dto: ActualizarTableroDto): boolean {
        return this.actualizarTablero(dto);
    }

    // Métodos auxiliares
    private validarColocacion(matriz: number[][], formaPieza: number[][], x: number, y: number): boolean {
        // Verificar si la pieza está dentro de los límites del tablero y no colisiona
        for (let i = 0; i < formaPieza.length; i++) {
            for (let j = 0; j < formaPieza[i].length; j++) {
                if (formaPieza[i][j] === 1) {
                    const filaTablero = y + i;
                    const columnaTablero = x + j;

                    // Verificar límites
                    if (
                        filaTablero < 0 ||
                        filaTablero >= 20 ||
                        columnaTablero < 0 ||
                        columnaTablero >= 10
                    ) {
                        return false; // Fuera de límites
                    }

                    // Verificar colisión con bloques fijos
                    if (matriz[filaTablero][columnaTablero] === 1) {
                        return false; // Colisión con bloque fijo
                    }
                }
            }
        }
        return true; // No hay colisión ni está fuera de límites
    }

    private fijarPieza(piezaActiva: PiezaActiva): void {
        const matriz = this.tableroRepository.getMatriz();
        const { tetramino, x, y } = piezaActiva;

        // Añadir los bloques de la pieza a la matriz de bloques fijos
        for (let i = 0; i < tetramino.matriz.length; i++) {
            for (let j = 0; j < tetramino.matriz[i].length; j++) {
                if (tetramino.matriz[i][j] === 1) {
                    const filaTablero = y + i;
                    const columnaTablero = x + j;

                    // Solo fijar si está dentro de los límites
                    if (
                        filaTablero >= 0 &&
                        filaTablero < 20 &&
                        columnaTablero >= 0 &&
                        columnaTablero < 10
                    ) {
                        matriz[filaTablero][columnaTablero] = 1;
                    }
                }
            }
        }

        // Actualizar matriz en el repositorio
        this.tableroRepository.setMatriz(matriz);
    }

    private limpiarLineasCompletas(): void {
        const matriz = this.tableroRepository.getMatriz();
        let lineasLimpiadas = 0;

        // Recorrer todas las filas de abajo hacia arriba
        for (let i = 19; i >= 0; i--) {
            // Verificar si la fila está completa (todos los valores son 1)
            if (matriz[i].every(celda => celda === 1)) {
                // Eliminar la fila completa
                matriz.splice(i, 1);
                // Añadir una nueva fila vacía al principio
                matriz.unshift(Array(10).fill(0));
                // Incrementar contador y ajustar el índice para revisar la misma posición
                lineasLimpiadas++;
                i++; // Compensar el decremento del loop para revisar la misma posición de nuevo
            }
        }

        // Actualizar matriz en el repositorio
        this.tableroRepository.setMatriz(matriz);
    }

    private superponerPieza(matriz: number[][], piezaActiva: PiezaActiva): void {
        const { tetramino, x, y } = piezaActiva;

        // Superponer los bloques de la pieza activa sobre la matriz
        for (let i = 0; i < tetramino.matriz.length; i++) {
            for (let j = 0; j < tetramino.matriz[i].length; j++) {
                if (tetramino.matriz[i][j] === 1) {
                    const filaTablero = y + i;
                    const columnaTablero = x + j;

                    // Solo superponer si está dentro de los límites
                    if (
                        filaTablero >= 0 &&
                        filaTablero < 20 &&
                        columnaTablero >= 0 &&
                        columnaTablero < 10
                    ) {
                        matriz[filaTablero][columnaTablero] = 1;
                    }
                }
            }
        }
    }

    private clonarMatriz(matriz: number[][]): number[][] {
        return JSON.parse(JSON.stringify(matriz));
    }
} 