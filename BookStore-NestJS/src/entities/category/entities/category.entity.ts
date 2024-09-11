import { Book } from "src/entities/books/entities/book.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryName: string;

    @OneToMany(() => Book, book => book.category)
    books: Book[];
}
