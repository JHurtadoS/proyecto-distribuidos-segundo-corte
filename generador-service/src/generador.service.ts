import { Injectable, BadRequestException } from '@nestjs/common';
import { TetraminoDto } from './dto/tetramino.dto';
import { TetraminoTipo } from './models/tetramino-tipo.enum';
import { GenerarTetraminoResponseDto } from './dto/generar-tetramino-response.dto';
import { HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeneradorService {
    private readonly formasBase: Record<TetraminoTipo, number[][]> = {
        [TetraminoTipo.I]: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [TetraminoTipo.O]: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [TetraminoTipo.T]: [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [TetraminoTipo.S]: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0]
        ],
        [TetraminoTipo.Z]: [
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [TetraminoTipo.J]: [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [TetraminoTipo.L]: [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    };

    async generarTetramino(): Promise<GenerarTetraminoResponseDto> {
        try {
            // Elige al azar un TetraminoTipo
            const tipos = Object.values(TetraminoTipo);
            const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];

            // Crea TetraminoDto con la forma base
            const tetramino: TetraminoDto = {
                tipo: tipoAleatorio,
                matriz: [...this.formasBase[tipoAleatorio]]
            };

            // Verificar que la matriz sigue siendo 4x4 y solo contiene 0|1
            this.validarMatriz(tetramino.matriz);

            // Comprobar el modo (coordinada u orquestada)
            const modo = process.env.MODO || 'coordinada';

            if (modo === 'coordinada') {
                // Determina rotación aleatoria (0-3 veces)
                const rotaciones = Math.floor(Math.random() * 4);

                if (rotaciones > 0) {
                    // Rotar el tetramino llamando al servicio Girador
                    const tetraminoRotado = await this.rotarTetramino(tetramino, rotaciones);

                    // Intentar colocar el tetramino en el tablero
                    const resultado = await this.colocarEnTablero(tetraminoRotado);

                    return {
                        exito: resultado.exito,
                        motivo: resultado.motivo
                    };
                } else {
                    // Intentar colocar el tetramino sin rotar en el tablero
                    const resultado = await this.colocarEnTablero(tetramino);

                    return {
                        exito: resultado.exito,
                        motivo: resultado.motivo
                    };
                }
            } else {
                // En modo orquestado, solo devolver el tetramino sin rotar
                return {
                    exito: true,
                    tetramino: tetramino
                };
            }
        } catch (error) {
            return {
                exito: false,
                motivo: error.message || 'Error al generar tetramino'
            };
        }
    }

    private validarMatriz(matriz: number[][]): void {
        // Verificar que la matriz es 4x4
        if (matriz.length !== 4) {
            throw new BadRequestException('La matriz debe tener 4 filas');
        }

        for (const fila of matriz) {
            if (fila.length !== 4) {
                throw new BadRequestException('Cada fila de la matriz debe tener 4 columnas');
            }

            // Verificar que solo contiene 0|1
            for (const valor of fila) {
                if (valor !== 0 && valor !== 1) {
                    throw new BadRequestException('La matriz solo debe contener valores 0 o 1');
                }
            }
        }
    }

    private async rotarTetramino(tetramino: TetraminoDto, rotaciones: number): Promise<TetraminoDto> {
        try {
            const giradorUrl = process.env.GIRADOR_URL || 'http://girador:3000';

            // Llamar al servicio Girador para cada rotación
            let tetraminoActual = { ...tetramino };

            for (let i = 0; i < rotaciones; i++) {
                const response = await axios.post(`${giradorUrl}/rotar`, {
                    tetramino: tetraminoActual,
                    direccion: 'derecha' // Siempre rotamos a la derecha para simplificar
                });

                if (response.status === HttpStatus.OK || response.status === HttpStatus.CREATED) {
                    tetraminoActual = response.data.tetramino;
                } else {
                    throw new Error('Error al rotar el tetramino');
                }
            }

            return tetraminoActual;
        } catch (error) {
            throw new Error(`Error al llamar al servicio Girador: ${error.message}`);
        }
    }

    private async colocarEnTablero(tetramino: TetraminoDto): Promise<{ exito: boolean, motivo?: string }> {
        try {
            const tableroUrl = process.env.TABLERO_URL || 'http://verificadortablero:3000';

            // Calcular posición inicial (centrado en la parte superior)
            const x = 3; // Posición aproximadamente centrada
            const y = 0; // Parte superior del tablero

            const response = await axios.post(`${tableroUrl}/tablero/colocar`, {
                tetramino,
                x,
                y
            });

            if (response.status === HttpStatus.OK || response.status === HttpStatus.CREATED) {
                return { exito: true };
            } else {
                return {
                    exito: false,
                    motivo: 'No se pudo colocar el tetramino en el tablero'
                };
            }
        } catch (error) {
            // Si el error es porque no hay espacio (game over)
            if (error.response && error.response.data && error.response.data.motivo === 'GAME_OVER') {
                return {
                    exito: false,
                    motivo: 'GAME_OVER'
                };
            }

            return {
                exito: false,
                motivo: `Error al llamar al servicio VerificadorTablero: ${error.message}`
            };
        }
    }
} 