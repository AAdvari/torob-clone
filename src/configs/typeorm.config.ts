import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const TypeOrmConfig: TypeOrmModuleOptions = {
    url: process.env.DATABASE_URL,
    type: 'postgres',
    ssl: {
        rejectUnauthorized: false,
    },
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true, // This for development
    autoLoadEntities: true,
};
