import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API online!");
});

app.post("/user", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        age: Number(req.body.age),
        email: req.body.email,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      where: {
        name: req.query.name,
        age: req.query.age ? Number(req.query.age) : undefined,
        email: req.query.email,
      },
    });
    res.status(200).json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name,
        age: Number(req.body.age),
        email: req.body.email,
      },
    });
    res.status(200).json({ message: "User atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({ message: "User deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

app.listen(3000);