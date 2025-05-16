import { ApiProperty } from '@nestjs/swagger';
import { TetraminoDto } from './tetramino.dto';

export class GenerarTetraminoResponseDto {
    @ApiProperty()
    exito: boolean;

    @ApiProperty({ type: TetraminoDto, required: false })
    tetramino?: TetraminoDto; // presente solo en rama orquestada

    @ApiProperty({ required: false })
    motivo?: string; // 'GAME_OVER' ó descripción de falla
}
