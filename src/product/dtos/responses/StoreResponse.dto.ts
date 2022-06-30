import {Store} from "../../entities/store.entity";
import {User} from "../../../user/entities/user.entity";
import {SellingItem} from "../../entities/selling-item.entity";

export class StoreResponseDto {
    name: string;
    id: number
    owner?: User;
    sellingItems?: SellingItem[];
    constructor(store: Store) {
        this.name = store.name;
        this.id = store.id;


    }
}