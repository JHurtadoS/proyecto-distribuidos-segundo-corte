import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificadorTableroModule } from './verificadortablero.module';

@Module({
  imports: [VerificadorTableroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
