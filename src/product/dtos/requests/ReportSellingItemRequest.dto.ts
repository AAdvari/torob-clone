import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ReportType} from "../../enums/report-type.enum";

export class ReportSellingItemRequestDto {

    @IsOptional()
    @IsString()
    description? :string;

    @IsNotEmpty()
    @IsEnum(ReportType)
    reportType: ReportType;

    @IsNotEmpty()
    @IsNumber()
    sellingItemId: number;
}