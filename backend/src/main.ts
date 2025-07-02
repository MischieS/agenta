import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow Next.js frontend to communicate with our backend
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', /\.amazonaws\.com$/, /\.compute\.amazonaws\.com$/],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
  });
  
  // Add global validation pipeline
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Configure API prefix
  app.setGlobalPrefix('api');
  
  // Start the server - bind to all interfaces for cloud compatibility
  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';
  
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}
bootstrap();
