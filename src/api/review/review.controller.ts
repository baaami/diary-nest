import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "src/common/guard/auth.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get("/list/:id")
  getAll(@Param("id", ParseIntPipe) sellerId: number) {
    return this.reviewService.getlist(sellerId);
  }

  @UseGuards(AuthGuard)
  @Post("/create/:id")
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Param("id", ParseIntPipe) sellerId: number
  ) {
    return this.reviewService.create(createReviewDto, sellerId);
  }
}
