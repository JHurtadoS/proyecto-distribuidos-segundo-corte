import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClienteModule } from './cliente.module';

async function bootstrap() {
  const app = await NestFactory.create(ClienteModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Cliente API Gateway')
    .setDescription('API para servicio Cliente en el sistema de Tetris')
    .setVersion('1.0')
    .addTag('Cliente')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
