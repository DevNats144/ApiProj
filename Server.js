import express from "express";
import cors from "cors";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear formulários


// Rota POST - criar usuário
app.post("/user", async (req, res) => {
  
    await prisma.user.create({
      data: {
      
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
      },
      
    });
    res.status(201).json(req.body);
})

app.get("/user", (req, res) => {
  res.send("API online!");
});

// Rota GET - buscar usuários
app.get("/user", async (req, res) => {
 
    const usuarios = await prisma.user.findMany({
      where: 
      {
        name: req.query.name,
        age: req.query.age,
        email: req.query.email
      },   
    });

    res.status(200).json(usuarios);
 
});


// Rota PUT - atualizar usuário
app.put('/user/:id', async (req, res) => {
  
    await prisma.user.update({
      where: { id: Number (req.params.id)},
      data: {

        name: req.body.name,
        age: req.body.age,
        email: req.body.email
     
      }
    });
    res.status(200).json({ message: "User atualizado com sucesso!" });
 
});

// Rota DELETE - deletar usuário
app.delete('/user/:id', async (req, res) => {
 
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(200).json({ message: "User deletado com sucesso!" });
  
});

app.listen(3000)