import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableSwagger } from './plugins/swagger';
import './plugins/dotenv';
const {SWAGGER_ENABLE} = process.env;

import './plugins/dotenv'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (SWAGGER_ENABLE === 'true') {
    console.log('Swagger enabled!')
    enableSwagger(app);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
