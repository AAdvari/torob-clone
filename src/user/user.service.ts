import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BaseService} from "../common/base/Base.service";

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(userRepository);
    }

    async createUser(user){
        const newUser = new User();
        newUser.password = user.password;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.userType = user.userType;

        const existed = await this.userRepository.findOneBy({username: user.username});
        if (existed)
            throw new BadRequestException('user already exists!')
        return this.userRepository.save(newUser);
    }

    async findUserById(id: number) {
        return await this.userRepository.createQueryBuilder('user')
            .andWhere('user.id = :userId', {userId: id})
            .leftJoinAndSelect('user.stores', 'store')
            .leftJoinAndSelect('user.favoriteProducts', 'favoriteProduct')
            .getOne();
    }

    async findUserByUsername(username: string){
        return this.userRepository.findOneBy({username})
    }
}
