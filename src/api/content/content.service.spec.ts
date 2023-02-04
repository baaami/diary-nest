import { Test, TestingModule } from "@nestjs/testing";
import { Users } from '../user/entities/user.entity';
import { Contents } from '../content/entities/content.entity';
import { Images } from 'src/common/entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from "./content.service";
import * as ormconfig from '../../../ormconfig'

describe('ContentService', () => {
    let service: ContentService;
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forFeature([Users, Contents, Images]),
          TypeOrmModule.forRoot(ormconfig),
        ],
        providers: [ContentService],
      }).compile();
      service = module.get<ContentService>(ContentService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('get Content', () => {
        it('should return a content', async () => {
            const result = await service.findOne(6)
            expect(result).toBeInstanceOf(Contents)
        })
    })

    describe('get Content List', () => {
        it('should return a contents', async () => {
            const result = await service.findList()
            expect(result).toBeInstanceOf(Array)
        })
    })
});