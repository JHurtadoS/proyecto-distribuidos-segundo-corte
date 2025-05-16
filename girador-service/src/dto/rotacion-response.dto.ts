import { ApiProperty } from '@nestjs/swagger';

// Import from the Generador service
// In a production environment, this would be shared through a common library
interface TetraminoDto {
    tipo: string;
    matriz: number[][];
}

// TableroDto would be shared in a common library
interface TableroDto {
    estado: number[][];
}

export class RotacionResponseDto {
    @ApiProperty({ description: 'Rotated tetramino', required: false, nullable: true })
    tetramino?: TetraminoDto | null;

    @ApiProperty({ description: 'Operation success flag, false only if board rejected the rotation (coordinated mode)' })
    exito: boolean;

    @ApiProperty({ required: false, description: 'Error description if operation failed' })
    motivo?: string; // 'COLISION' or 'FUERA_DE_RANGO'

    @ApiProperty({ required: false, description: 'Current board state after rotation' })
    tablero?: TableroDto;

    @ApiProperty({ required: false, description: 'X coordinate of the tetramino on the board' })
    x?: number;

    @ApiProperty({ required: false, description: 'Y coordinate of the tetramino on the board' })
    y?: number;

    @ApiProperty({ required: false, description: 'Type of tetramino' })
    tipoTetramino?: string;

    @ApiProperty({ required: false, description: 'Coordinates of the tetramino blocks' })
    coordenadasBloques?: { x: number, y: number }[];
} 