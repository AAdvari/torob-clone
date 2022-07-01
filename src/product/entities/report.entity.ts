import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {BaseEntity} from "../../common/base/Base.entity";
import {ReportType} from "../enums/report-type.enum";
import {User} from "../../user/entities/user.entity";
import {SellingItem} from "./selling-item.entity";


@Entity()
export class Report extends BaseEntity<Report> {

    @Column({
        enum: ReportType,
        nullable: false
    })
    reportType: ReportType;

    @Column({ nullable: true})
    description: string;

    @ManyToOne( () => SellingItem, (sellingItem) => sellingItem.reports)
    sellingItem: SellingItem;


    @ManyToOne( () => User, (user) => user.reports)
    reporter: User;

}
