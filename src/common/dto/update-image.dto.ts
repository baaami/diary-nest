import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateImageDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {}
