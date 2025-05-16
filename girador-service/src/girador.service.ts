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

    async rotar(dto: RotacionRequestDto): Promise<RotacionResponseDto> {
        // Create a new rotated tetramino
        const piezaRotada = {
            ...dto.tetramino,
            matriz: this.rotarMatriz(dto.tetramino.matriz, dto.direccion),
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