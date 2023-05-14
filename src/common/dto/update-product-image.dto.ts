import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CreateProductImageDto } from "./create-product-image.dto";

export class UpdateImageDto extends PartialType(CreateProductImageDto) {}
