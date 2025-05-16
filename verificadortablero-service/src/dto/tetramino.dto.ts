import { ApiProperty } from '@nestjs/swagger';

export class TetraminoDto {
    @ApiProperty({ description: 'Matriz 4x4 del tetramino', type: 'array', items: { type: 'array', items: { type: 'number' } } })
    matriz: number[][];

    @ApiProperty({ description: 'Tipo de tetramino (I, O, T, S, Z, J, L)', example: 'I' })
    tipo: string;
} 