import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { Public } from '@/decorator/decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('post')
  @UseGuards(JwtAuthGuard)
  async postComment(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.postComment(req, createCommentDto);
  }

  @Get()
  @Public()
  async getCommentsByProduct(
    @Query('productId') productId: number,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.commentsService.getCommentsByProduct(productId, current, pageSize);
  }
}
