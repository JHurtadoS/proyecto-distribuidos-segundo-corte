import { Injectable } from '@nestjs/common';
import { RotacionRequestDto } from './dto/rotacion-request.dto';
import { RotacionResponseDto } from './dto/rotacion-response.dto';
import axios from 'axios';

@Injectable()
export class GiradorService {
    private rotarMatriz(m: number[][], dir: 'izquierda' | 'derecha'): number[][] {
        const n = 4;
        const out = Array.from({ length: n }, () => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dir === 'derecha') {
                    out[i][j] = m[n - 1 - j][i];
                } else {
                    out[i][j] = m[j][n - 1 - i];
                }
            }
        }
        return out;
    }

    // Método que coincide con el diagrama
    girarTetramino(tetramino: any): any {
        if (!tetramino || !tetramino.matriz) {
            throw new Error('Tetramino inválido o sin matriz');
        }

        // Por defecto girar a la derecha si no se especifica dirección
        return {
            ...tetramino,
            matriz: this.rotarMatriz(tetramino.matriz, 'derecha'),
        };
    }

    async rotar(dto: RotacionRequestDto): Promise<RotacionResponseDto> {
        // Validate we have valid input before proceeding
        if (!dto) {
            return {
                tetramino: null,
                exito: false,
                motivo: 'Datos de rotación inválidos'
            };
        }

        // Make sure we have a direction, default to 'derecha' if not provided
        const direccion = dto.direccion || 'derecha';

        try {
            // First, check if we have a tetramino with matriz. If not, get the active one from the board
            let tetramino = dto.tetramino;

            // If tetramino is not provided in the request or is invalid, fetch it from the verificadortablero service
            if (!tetramino || !tetramino.matriz) {
                try {
                    const tableroUrl = process.env.TABLERO_URL || 'http://verificadortablero:3000';
                    const response = await axios.get(`${tableroUrl}/tablero/activo`);

                    if (response?.data?.pieza) {
                        tetramino = response.data.pieza;
                    } else {
                        // Still no tetramino, return an error
                        return {
                            tetramino: null,
                            exito: false,
                            motivo: 'No se encontró un tetramino para rotar'
                        };
                    }
                } catch (error) {
                    console.error('Error fetching active tetramino:', error.message);
                    return {
                        tetramino: null,
                        exito: false,
                        motivo: 'Error al obtener el tetramino activo'
                    };
                }
            }

            // Check again if tetramino has matriz after our attempts to get it
            if (!tetramino || !tetramino.matriz) {
                return {
                    tetramino: tetramino || null,
                    exito: false,
                    motivo: 'Tetramino inválido o sin matriz'
                };
            }

            // Create a new rotated tetramino
            const piezaRotada = {
                ...tetramino,
                matriz: this.rotarMatriz(tetramino.matriz, direccion),
            };

            // In coordinated mode, update the board if requested
            if (process.env.MODO === 'coordinada' && dto.actualizarTablero) {
                try {
                    const ok = await this.actualizarTablero(piezaRotada);
                    return {
                        tetramino: piezaRotada,
                        exito: ok,
                        motivo: ok ? undefined : 'COLISION'
                    };
                } catch (error) {
                    return {
                        tetramino: piezaRotada,
                        exito: false,
                        motivo: error.message || 'ERROR_TABLERO'
                    };
                }
            }

            // In orchestrated mode or when update not requested, simply return the rotated piece
            return { tetramino: piezaRotada, exito: true };
        } catch (error) {
            console.error('Error en rotación:', error.message);
            return {
                tetramino: null,
                exito: false,
                motivo: 'Error interno al rotar: ' + error.message
            };
        }
    }

    /** Only used in coordinated mode */
    private async actualizarTablero(tetramino: any): Promise<boolean> {
        try {
            const tableroUrl = process.env.TABLERO_URL || 'http://verificadortablero:3000';
            const url = `${tableroUrl}/tablero/colocar`;

            // Get the active piece current position - simplified version
            // In a full implementation, we would get the x,y from the board or request
            const { data: activePieza } = await axios.get(`${tableroUrl}/tablero/activo`);
            const x = activePieza?.x || 3;
            const y = activePieza?.y || 0;

            // Update the board with the rotated piece
            const { data } = await axios.post(url, {
                tetramino,
                x,
                y
            });

            return data?.exito ?? false;
        } catch (error) {
            console.error('Error updating board:', error.message);
            return false;
        }
    }
} 