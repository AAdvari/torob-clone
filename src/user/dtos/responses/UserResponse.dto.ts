import {User} from "../../entities/user.entity";
import {UserType} from "../../enums/user-type.enum";
import {StoreResponseDto} from "../../../product/dtos/responses/StoreResponse.dto";
import {ProductResponseDto} from "../../../product/dtos/responses/ProductResponse.dto";

export class UserResponseDto {
    username: string;
    id: number;
    email: string;
    userType: UserType;
    phoneNumber?: string;
    name?: string;
    stores?: StoreResponseDto[];
    favoriteProducts: ProductResponseDto[];
    constructor(user: User) {
        this.username = user.username;
        this.id = user.id;
        this.email = user.email;
        this.userType = user.userType;
        this.phoneNumber = user.phoneNumber? user.phoneNumber : undefined;
        this.name = user.name? user.name : undefined;
        this.stores = user.stores?.map(store => new StoreResponseDto(store));
        this.favoriteProducts = user.favoriteProducts?.map(prod => new ProductResponseDto(prod));
    }
}