import { Injectable } from '@nestjs/common';
import { PiezaActiva } from '../models/pieza-activa.interface';

@Injectable()
export class TableroRepository {
    private matriz: number[][] = [];
    private piezaActiva: PiezaActiva | null = null;

    getMatriz() { return this.matriz; }
    setMatriz(m: number[][]) { this.matriz = m; }

    getPiezaActiva() { return this.piezaActiva; }
    setPiezaActiva(p: PiezaActiva | null) { this.piezaActiva = p; }
} 