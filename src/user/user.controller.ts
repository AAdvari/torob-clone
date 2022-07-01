import {Body, Post} from '@nestjs/common';
import {CreateUserRequestDto} from "./dtos/requests/CreateUserRequest.dto";
import {UserResponseDto} from "./dtos/responses/UserResponse.dto";
import {UserService} from "./user.service";
import {BusinessController} from "../common/decorators/bussines-controller.decorator";
import {ApiBody} from "@nestjs/swagger";
import {UpdateUserRequestDto} from "./dtos/requests/UpdateUserRequest.dto";
import {Auth} from "../common/decorators/auth-guard.decorator";
import {GetUserId} from "../common/decorators/get-user.id";

@BusinessController('user', 'user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post('/signup')
    async createUser(@Body() dto: CreateUserRequestDto) {
        const user = await this.userService.createUser(dto);
        return new UserResponseDto(user);
    }

    @Auth()
    @Post('update-user')
    async updateUser(@Body() dto: UpdateUserRequestDto, @GetUserId() userId: number){
        const user = await this.userService.updateUser(dto, userId);
        return new UserResponseDto(user);
    }

}
