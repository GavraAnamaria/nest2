// product.controller.ts
import {Controller, Post, Get, Body, Put, Param, ParseUUIDPipe, Delete} from '@nestjs/common';
import { ProductService} from "./products.service";
import { CreateProductRequestDto} from "./dto/create-product-request.dto";
import {ApiTags} from "@nestjs/swagger";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {Product} from "./entities/product.entity";

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    createProduct(@Body() createProductDto: CreateProductRequestDto) {
        return this.productService.createProduct(createProductDto);
    }

    @Get()
    getAllProducts() {
        return this.productService.getAllProducts();
    }
    @Put('/:id')
    updateProduct(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() project: UpdateProductDto,
    ) {
        return this.productService.updateProduct(id, project);
    }
    @Delete('/:id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.delete(id);
    }
}
