import {User} from "../../user.entity";

export class CreateUserResponseDto {
    username: string;
    email: string;

    constructor(user: User) {
        this.username = user.username;
        this.email = user.email;
    }
}