import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
    }

    async createUser(user){
        const newUser = new User();
        newUser.password = user.password;
        newUser.username = user.username;
        newUser.email = user.email;
        const existed = await this.userRepository.findOneBy({username: user.username});
        if (existed)
            throw new BadRequestException('user already exists!')
        return this.userRepository.save(newUser);
    }

    async findUserById(id: number) {
        return await this.userRepository.findOneBy({id});
    }

    async findUserByUsername(username: string){
        return this.userRepository.findOneBy({username})
    }
}
