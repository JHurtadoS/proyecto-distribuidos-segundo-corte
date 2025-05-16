import { ApiProperty } from '@nestjs/swagger';

export class DireccionDto {
    @ApiProperty({ enum: ['izquierda', 'derecha', 'abajo'] })
    direccion: 'izquierda' | 'derecha' | 'abajo';
} 