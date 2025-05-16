import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DeslizadorModule } from './deslizador.module';

async function bootstrap() {
  const app = await NestFactory.create(DeslizadorModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Deslizador Service API')
    .setDescription('API para el microservicio Deslizador del juego Tetris')
    .setVersion('1.0')
    .addTag('Deslizador')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Deslizador service running on port ${process.env.PORT || 3000}`);
}
bootstrap();
