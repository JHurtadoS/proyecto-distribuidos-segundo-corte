import { ApiProperty } from '@nestjs/swagger';
import { TetraminoTipo } from '../models/tetramino-tipo.enum';

export class TetraminoDto {
    @ApiProperty({ enum: TetraminoTipo })
    tipo: TetraminoTipo;

    @ApiProperty({ example: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] })
    matriz: number[][];   // 4×4, validado en service
} 