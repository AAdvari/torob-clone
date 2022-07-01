import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from "../entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BaseService} from "../../common/base/Base.service";
import {UpdateUserRequestDto} from "../dtos/requests/UpdateUserRequest.dto";
import {CreateUserRequestDto} from "../dtos/requests/CreateUserRequest.dto";

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(userRepository);
    }

    async createUser(user: CreateUserRequestDto){
        const newUser = new User();
        newUser.password = user.password;
        newUser.username = user.username;
        newUser.email = user.email;

        if (user.name)
            newUser.name = user.name;
        if (user.phoneNumber)
            newUser.phoneNumber = user.phoneNumber;

        newUser.userType = user.userType;

        const existed = await this.userRepository.findOneBy({username: user.username});
        if (existed)
            throw new BadRequestException('user already exists!')
        return this.userRepository.save(newUser);
    }

    async updateUser(dto: UpdateUserRequestDto, userId: number){
        const user = await this.userRepository.findOneBy({id: userId});

        if (dto.username){
            const existingUser = await this.userRepository.findOneBy({username: dto.username});
            if (existingUser && dto.username !== user.username)
                throw new BadRequestException('given username is not currently available, try another one!');
            user.username = dto.username;
        }
        if (dto.email)
            user.email = dto.email;
        if (dto.phoneNumber)
            user.phoneNumber = dto.phoneNumber;
        return this.userRepository.save(user);
    }

    async findUserById(id: number) {
        return await this.userRepository.createQueryBuilder('user')
            .andWhere('user.id = :userId', {userId: id})
            .leftJoinAndSelect('user.stores', 'store')
            .leftJoinAndSelect('user.favoriteProducts', 'favoriteProduct')
            .getOne();
    }

    async getUserFavoriteProducts(userId: number) {
        return  this.userRepository.createQueryBuilder('user')
            .andWhere('user.id = :userId', {userId})
            .leftJoinAndSelect('user.favoriteProducts', 'favoriteProduct')
            .leftJoinAndSelect('favoriteProduct.sellingItems', 'sellingItem')
            .leftJoinAndSelect('favoriteProduct.laptopProduct', 'laptopProduct')
            .leftJoinAndSelect('favoriteProduct.mobileProduct', 'mobileProduct')
            .leftJoinAndSelect('favoriteProduct.tabletProduct', 'tabletProduct')
            .getOne();

    }

    async findUserByUsername(username: string){
        return this.userRepository.findOneBy({username})
    }
}
