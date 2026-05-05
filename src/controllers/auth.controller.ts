import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const USER = process.env.AUTH_USER;
const PASSWORD = process.env.AUTH_PASSWORD;
const SECRET = process.env.JWT_SECRET!;
const EXPIRES = process.env.JWT_EXPIRES || "1h";

export const login = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      code: 401,
      message: "Credenciales no enviadas",
      data: null
    });
  }
console.log("LOGIN SECRET:", process.env.JWT_SECRET);
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");

  const [username, password] = credentials.split(":");

  if (username !== USER || password !== PASSWORD) {
    return res.status(401).json({
      code: 401,
      message: "Credenciales inválidas",
      data: null
    });
  }

  const token = jwt.sign(
    { sub: username },
    SECRET,
    { expiresIn: EXPIRES } as SignOptions
  );

  return res.status(200).json({
    code: 200,
    message: "Autenticación exitosa",
    data: {
      token,
      expiresIn: 3600
    }
  });
};