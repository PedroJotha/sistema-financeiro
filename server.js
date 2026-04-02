const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Conecta (ou cria) o banco de dados no arquivo financeiro.db
const db = new Database("financeiro.db");

// Cria as tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    data TEXT DEFAULT (date('now')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );
`);

// ========== USUÁRIOS ==========

// Listar todos os usuários
app.get("/usuarios", (req, res) => {
  const usuarios = db.prepare("SELECT * FROM usuarios").all();
  res.json(usuarios);
});

// Cadastrar novo usuário
app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios." });
  }

  try {
    const stmt = db.prepare("INSERT INTO usuarios (nome, email) VALUES (?, ?)");
    const resultado = stmt.run(nome, email);
    res.status(201).json({ id: resultado.lastInsertRowid, nome, email });
  } catch (err) {
    res.status(400).json({ erro: "Email já cadastrado." });
  }
});

// ========== TRANSAÇÕES ==========

// Listar transações de um usuário
app.get("/usuarios/:id/transacoes", (req, res) => {
  const { id } = req.params;
  const transacoes = db
    .prepare("SELECT * FROM transacoes WHERE usuario_id = ?")
    .all(id);
  res.json(transacoes);
});

// Adicionar transação
app.post("/usuarios/:id/transacoes", (req, res) => {
  const { id } = req.params;
  const { tipo, descricao, valor } = req.body;

  if (!tipo || !descricao || !valor) {
    return res.status(400).json({ erro: "tipo, descricao e valor são obrigatórios." });
  }

  const stmt = db.prepare(
    "INSERT INTO transacoes (usuario_id, tipo, descricao, valor) VALUES (?, ?, ?, ?)"
  );
  const resultado = stmt.run(id, tipo, descricao, valor);
  res.status(201).json({ id: resultado.lastInsertRowid, usuario_id: id, tipo, descricao, valor });
});

// Ver saldo de um usuário
app.get("/usuarios/:id/saldo", (req, res) => {
  const { id } = req.params;

  const entradas = db
    .prepare("SELECT SUM(valor) as total FROM transacoes WHERE usuario_id = ? AND tipo = 'entrada'")
    .get(id);

  const saidas = db
    .prepare("SELECT SUM(valor) as total FROM transacoes WHERE usuario_id = ? AND tipo = 'saida'")
    .get(id);

  const saldo = (entradas.total || 0) - (saidas.total || 0);
  res.json({ usuario_id: id, saldo });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
