import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

//  Type Table 

export class $npmConfigName1727112474802 implements MigrationInterface {
    private readonly logger = new Logger($npmConfigName1727112474802.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
      INSERT INTO type (typeName, isAvailable) 
      VALUES    ('Văn Học', 1), ('Bài Học Kinh Doanh', 1), ('Từ Điển Anh Việt', 1), 
                ('Truyện Tranh Thiếu Nhi', 1), ('Khác', 1), ('Sách Tiếng Việt', 1);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
    }

}
