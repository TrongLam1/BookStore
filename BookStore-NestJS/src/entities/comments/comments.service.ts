import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  async postComment(req: any, createCommentDto: CreateCommentDto) {
    const { content, rating, bookId } = createCommentDto;

    const user = await this.userRepository.findOneBy({ id: req.user.userId });
    const book = await this.bookRepository.findOneBy({ id: bookId });

    const comments = await this.commentRepository.save({
      content, rating, user, book
    });

    return {
      createdAt: comments.createdAt,
      content: comments.content,
      rating: comments.rating
    }
  }

  async getCommentsByProduct(bookId: number, current: number, pageSize: number) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const [listComments, totalItems] = await this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.bookId = :bookId', { bookId })
      .select([
        'comment.id',
        'comment.createdAt',
        'comment.content',
        'comment.rating',
        'user.username'
      ])
      .orderBy('comment.createdAt', 'DESC')
      .take(pageSize)
      .skip((current - 1) * pageSize)
      .getManyAndCount();

    return { listComments, totalItems };
  }
}
