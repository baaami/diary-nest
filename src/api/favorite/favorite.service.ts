import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from 'src/common/entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorites) private FavoriteRepository: Repository<Favorites>
    ) {}

    async insertFakerData(fakerdata: Favorites): Promise<Favorites> {
        const res = await this.FavoriteRepository.save(fakerdata)
        return res
    }
}
