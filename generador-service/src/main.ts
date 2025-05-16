import { NestFactory } from '@nestjs/core';
import { GeneradorModule } from './generador.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GeneradorModule);

  // Configurar Swagger solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Generador Service')
      .setVersion('1.0')
      .addTag('Generador')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Obtener puerto de las variables de entorno o usar el default 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Generador microservice running on port ${port}`);
}
bootstrap();
