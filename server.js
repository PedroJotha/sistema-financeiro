const express = require("express");

const app = express();
app.use(express.json());

let usuarios = []; // Aqui vamos guardar os usuários

// Mostrar todos os usuários
app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

// Cadastrar novo usuário
app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;
  const usuario = { id: usuarios.length + 1, nome, email };
  usuarios.push(usuario);
  res.json(usuario);
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});