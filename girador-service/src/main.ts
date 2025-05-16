import { NestFactory } from '@nestjs/core';
import { GiradorModule } from './girador.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GiradorModule);

  // Configure Swagger only in development
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Girador Service')
      .setVersion('1.0')
      .addTag('Girador')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Get port from environment variables or use default 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Girador microservice running on port ${port}`);
}
bootstrap();
