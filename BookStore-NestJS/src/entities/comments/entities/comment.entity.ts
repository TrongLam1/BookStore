import { Book } from "src/entities/books/entities/book.entity";
import { User } from "src/entities/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.comments)
    user: User;

    @ManyToOne(() => Book, book => book.comments)
    book: Book;
}
