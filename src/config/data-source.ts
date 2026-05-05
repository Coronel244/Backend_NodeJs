import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "oracle",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  serviceName: process.env.DB_SERVICE,

  synchronize: false, 
  logging: true,
  entities: [__dirname + "/../entities/*.ts"],
});