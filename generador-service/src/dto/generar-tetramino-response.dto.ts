import { ApiProperty } from '@nestjs/swagger';
import { TetraminoDto } from './tetramino.dto';

// TableroDto would be shared in a common library
interface TableroDto {
    estado: number[][];
}

export class GenerarTetraminoResponseDto {
    @ApiProperty()
    exito: boolean;

    @ApiProperty({ type: TetraminoDto, required: false })
    tetramino?: TetraminoDto; // Now included in both modes

    @ApiProperty({ required: false })
    motivo?: string; // 'GAME_OVER' ó descripción de falla

    @ApiProperty({ required: false, description: 'Current board state after placing the tetramino' })
    tablero?: TableroDto;
}
