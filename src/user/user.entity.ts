import {Column, Entity} from "typeorm";
import {BaseEntity} from "../common/base/Base.entity";


@Entity()
export class User extends BaseEntity<User> {
    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;
}
