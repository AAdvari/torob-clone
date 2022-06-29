import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {jwt_private_key} from "../common/constants/constants";
import {JwtStrategy} from "./jwt.strategy";
import {UserModule} from "../user/user.module";
import {AuthController} from "./auth.controller";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwt_private_key.secret,
    }),
      UserModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}