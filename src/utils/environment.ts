import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const DB_HOST = process.env.DB_HOST as string; 
export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_PORT = 5432;