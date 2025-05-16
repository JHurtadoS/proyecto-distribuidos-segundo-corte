import { Module } from '@nestjs/common';
import { GiradorController } from './girador.controller';
import { GiradorService } from './girador.service';

@Module({
    imports: [],
    controllers: [GiradorController],
    providers: [GiradorService],
    exports: [GiradorService],
})
export class GiradorModule { } 