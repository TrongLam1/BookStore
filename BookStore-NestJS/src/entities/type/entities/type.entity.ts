import { Book } from "src/entities/books/entities/book.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Type {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    typeName: string;

    @Column()
    isAvailable: boolean;

    @OneToMany(() => Book, book => book.type)
    books: Book[];
}
