import {PartialType} from "@nestjs/swagger";
import {CreateProductRequestDto} from "./create-product-request.dto";

export class UpdateProductDto extends PartialType(CreateProductRequestDto){}