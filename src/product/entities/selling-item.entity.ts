import {Column, Entity, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {BaseEntity} from "../../common/base/Base.entity";
import {Product} from "./product.entity";
import {Store} from "./store.entity";
import {Report} from "./report.entity";


@Entity()
export class SellingItem extends BaseEntity<SellingItem> {

    @Column({ nullable: false})
    price: number;

    @Column( {nullable: false})
    link: string;


    @ManyToOne(() => Product, (product) => product.sellingItems)
    product: Product;


    @ManyToOne( () => Store, (store) => store.sellingItems)
    store: Store;


    @OneToMany( () => Report, (report) => report.sellingItem)
    reports: Report[];

}