import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

const bcrypt = require('bcrypt');
const saltRounds = 10;

export class $npmConfigName1726222691214 implements MigrationInterface {
  private readonly logger = new Logger($npmConfigName1726222691214.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Up');

    const adminExists = await queryRunner.query(`
      SELECT * FROM user WHERE email = 'admin@example.com';
    `);

    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash("12345678", saltRounds);
      await queryRunner.query(`
      INSERT INTO user (username, email, password, isActive) VALUES ('admin', 'admin@example.com', '${hashedPassword}', true);`);
      await queryRunner.query(`
      INSERT INTO user_roles_role (userId, roleId) VALUES (1, 1);`);
    } else {
      console.log('Admin user already exists, skipping insertion.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Down');
    // Xóa dữ liệu khi rollback
    await queryRunner.query(`
      DELETE FROM user_roles_role WHERE userId IN (1);
    `);
    await queryRunner.query(`
      DELETE FROM user WHERE email = 'admin@example.com';
    `);
    await queryRunner.query(`
      DELETE FROM role WHERE name IN ('ADMIN', 'USER');
    `);
  }

}
