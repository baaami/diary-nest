import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    getAll(sellerId: number): Promise<import("./entities/review.entity").Reviews[]>;
    create(createReviewDto: CreateReviewDto, sellerId: number): Promise<import("./entities/review.entity").Reviews>;
}
