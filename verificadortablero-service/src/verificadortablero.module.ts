import { Module } from '@nestjs/common';
import { VerificadorTableroController } from './verificadortablero.controller';
import { VerificadorTableroService } from './verificadortablero.service';
import { TableroRepository } from './repository/tablero.repository';

@Module({
    controllers: [VerificadorTableroController],
    providers: [VerificadorTableroService, TableroRepository],
})
export class VerificadorTableroModule { } 