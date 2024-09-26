import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

// Category Table

export class $npmConfigName1727112530849 implements MigrationInterface {
    private readonly logger = new Logger($npmConfigName1727112530849.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
      INSERT INTO category (categoryName, isAvailable) 
      VALUES    ('Sách mới 2024', 1), ('Thiếu nhi', 1), ('Từ điển', 1), 
                ('Hội họa', 1), ('Lịch sử', 1);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
    }

}
