import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeslizadorController } from './deslizador.controller';
import { DeslizadorService } from './deslizador.service';

@Module({
    imports: [HttpModule],
    controllers: [DeslizadorController],
    providers: [DeslizadorService],
})
export class DeslizadorModule { } 