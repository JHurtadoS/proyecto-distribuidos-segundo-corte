import { ApiProperty } from '@nestjs/swagger';

// Import from the Generador service
// In a production environment, this would be shared through a common library
// For simplicity, we're referencing it directly
interface TetraminoDto {
    tipo: string;
    matriz: number[][];
}

export class RotacionRequestDto {
    @ApiProperty({ description: 'Tetramino to rotate', required: false })
    tetramino?: TetraminoDto;

    @ApiProperty({ enum: ['izquierda', 'derecha'], description: 'Rotation direction', required: false })
    direccion?: 'izquierda' | 'derecha';

    @ApiProperty({ required: false, description: 'Update board after rotation (only in coordinated mode)' })
    actualizarTablero?: boolean;
} 