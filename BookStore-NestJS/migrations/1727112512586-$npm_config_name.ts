import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

// Brand Table

export class $npmConfigName1727112512586 implements MigrationInterface {
    private readonly logger = new Logger($npmConfigName1727112512586.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
      INSERT INTO brand (brandName, isAvailable) 
      VALUES    ('Minh Lâm', 1), ('Huy Hoàng', 1), 
                ('Trí Việt', 1), ('Văn Lang', 1);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
    }

}
