import {BusinessController} from "../../common/decorators/bussines-controller.decorator";
import {Body, Get, Post} from "@nestjs/common";
import {CreateStoreRequestDto} from "../dtos/requests/CreateStoreRequest.dto";
import {GetUserId} from "../../common/decorators/get-user.id";
import {Auth} from "../../common/decorators/auth-guard.decorator";
import {AddProductToStoreByIdRequestDto} from "../dtos/requests/AddProductToStoreByIdRequest.dto";
import {StoreResponseDto} from "../dtos/responses/StoreResponse.dto";
import {StoreService} from "../services/store.service";
import {AddMobileTabletProductToStoreRequestDto} from "../dtos/requests/AddMobileTabletProductToStoreRequest.dto";
import {MobileTabletResponseDto} from "../dtos/responses/MobileTabletResponse.dto";
import {AddLaptopProductToStoreRequestDto} from "../dtos/requests/AddLaptopProductToStoreRequest.dto";
import {ProductCategory} from "../enums/product-category.enum";
import {ProductResponseDto} from "../dtos/responses/ProductResponse.dto";
import {LaptopProductResponseDto} from "../dtos/responses/LaptopProductResponse.dto";
import {ReportSellingItemRequestDto} from "../dtos/requests/ReportSellingItemRequest.dto";
import {ReportResponseDto} from "../dtos/responses/ReportResponse.dto";
import {GetReportsRequestDto} from "../dtos/requests/GetReportsRequest.dto";

@BusinessController('store', 'store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {
    }
    @Post('create')
    @Auth()
    async createStore(@Body() dto: CreateStoreRequestDto, @GetUserId() userId: number){
        return new StoreResponseDto(await this.storeService.createStore(dto, userId));
    }

    @Post('add-product-by-id')
    @Auth()
    async addProductByIdToStore(@Body() dto: AddProductToStoreByIdRequestDto, @GetUserId() userId: number){
        const product = await this.storeService.addExistingProductToStore(dto, userId);
        return new ProductResponseDto(product);
    }

    @Post('add-new-laptop')
    @Auth()
    async addNewLaptopToStore(@Body() dto: AddLaptopProductToStoreRequestDto, @GetUserId() userId: number){
        const device = await this.storeService.addLaptopToStore(dto, userId);
        return new LaptopProductResponseDto(device);
    }

    @Post('add-new-tablet')
    @Auth()
    async addNewTabletToStore(@Body() dto: AddMobileTabletProductToStoreRequestDto, @GetUserId() userId: number){
        const device = await this.storeService.addMobileTableToStore(dto, userId, ProductCategory.TABLET);
        return new MobileTabletResponseDto(device);
    }

    @Post('add-new-mobile')
    @Auth()
    async addNewMobileToStore(@Body() dto: AddMobileTabletProductToStoreRequestDto, @GetUserId() userId: number){
        const device = await this.storeService.addMobileTableToStore(dto, userId, ProductCategory.MOBILE);
        return new MobileTabletResponseDto(device);
    }


    @Auth()
    @Get('get-all-stores')
    async getAllStores(@GetUserId() userId: number){
        const stores = await this.storeService.getStoresWithDetails(userId);
        return stores.map(store => new StoreResponseDto(store));
    }



    @Auth()
    @Post('report-selling-item')
    async reportSellingItem(@Body() dto: ReportSellingItemRequestDto, @GetUserId() userId: number){
        const report = await this.storeService.reportSellingItem(dto, userId);
        return new ReportResponseDto(report);
    }

    @Auth()
    @Get('get-all-reports')
    async getAllReports(@GetUserId() sellerId: number) {
        const reports = await this.storeService.getAllReports(sellerId);
        return reports.map(rep => new ReportResponseDto(rep));
    }

    @Auth()
    @Get('get-reports')
    async getReports(@Body() dto: GetReportsRequestDto, @GetUserId() sellerId: number){
        const reports = await this.storeService.getReports(sellerId, dto);
        return reports.map(rep => new ReportResponseDto(rep));
    }

}
