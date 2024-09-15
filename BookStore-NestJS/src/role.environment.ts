import { config } from "dotenv";

config();
export const ADMIN = process.env.ROLE_ADMIN;
export const USER = process.env.ROLE_USER;
export const SUPERADMIN = process.env.ROLE_SUPERADMIN;