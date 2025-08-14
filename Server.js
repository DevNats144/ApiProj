import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear formulários

// 2. Middleware de sanitização (ADICIONE AQUI)
app.use((req, res, next) => {
  // Sanitiza query params (GET)
  if (req.query.age) {
    req.query.age = parseInt(req.query.age.toString().replace(/"/g, ''), 10);
  }
  
  // Sanitiza body params (POST/PUT)
  if (req.body?.age) {
    req.body.age = parseInt(req.body.age.toString().replace(/"/g, ''), 10);
  }
  
  next();
});

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
      age: req.query.age ? Number(req.query.age) : undefined
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
        age: req.query.age ? Number(req.query.age) : undefined
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
    where: { id:(req.params.id) },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.query.age ? Number(req.query.age) : undefined
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
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando na porta ${PORT}`);
});
