import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GiradorService } from './girador.service';
import { RotacionRequestDto } from './dto/rotacion-request.dto';
import { RotacionResponseDto } from './dto/rotacion-response.dto';

@ApiTags('Girador')
@Controller('rotar')
export class GiradorController {
    constructor(private readonly svc: GiradorService) { }

    @Post()
    @ApiOperation({ summary: 'Rotar un tetramino 90°' })
    @ApiBody({ type: RotacionRequestDto })
    @ApiResponse({ status: 200, type: RotacionResponseDto })
    rotar(@Body() dto: RotacionRequestDto): Promise<RotacionResponseDto> {
        return this.svc.rotar(dto);
    }
} 