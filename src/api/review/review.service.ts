import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from 'src/common/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Reviews) private ReviewRepository: Repository<Reviews>
    ) {}

    async insertFakerData(fakerdata: Reviews): Promise<Reviews> {
        const res = await this.ReviewRepository.save(fakerdata)
        return res
    }
}
