import { Test, TestingModule } from "@nestjs/testing";
import { Users } from '../user/entities/user.entity';
import { Products } from '../content/entities/content.entity';
import { Images } from 'src/common/entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from "./content.service";
import * as ormconfig from '../../../ormconfig'

describe('ProductService', () => {
    let service: ProductService;
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forFeature([Users, Products, Images]),
          TypeOrmModule.forRoot(ormconfig),
        ],
        providers: [ProductService],
      }).compile();
      service = module.get<ProductService>(ProductService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('get Content', () => {
        it('should return a content', async () => {
            const result = await service.findOne(6)
            expect(result).toBeInstanceOf(Products)
        })
    })

    describe('get Content List', () => {
        it('should return a products', async () => {
            const result = await service.findList()
            expect(result).toBeInstanceOf(Array)
        })
    })
});