import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
console.log("MIDDLEWARE SECRET:", process.env.JWT_SECRET);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: 401,
      message: "Token no enviado",
      data: null
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as any;

    // guardamos el usuario en request (para auditoría)
    (req as any).user = {
    username: decoded.sub
    };

    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Token inválido",
      data: null
    });
  }
};