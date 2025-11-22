import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DuplicateValueExceptionFilter } from './duplicate-value-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { exposedHeaders: ['Content-Length', 'Authorization']}
  });

  app.useGlobalFilters(new DuplicateValueExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes( new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Markis")
    .setDescription("Markis v1 Api docs")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1",app, document)

  await app.listen(process.env.PORT || 8000, ()=> console.log("server connected at: " + process.env.PORT),
  );
}
bootstrap();
