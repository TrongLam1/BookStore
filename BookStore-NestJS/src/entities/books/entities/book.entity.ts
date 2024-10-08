import { Min } from "class-validator";
import { Brand } from "src/entities/brand/entities/brand.entity";
import { Category } from "src/entities/category/entities/category.entity";
import { Comment } from "src/entities/comments/entities/comment.entity";
import { Type } from "src/entities/type/entities/type.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('float', { precision: 10, scale: 2 })
    @Min(0, { message: "Min value is 0" })
    price: number;

    @Column('float', { precision: 10, scale: 2 })
    @Min(0, { message: "Min value is 0" })
    currentPrice: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Type, type => type.books)
    type: Type;

    @ManyToOne(() => Brand, brand => brand.books)
    brand: Brand;

    @ManyToOne(() => Category, category => category.books)
    category: Category;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: 0 })
    @Min(0, { message: "Min value is 0" })
    sale: number;

    @Column({ default: 0 })
    @Min(0, { message: "Min value is 0" })
    inventory: number;

    @Column({ default: true })
    isAvailable: boolean;

    @Column({ nullable: true })
    imageId: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column('float', { default: 0 })
    rating: number;

    @Column({ default: 0 })
    sold: number;

    @OneToMany(() => Comment, comment => comment.book)
    comments: Comment[];
}
