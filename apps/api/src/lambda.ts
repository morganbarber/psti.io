import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure } from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

let cachedServer: any;

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

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return configure({ app: expressApp });
}

export const handler = async (event: any, context: any) => {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    return cachedServer(event, context);
};
