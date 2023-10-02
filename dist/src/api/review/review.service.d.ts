import { Reviews } from "src/api/review/entities/review.entity";
import { Repository } from "typeorm";
import { Users } from "../user/entities/user.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { AuthSharedService } from "../auth/auth.shared.service";
import { ChatGateway } from "src/events/chat/chats.gateway";
export declare class ReviewService {
    private ReviewRepository;
    private UserRepository;
    private readonly authSharedService;
    private readonly chatGateway;
    constructor(ReviewRepository: Repository<Reviews>, UserRepository: Repository<Users>, authSharedService: AuthSharedService, chatGateway: ChatGateway);
    insertFakerData(fakerdata: Reviews): Promise<Reviews>;
    getlist(sellerId: number): Promise<Reviews[]>;
    create(createReviewDto: CreateReviewDto, sellerId: number): Promise<Reviews>;
}
