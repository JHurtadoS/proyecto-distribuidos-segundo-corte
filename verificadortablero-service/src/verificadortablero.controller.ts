import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VerificadorTableroService } from './verificadortablero.service';
import { TableroDto } from './dto/tablero.dto';
import { ActualizarTableroDto } from './dto/actualizar-tablero.dto';
import { PiezaActivaDto } from './dto/pieza-activa.dto';

@ApiTags('VerificadorTablero')
@Controller('tablero')
export class VerificadorTableroController {
    constructor(private readonly svc: VerificadorTableroService) { }

    @Post('iniciar')
    @ApiOperation({ summary: 'Iniciar nuevo tablero' })
    @ApiResponse({ status: 201, type: TableroDto })
    iniciar() {
        return this.svc.iniciarTablero();
    }

    @Get()
    @ApiResponse({ status: 200, type: TableroDto })
    obtener() {
        return this.svc.getTablero();
    }

    @Get('activo')
    @ApiResponse({ status: 200, type: PiezaActivaDto })
    activo() {
        return this.svc.obtenerPiezaActiva();
    }

    @Post('colocar')
    @ApiBody({ type: ActualizarTableroDto })
    @ApiResponse({ status: 200, schema: { example: { exito: true } } })
    colocar(@Body() dto: ActualizarTableroDto) {
        const exito = this.svc.actualizarTablero(dto);
        return { exito };
    }
} 