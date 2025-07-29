import express from "express"
import Cors from 'cors'
import { PrismaClient } from './generated/prisma/index.js' // Importando o Prisma Client, que é a nossa interface de comunicação com o banco de dados.
const prisma = new PrismaClient()


const apy = express()
apy.use(express.json()) // Para o express perceber, que vamos ultilizar o formato da req JSON

apy.use(Cors())




// Rota Post //

apy.post("/userss", async (req, resp) => {

    await prisma.user.create({
        data: {
            // Aqui vamos criar o nosso user, com os dados que vamos receber do body da nossa requisição.
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }

    })


    resp.status(201).json() // 201, Alem de criar mostrar aquilo q foi criado. 

})



// Rota Get //


apy.get("/user", async (request, response) => {
    if (request.query) {

        const usuarios = await prisma.user.findMany({
            where: {
                name: request.query.name,
                email: request.query.email,
                age: request.query.age
            }
        });
        response.status(200).json(usuarios);

    } else {

        let user = await prisma.user.findMany();
        response.status(200).json(user.body);
    }
})

// Rota Put //


apy.put('/users/:id', async (req, resp) => {

    console.log(req)

    await prisma.user.update({
        where: {

            id: req.params.id

        }, 
                  // Aqui vamos atualizar o nosso user, com os dados que vamos receber do body da nossa requisição.
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age

        }

    })
    resp.status(201).json(req.body)
})

// Rota Delete //

apy.delete('/usersss/:id', async (req, resp) => {

    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    resp.status(200).json({ message: "User finalmente deletado com sucesso!" });
});

apy.listen(4000) //Especificamos em que porta vai rodar o nosso Server.




/*
 EqHFCeEclBjlWvzg
       Objs* 
       .Criar a nossa API de users

       ! - Creat an user
       ! - listar os users 
       ! - Editar um user
       ! - Delete an user
*/
