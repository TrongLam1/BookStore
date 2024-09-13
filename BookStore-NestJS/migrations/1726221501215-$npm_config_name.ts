import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1726221501215 implements MigrationInterface {
    private readonly logger = new Logger($npmConfigName1726221501215.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
      INSERT INTO role (name) VALUES ('ADMIN'), ('USER'), ('SUPERADMIN');
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
    }

}
