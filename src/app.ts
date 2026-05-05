import express from "express";
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./config/data-source";

const app = express();

app.use(express.json());

app.use(authRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB conectada");

    app.listen(3000, () => {
      console.log("Servidor corriendo");
    });
  })
  .catch(console.error);


app.get("/ping", (req, res) => {
  res.json({
    code: 200,
    message: "API funcionando",
    data: null
  });
});



app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});