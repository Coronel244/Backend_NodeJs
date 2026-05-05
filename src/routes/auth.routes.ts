import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { actualizarPaciente, crearPaciente, obtenerPaciente } from "../controllers/paciente.controller";

const router = Router();

router.post("/autenticacion/login", login);

router.get("/autenticacion/perfil", authMiddleware, (req, res) => {
  res.status(200).json({
    code: 200,
    message: "Perfil del usuario",
    data: (req as any).user
  });
});

router.post("/pacientes", authMiddleware, crearPaciente);
router.get("/pacientes/:id", authMiddleware, obtenerPaciente);
router.put("/pacientes/:id", authMiddleware, actualizarPaciente);

export default router;