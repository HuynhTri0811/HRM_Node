import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HRM API')
    .setDescription('API for Human Resource Management System')
    .setVersion('1.0')
    .addTag('nhan-su', 'Personnel management endpoints')
    .addTag('department', 'Department management endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3456);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3456}`);
  console.log(`Swagger documentation available at: http://localhost:${process.env.PORT ?? 3456}/api`);
}
bootstrap();
