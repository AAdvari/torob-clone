import {Report} from "../../entities/report.entity";
import {ReportType} from "../../enums/report-type.enum";
import {UserResponseDto} from "../../../user/dtos/responses/UserResponse.dto";
import {SellingItemResponseDto} from "./SellingItemResponse.dto";

export class ReportResponseDto {

    reportType: ReportType;
    description?: string;
    reporter?: UserResponseDto;
    sellingItem?: SellingItemResponseDto;
    constructor(report: Report) {
        this.reportType = report.reportType;
        this.description = report.description;
        this.reporter = report.reporter? new UserResponseDto(report.reporter) : undefined;
        this.sellingItem = report.sellingItem? new SellingItemResponseDto(report.sellingItem) : undefined;
    }
}