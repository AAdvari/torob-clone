import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {AppController} from "./app.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfig} from "./configs/typeorm.config";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'swagger'),
            serveRoot: '/swagger',
        }),
        TypeOrmModule.forRoot(TypeOrmConfig),
        UserModule,
        AuthModule,
        ProductModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
