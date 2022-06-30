import {BaseEntity} from "../../common/base/Base.entity";
import {Column, Entity} from "typeorm";


@Entity()
export class Category extends BaseEntity<Category> {
    @Column()
    name: string;
}