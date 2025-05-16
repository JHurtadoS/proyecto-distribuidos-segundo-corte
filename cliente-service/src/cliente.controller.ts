import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { DireccionDto } from './dto/direccion.dto';
import { RespuestaExitoDto } from './dto/respuesta-exito.dto';

@ApiTags('Cliente')
@Controller('juego')
export class ClienteController {
    constructor(private readonly svc: ClienteService) { }

    @Post('iniciar')
    @ApiResponse({ status: 201, description: 'Tablero vacío' })
    iniciar() {
        return this.svc.iniciarJuego();
    }

    @Post('tetramino')
    @ApiResponse({ status: 201, type: RespuestaExitoDto })
    nuevoTetramino() {
        return this.svc.generarTetramino();
    }

    @Post('girar')
    @ApiBody({ type: DireccionDto })
    @ApiResponse({ status: 200, type: RespuestaExitoDto })
    girar(@Body() dir: DireccionDto) {
        return this.svc.girar(dir.direccion as any);
    }

    @Post('deslizar')
    @ApiBody({ type: DireccionDto })
    @ApiResponse({ status: 200, type: RespuestaExitoDto })
    mover(@Body() dir: DireccionDto) {
        return this.svc.deslizar(dir.direccion as any);
    }

    @Get('tablero')
    @ApiResponse({ status: 200, description: 'Estado actual del tablero' })
    tablero() {
        return this.svc.obtenerTablero();
    }
} 