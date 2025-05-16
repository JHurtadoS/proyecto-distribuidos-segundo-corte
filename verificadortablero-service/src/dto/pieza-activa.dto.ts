import { ApiProperty } from '@nestjs/swagger';
import { TetraminoDto } from './tetramino.dto';

export class PiezaActivaDto {
    @ApiProperty({ type: TetraminoDto })
    tetramino: TetraminoDto;

    @ApiProperty()
    x: number;

    @ApiProperty()
    y: number;
} 