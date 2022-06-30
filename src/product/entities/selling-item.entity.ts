import {Column, Entity, ManyToOne, OneToOne} from "typeorm";
import {BaseEntity} from "../../common/base/Base.entity";
import {Product} from "./product.entity";
import {Store} from "./store.entity";


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


}