import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

const configService = new ConfigService();

export default new DataSource({
    type: "mysql",
    host: configService.getOrThrow('DB_HOST'),
    port: configService.getOrThrow('DB_PORT'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_DATABASE'),
    migrations: ['migrations/**'],
    entities: ['dist/migrations/*.js']
});