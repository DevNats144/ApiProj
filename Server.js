import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// CORS: permite seu site no Vercel
const allowedOrigins = ["https://gitprojects.vercel.app"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
}));

// Health check (pra ver se está online)
app.get("/health", (req, res) => {
  res.send("ok");
});

// Rota POST - criar usuário
app.post("/userss", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  });
  res.status(201).json({ message: "User criado com sucesso!" });
});

// Rota GET - buscar usuários
app.get("/user", async (req, res) => {
  let usuarios;
  if (Object.keys(req.query).length > 0) {
    usuarios = await prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        age: req.query.age ? Number(req.query.age) : null
      }
    });
  } else {
    usuarios = await prisma.user.findMany();
  }
  res.status(200).json(usuarios);
});

// Rota PUT - atualizar usuário
app.put('/users/:id', async (req, res) => {
  await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  });
  res.status(200).json({ message: "User atualizado com sucesso!" });
});

// Rota DELETE - deletar usuário
app.delete('/usersss/:id', async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(200).json({ message: "User deletado com sucesso!" });
});

// Porta dinâmica pro Railway
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando na porta ${PORT}`);
});
