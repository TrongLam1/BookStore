import { Role } from '@/entities/role/entities/role.entity';
import { Comment } from 'src/entities/comments/entities/comment.entity';
import { Order } from 'src/entities/orders/entities/order.entity';
import { ShoppingCart } from 'src/entities/shopping-cart/entities/shopping-cart.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    code: string;

    @Column({ nullable: true })
    codeExpired: Date;

    @Column('longtext', { nullable: true })
    refreshToken: string;

    @OneToOne(() => ShoppingCart)
    @JoinColumn()
    shoppingCart: ShoppingCart;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles: Role[];
}
