import express from "express";
import cors from "cors";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear formulários

app.use((req, res, next) => {
  // Sanitiza query params (GET
  if (req.query.age) {
    req.query.age = Number(req.query.age.toString().replace(/"/g, ''));
  }
  // Sanitiza body params (POST/PUT)
  if (req.body?.age) {
    req.body.age = Number(req.body.age.toString().replace(/"/g, ''));
  }
  next();
});


// Rota POST - criar usuário
app.post("/user", async (req, res) => {
  try {
    await prisma.user.create({
      data: {
      
        name: req.body.name,
        age: Number(req.body.age),
        email: req.body.email
      }
      
    });
    res.status(201).json({ message: "User criado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  console.log('Tipo de age:', typeof req.body.age, 'Valor:', req.body.age);
});

app.get("/", (req, res) => {
  res.send("API online!");
});

// Rota GET - buscar usuários
app.get("/user", async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) filters.name = req.query.name;
    
    if (req.query.age) {
  const ageNumber = Number(req.query.age);
  if (!isNaN(ageNumber)) {
    filters.age = ageNumber;
  }
}

    if (req.query.email) filters.email = req.query.email;

    const usuarios = await prisma.user.findMany({
      where: filters
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro na rota /user:', error);
    res.status(400).json({ error: error.message });
  }
});


// Rota PUT - atualizar usuário
app.put('/user/:id', async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: Number (req.params.id)},
      data: {

        name: req.body.name,
        age: (req.body.age),
        email: req.body.email
     
      }
    });
    res.status(200).json({ message: "User atualizado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota DELETE - deletar usuário
app.delete('/user/:id', async (req, res) => {
 
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(200).json({ message: "User deletado com sucesso!" });
  
});

