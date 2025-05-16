import { Controller, Post, Body, SetMetadata, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DeslizadorService } from './deslizador.service';
import { MovimientoDto } from './dto/movimiento.dto';
import { MovimientoResponseDto } from './dto/movimiento-response.dto';

@ApiTags('Deslizador')
@Controller('deslizar')
export class DeslizadorController {
    constructor(private readonly svc: DeslizadorService) { }

    // Endpoint oficial para jugador / cliente en coordinada
    @Post()
    @ApiOperation({ summary: 'Mover pieza activa una casilla' })
    @ApiBody({ type: MovimientoDto })
    @ApiResponse({ status: 200, type: MovimientoResponseDto })
    mover(@Body() dto: MovimientoDto) {
        return this.svc.moverPieza(dto.direccion);
    }

    // Implementación del método del diagrama
    @Post('tetramino')
    @ApiOperation({ summary: 'Deslizar un tetramino en una dirección específica' })
    @ApiBody({
        schema: {
            example: {
                tetramino: { tipo: 'I', matriz: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
                x: 3,
                y: 5,
                direccion: 'abajo'
            }
        }
    })
    @ApiResponse({ status: 200 })
    deslizarTetramino(@Body() body: { tetramino: any, x: number, y: number, direccion: string }) {
        const piezaConPos = {
            tetramino: body.tetramino,
            x: body.x,
            y: body.y
        };
        return this.svc.deslizarTetramino(piezaConPos, body.direccion);
    }

    // Endpoint opcional — sólo para orquestada (pura función)
    @Post('calcular')
    @ApiOperation({ summary: '[Orquestada] Solo calcula nueva posición' })
    @ApiBody({ schema: { example: { x: 3, y: 0, direccion: 'derecha' } } })
    @SetMetadata('mode', 'orquestada')
    calcular(@Body() body: { x: number; y: number; direccion: MovimientoDto['direccion'] }) {
        const coords = this.svc.calcMovimientoPure({ x: body.x, y: body.y }, body.direccion);
        return { ...coords };
    }
} 