import { ApiProperty } from '@nestjs/swagger';

export class TableroDto {
    @ApiProperty({
        description: 'Matriz 20×10 del tablero',
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'number'
            }
        }
    })
    estado: number[][]; // 20 filas × 10 columnas (0 ó 1)
} 