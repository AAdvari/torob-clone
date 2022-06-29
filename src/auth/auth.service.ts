import {Injectable, UnauthorizedException} from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import {UserService} from "../user/user.service";
import {LoginRequestDto} from "./dtos/LoginRequest.dto";


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) {
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findUserByUsername(username)
        if (user && user.password === password){
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(dto: LoginRequestDto){
        const user = await this.validateUser(dto.username, dto.password);
        if(user){
            const payload = { userId: user.id };
            return {
                token: this.jwtService.sign(payload)
            }
        }
        else
            throw new UnauthorizedException('username or password is not valid!');
    }

}