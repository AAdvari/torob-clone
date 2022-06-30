import {BaseEntity} from "../../common/base/Base.entity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {SellingItem} from "./selling-item.entity";
import {User} from "../../user/entities/user.entity";


@Entity()
export class Store extends BaseEntity<Store> {


    @Column()
    name: string;

    @OneToMany(() => SellingItem, (sellingItem) => sellingItem.store, {
        cascade: ['update']
    })
    sellingItems: SellingItem[];

    @ManyToOne( () => User, (user) => user.stores, {
        nullable: false
    })
    owner: User;


}