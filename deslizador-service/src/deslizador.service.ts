import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MovimientoDto } from './dto/movimiento.dto';
import { MovimientoResponseDto } from './dto/movimiento-response.dto';

@Injectable()
export class DeslizadorService {
    constructor(private readonly http: HttpService) { }

    private calcNuevaPos(x: number, y: number, dir: MovimientoDto['direccion']) {
        switch (dir) {
            case 'izquierda': return { x: x - 1, y };
            case 'derecha': return { x: x + 1, y };
            case 'abajo': return { x, y: y + 1 };
        }
    }

    // Método que coincide con el diagrama
    deslizarTetramino(tetramino: any, distancia: any): any {
        // En este caso distancia puede ser una dirección o un objeto con dx, dy
        if (typeof distancia === 'string') {
            const posActual = { x: tetramino.x || 0, y: tetramino.y || 0 };
            const nuevaPos = this.calcNuevaPos(posActual.x, posActual.y, distancia as MovimientoDto['direccion']);
            return {
                tetramino: tetramino.tetramino || tetramino,
                x: nuevaPos.x,
                y: nuevaPos.y
            };
        } else if (typeof distancia === 'object' && distancia.dx !== undefined && distancia.dy !== undefined) {
            const posActual = { x: tetramino.x || 0, y: tetramino.y || 0 };
            return {
                tetramino: tetramino.tetramino || tetramino,
                x: posActual.x + distancia.dx,
                y: posActual.y + distancia.dy
            };
        }
        return tetramino; // Si no se reconoce el formato, devolver sin cambios
    }

    /** Versión coordinada – orquesta la llamada al tablero */
    async moverPieza(direccion: MovimientoDto['direccion']): Promise<MovimientoResponseDto> {
        if (process.env.MODO !== 'coordinada')
            throw new Error('Método sólo válido en modo coordinado');

        // 1. obtener pieza activa
        const { data: activo } = await firstValueFrom(
            this.http.get(`${process.env.TABLERO_URL}/tablero/activo`)
        );

        if (!activo) return { exito: false, motivo: 'SIN_PIEZA_ACTIVA' };

        // 2. calcular nueva posición
        const { x: nx, y: ny } = this.calcNuevaPos(activo.x, activo.y, direccion);

        // 3. solicitar colocación
        const { data } = await firstValueFrom(
            this.http.post(`${process.env.TABLERO_URL}/tablero/colocar`, {
                tetramino: activo.tetramino,
                x: nx,
                y: ny,
            })
        );

        /* si dir==abajo && !data.exito ⇒ pieza fijada */
        return {
            exito: data.exito,
            motivo: !data.exito && direccion === 'abajo' ? 'FIJADA' : (data.exito ? undefined : 'COLISION'),
        };
    }

    /** Versión orquestada – pura función */
    calcMovimientoPure(activo: { x: number; y: number }, dir: MovimientoDto['direccion']) {
        return this.calcNuevaPos(activo.x, activo.y, dir);
    }
} 