import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const USER = "VERIS";
const PASSWORD = "PRUEBAS123";
const SECRET = "super_secret_key"; // luego pásalo a .env

export const login = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      code: 401,
      message: "Credenciales no enviadas",
      data: null
    });
  }

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
    { expiresIn: "1h" }
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