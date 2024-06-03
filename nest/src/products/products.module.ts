// product.module.ts
import { Module } from '@nestjs/common';
import { ProductController} from "./products.controller";
import { ProductService} from "./products.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
