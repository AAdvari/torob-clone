import {User} from "../../entities/user.entity";
import {UserType} from "../../enums/user-type.enum";
import {StoreResponseDto} from "../../../product/dtos/responses/StoreResponse.dto";
import {ProductResponseDto} from "../../../product/dtos/responses/ProductResponse.dto";

export class UserResponseDto {
    username: string;
    email: string;
    userType: UserType;
    stores?: StoreResponseDto[];
    favoriteProducts: ProductResponseDto[];
    constructor(user: User) {
        this.username = user.username;
        this.email = user.email;
        this.userType = user.userType;
        this.stores = user.stores?.map(store => new StoreResponseDto(store));
        this.favoriteProducts = user.favoriteProducts?.map(prod => new ProductResponseDto(prod));
    }
}