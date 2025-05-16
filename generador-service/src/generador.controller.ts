import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GeneradorService } from './generador.service';
import { GenerarTetraminoResponseDto } from './dto/generar-tetramino-response.dto';
import { TetraminoDto } from './dto/tetramino.dto';

@ApiTags('Generador')
@Controller('tetramino')
export class GeneradorController {
    constructor(private readonly svc: GeneradorService) { }

    @Post()
    @ApiOperation({ summary: 'Generar tetramino aleatorio' })
    @ApiResponse({ status: 201, type: GenerarTetraminoResponseDto })
    async generar(): Promise<GenerarTetraminoResponseDto> {
        return this.svc.generarTetramino();
    }

    @Get()
    @ApiOperation({ summary: 'Obtener tetramino aleatorio' })
    @ApiResponse({ status: 200, type: TetraminoDto })
    getTetramino(): TetraminoDto {
        return this.svc.getTetramino();
    }
} 