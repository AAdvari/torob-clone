import {BaseEntity} from "../../../common/base/Base.entity";
import {Column, Entity, OneToOne} from "typeorm";
import {Product} from "../product.entity";
import {MobileTabletBrand} from "../../enums/mobile-tablet-brand.enum";


@Entity()
export class TabletProduct extends BaseEntity<TabletProduct> {

    @OneToOne(() => Product, (product) => product.tabletProduct,
        {
            nullable: true,
            cascade: ['update']
        })
    product: Product;


    @Column()
    title: string;

    @Column({
        enum: MobileTabletBrand
    })
    brand: MobileTabletBrand;

    @Column({nullable: true})
    cpu: string;

    @Column({nullable: true})
    ram: string;

    @Column({nullable: true})
    memory: string;

    @Column({nullable: true})
    screen: string;

}