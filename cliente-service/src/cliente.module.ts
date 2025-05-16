import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [ClienteController],
    providers: [ClienteService],
})
export class ClienteModule { } 