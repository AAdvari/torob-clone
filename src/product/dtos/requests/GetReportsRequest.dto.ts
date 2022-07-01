import {IsArray, IsNotEmpty, IsNumber, IsPositive} from "class-validator";

export class GetReportsRequestDto {
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, {each: true})
    @IsPositive({each: true})
    storeIds: number[];

}