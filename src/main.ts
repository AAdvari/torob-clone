import * as dotenv from 'dotenv';
import {join} from "path";
if(!process.env.NODE_ENV){
  dotenv.config({path: join(__dirname, '..', '.env')});
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableSwagger } from './plugins/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if(process.env.SWAGGER_ENABLE === 'true')
    enableSwagger(app);

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
