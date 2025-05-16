import { ApiProperty } from '@nestjs/swagger';

// Import from the Generador service
// In a production environment, this would be shared through a common library
interface TetraminoDto {
    tipo: string;
    matriz: number[][];
}

export class RotacionResponseDto {
    @ApiProperty({ description: 'Rotated tetramino' })
    tetramino: TetraminoDto;

    @ApiProperty({ description: 'Operation success flag, false only if board rejected the rotation (coordinated mode)' })
    exito: boolean;

    @ApiProperty({ required: false, description: 'Error description if operation failed' })
    motivo?: string; // 'COLISION' or 'FUERA_DE_RANGO'
} 