import {BaseEntity} from "../../common/base/Base.entity";
import {Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne} from "typeorm";
import {MobileProduct} from "./products/mobile-product.entity";
import {TabletProduct} from "./products/tablet-product.entity";
import {LaptopProduct} from "./products/laptop-product.entity";
import {ProductCategory} from "../enums/product-category.enum";
import {SellingItem} from "./selling-item.entity";
import {User} from "../../user/entities/user.entity";


@Entity()
export class Product extends BaseEntity<Product> {

    @Column('enum', {
        enum: ProductCategory,
        nullable: false
    })
    productCategory: ProductCategory;

    @OneToOne(() => MobileProduct,
        (mobileProduct) => mobileProduct.product, {
        nullable: true,
        cascade: ['update']
    })
    @JoinColumn()
    mobileProduct: MobileProduct;


    @OneToOne(() => TabletProduct,
        (tabletProduct) => tabletProduct.product, {
            nullable: true,
            cascade: [ 'remove','update']
        })
    @JoinColumn()
    tabletProduct: TabletProduct;


    @OneToOne(() => LaptopProduct,
        (laptopProduct) => laptopProduct.product, {
            nullable: true,
            cascade: ['remove','update']
        })
    @JoinColumn()
    laptopProduct: LaptopProduct;


    @OneToMany( () => SellingItem, (sellingItem) => sellingItem.product, {
        cascade: ['remove','update']
    })
    sellingItems: SellingItem[];


    @ManyToMany( () => User, user => user.favoriteProducts)
    likedUsers: User[]

}