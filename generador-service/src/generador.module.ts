import { Module } from '@nestjs/common';
import { GeneradorController } from './generador.controller';
import { GeneradorService } from './generador.service';

@Module({
    imports: [],
    controllers: [GeneradorController],
    providers: [GeneradorService],
    exports: [GeneradorService],
})
export class GeneradorModule { } 