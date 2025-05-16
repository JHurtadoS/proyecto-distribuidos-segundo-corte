import { ApiProperty } from '@nestjs/swagger';
import { TetraminoDto } from './tetramino.dto';

export class ActualizarTableroDto {
    @ApiProperty({ type: TetraminoDto })
    tetramino: TetraminoDto;

    @ApiProperty({ example: 3 })
    x: number;

    @ApiProperty({ example: 0 })
    y: number;
} 