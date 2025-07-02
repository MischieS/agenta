import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as process from 'process';

// Set global memory management for Node.js
if (process.env.NODE_ENV === 'production') {
  // Set memory management options for production
  global.gc && global.gc(); // Enable garbage collection if available
}

async function bootstrap() {
  // Set resource-efficient options for NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Reduce logging in production
    bodyParser: true,
    cors: true, // Enable CORS at app level
    bufferLogs: true, // Buffer logs for more efficient I/O
  });
  
  // Create a logger instance
  const logger = new Logger('Bootstrap');
  logger.log('Starting application in ' + (process.env.NODE_ENV || 'development') + ' mode');
  
  // Configure CORS in a memory-efficient way
  const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
  // Only add AWS domains in production to save regex processing
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: [...allowedOrigins, /\.amazonaws\.com$/, /\.compute\.amazonaws\.com$/],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    });
  } else {
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
  }
  
  // Add optimized validation pipeline
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // More efficient type conversion
    },
    disableErrorMessages: process.env.NODE_ENV === 'production', // Hide error details in production
  }));
  
  // Configure API prefix
  app.setGlobalPrefix('api');
  
  // Start the server - bind to all interfaces for cloud compatibility
  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';
  
  // Handle memory usage monitoring
  if (process.env.NODE_ENV === 'production') {
    // Log memory usage periodically in production
    const memoryUsageInterval = setInterval(() => {
      const memoryUsage = process.memoryUsage();
      if (memoryUsage.heapUsed > 512 * 1024 * 1024) { // If using more than 512MB
        logger.warn(`High memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
        global.gc && global.gc(); // Force garbage collection if available
      }
    }, 60000); // Check every minute
    
    // Clean up interval on application shutdown
    app.enableShutdownHooks();
    process.on('SIGINT', () => {
      clearInterval(memoryUsageInterval);
      app.close();
      process.exit(0);
    });
  }
  
  // Start listening
  await app.listen(port, host);
  logger.log(`Application is running on: http://${host}:${port}`);
  logger.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (error) => {
  const logger = new Logger('UncaughtException');
  logger.error(`Uncaught Exception: ${error.message}`, error.stack);
});

// Start the application
bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
