import {BaseEntity} from "../../../common/base/Base.entity";
import {Column, Entity, OneToOne} from "typeorm";
import {Product} from "../product.entity";
import {LaptopBrand} from "../../enums/laptop-brand.enum";


@Entity()
export class LaptopProduct extends BaseEntity<LaptopProduct> {

    @OneToOne(() => Product, (product) => product.laptopProduct,
        {
            nullable: true,
            cascade: [ 'update']
        })
    product: Product;


    @Column()
    title: string;

    @Column({
        enum: LaptopBrand
    })
    brand: LaptopBrand;

    @Column({nullable: true})
    cpu: string;

    @Column({nullable: true})
    ram: string;

    @Column({nullable: true})
    memory: string;

    @Column({nullable: true})
    screen: string;


}