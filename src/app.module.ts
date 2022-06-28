import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {AppController} from "./app.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfig} from "./configs/typeorm.config";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'swagger'),
            serveRoot: '/swagger',
        }),
        TypeOrmModule.forRoot(TypeOrmConfig),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
