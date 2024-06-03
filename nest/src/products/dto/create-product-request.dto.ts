// product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import {Exclude, Expose} from "class-transformer";
import {Unique} from "typeorm";

export class CreateProductRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    type: string;
}

@Exclude()
export class CreateProductResDto{

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    price: number;

    @Expose()
    @ApiProperty()
    @IsString()
    description: string;
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    type: string;
}
