import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginRequestDto} from "./dtos/LoginRequest.dto";
import {JwtAuthGuard} from "./jwt-auth-guard";
import {GetUserId} from "../common/decorators/get-user.id";
import {BusinessController} from "../common/decorators/bussines-controller.decorator";

@BusinessController('auth', 'auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('login')
    async login(@Body() dto: LoginRequestDto){
        return this.authService.login(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Get('test')
    getUserInfo(@GetUserId() userId: number ){
        return {userId};
    }
}
