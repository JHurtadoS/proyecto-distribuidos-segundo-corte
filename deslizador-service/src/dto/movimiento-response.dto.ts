import { ApiProperty } from '@nestjs/swagger';

export class MovimientoResponseDto {
    @ApiProperty() exito: boolean;
    @ApiProperty({ required: false }) motivo?: string; // p.ej. 'COLISION' | 'FUERA_DE_RANGO' | 'FIJADA'
} 