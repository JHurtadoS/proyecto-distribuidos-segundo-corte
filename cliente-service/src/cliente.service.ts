import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

// Define proper types
interface Tetramino {
    tipo: string;
    matriz: number[][];
    [key: string]: any; // Allow for additional properties
}

@Injectable()
export class ClienteService {
    constructor(private readonly http: HttpService) { }

    private get url() {
        const modo = process.env.MODO ?? 'coordinada';
        return {
            generador: process.env.GENERADOR_URL || 'http://generador:3000',
            girador: process.env.GIRADOR_URL || 'http://girador:3000',
            deslizador: process.env.DESLIZADOR_URL || 'http://deslizador:3000',
            tablero: process.env.TABLERO_URL || 'http://verificadortablero:3000',
            middleware: process.env.MIDDLEWARE_URL || 'http://middleware:3000',
            modo,
        };
    }

    /* ---------- API pública ---------- */
    async iniciarJuego() {
        const base = this.url;
        const target = base.tablero + '/tablero/iniciar';
        const { data } = await lastValueFrom(this.http.post(target));
        return data; // TableroDto
    }

    async generarTetramino() {
        const base = this.url;
        const target = base.modo === 'coordinada'
            ? base.generador + '/tetramino'
            : base.middleware + '/middleware/tetramino';
        const { data } = await lastValueFrom(this.http.post(target));

        // Return the full response which now includes tetramino and tablero
        return data;
    }

    async girar(direccion: 'izquierda' | 'derecha') {
        const base = this.url;

        try {
            const target = base.modo === 'coordinada'
                ? base.girador + '/rotar'
                : base.middleware + '/middleware/girar';

            // We don't need to fetch the tetramino first, as the girador service
            // will fetch it if not provided
            const payload = {
                direccion,
                actualizarTablero: true
            };

            const { data } = await lastValueFrom(this.http.post(target, payload));
            return data;
        } catch (error) {
            console.error('Error in girar:', error.message);
            return {
                exito: false,
                motivo: 'Error en la rotación: ' + error.message,
                tetramino: null
            };
        }
    }

    async deslizar(direccion: 'izquierda' | 'derecha' | 'abajo') {
        const base = this.url;
        const target = base.modo === 'coordinada'
            ? base.deslizador + '/deslizar'
            : base.middleware + '/middleware/deslizar';
        const { data } = await lastValueFrom(this.http.post(target, { direccion }));
        return data;
    }

    async obtenerTablero() {
        const base = this.url;
        const target = base.tablero + '/tablero'; // lectura directa en ambos modos
        const { data } = await lastValueFrom(this.http.get(target));
        return data; // TableroDto
    }
} 