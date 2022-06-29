import {Body, Post} from '@nestjs/common';
import {CreateUserRequestDto} from "./dtos/requests/CreateUserRequest.dto";
import {CreateUserResponseDto} from "./dtos/responses/CreateUserResponse.dto";
import {UserService} from "./user.service";
import {BusinessController} from "../common/decorators/bussines-controller.decorator";

@BusinessController('user', 'user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post('/signup')
    async createUser(@Body() dto: CreateUserRequestDto) {
        const user = await this.userService.createUser(dto);
        return new CreateUserResponseDto(user);
    }

}
