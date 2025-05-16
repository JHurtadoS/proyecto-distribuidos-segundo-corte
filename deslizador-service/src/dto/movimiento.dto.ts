import { ApiProperty } from '@nestjs/swagger';

export class MovimientoDto {
    @ApiProperty({ enum: ['izquierda', 'derecha', 'abajo'] })
    direccion: 'izquierda' | 'derecha' | 'abajo';
} 