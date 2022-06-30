import {BusinessController} from "../../common/decorators/bussines-controller.decorator";
import {Body, Post} from "@nestjs/common";
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
import {AddLaptopProductToStoreResponse} from "../dtos/responses/LaptopProductResponse.dto";

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
    }

    @Post('add-new-laptop')
    @Auth()
    async addNewLaptopToStore(@Body() dto: AddLaptopProductToStoreRequestDto, @GetUserId() userId: number){
        const device = await this.storeService.addLaptopToStore(dto, userId);
        return new AddLaptopProductToStoreResponse(device);
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


}
