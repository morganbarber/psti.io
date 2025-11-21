import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.enableCors({
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('psti.io API')
        .setDescription('Enterprise pastebin API for security professionals')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 API server running on http://localhost:${port}`);
    console.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
