import {Column, Entity, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {BaseEntity} from "../../common/base/Base.entity";
import {UserType} from "../enums/user-type.enum";
import {Store} from "../../product/entities/store.entity";
import {Product} from "../../product/entities/product.entity";


@Entity()
export class User extends BaseEntity<User> {
    @Column()
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    name: string;

    @Column()
    email: string;

    @Column({
        nullable: true
    })
    phoneNumber: string;

    @Column({
        enum: UserType,
        nullable: false
    })
    userType: UserType;


    @ManyToMany( () => Product, product => product.likedUsers)
    @JoinTable()
    favoriteProducts: Product[];


    @OneToMany( () => Store, (store) => store.owner)
    stores: Store[];
}
