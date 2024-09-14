import { Book } from "src/entities/books/entities/book.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    brandName: string;

    @Column({ default: true })
    isAvailable: boolean;

    @OneToMany(() => Book, book => book.brand)
    books: Book[];
}
