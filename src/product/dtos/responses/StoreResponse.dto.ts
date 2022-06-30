import {Store} from "../../entities/store.entity";
import {User} from "../../../user/entities/user.entity";
import {SellingItem} from "../../entities/selling-item.entity";
import {SellingItemResponseDto} from "./SellingItemResponse.dto";
import {UserResponseDto} from "../../../user/dtos/responses/UserResponse.dto";

export class StoreResponseDto {
    name: string;
    id: number
    owner?: UserResponseDto;
    sellingItems?: SellingItemResponseDto[];
    constructor(store: Store) {
        this.name = store.name;
        this.id = store.id;
        this.sellingItems = store.sellingItems?.map(si => new SellingItemResponseDto(si) );
        this.owner = store.owner? new UserResponseDto(store.owner) : undefined;
    }

}