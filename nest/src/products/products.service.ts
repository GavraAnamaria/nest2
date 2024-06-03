// product.service.ts
import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateProductRequestDto} from "./dto/create-product-request.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";
import {Product} from "./entities/product.entity";
import * as string_decoder from "string_decoder";
import {UpdateProductDto} from "./dto/update-product.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) {}

    async createProduct(CreateProductDto : CreateProductRequestDto) {
        const foundProduct = await this.findByName(CreateProductDto.name);
        if (foundProduct) {
            throw new BadRequestException("product already exists")
        }
        const product = {...CreateProductDto};
        return await this.productRepo.save({
            ...product,
        });

    }
    getAllProducts() {
        return this.productRepo.find();
    }
    findOne(id: string) {
        return this.productRepo.findOne({
            where: {
                id,
            },
        });
    }
    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        await this.productRepo.update(id, updateProductDto);
        return this.findOne(id);
    }

    findByName(name:string){
        return this.productRepo.findOne({where: {name}});
    }
    async delete(id: string) {
        return this.productRepo.delete(id);
    }
}


