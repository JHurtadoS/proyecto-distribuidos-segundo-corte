import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VerificadorTableroModule } from './verificadortablero.module';

async function bootstrap() {
  const app = await NestFactory.create(VerificadorTableroModule);

  // Configurar Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Verificador Tablero')
      .setVersion('1.0')
      .addTag('VerificadorTablero')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`VerificadorTablero service running on port ${port}`);
}
bootstrap();
