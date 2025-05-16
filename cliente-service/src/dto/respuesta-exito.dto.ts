import { ApiProperty } from '@nestjs/swagger';

export class RespuestaExitoDto {
    @ApiProperty() exito: boolean;
    @ApiProperty({ required: false }) motivo?: string;
} 