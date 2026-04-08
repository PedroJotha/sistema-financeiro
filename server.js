const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const db = new Database("financeiro.db");
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_SENHA = process.env.ADMIN_SENHA;

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    admin INTEGER DEFAULT 0
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

const adminExiste = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(ADMIN_EMAIL);
if (!adminExiste) {
  const senhaCriptografada = bcrypt.hashSync(ADMIN_SENHA, 10);
  db.prepare("INSERT INTO usuarios (nome, email, senha, admin) VALUES (?, ?, ?, ?)").run("Administrador", ADMIN_EMAIL, senhaCriptografada, 1);
  console.log("Admin criado: email=" + ADMIN_EMAIL);
}

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ erro: "Token não fornecido." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido." });
  }
}

function apenasAdmin(req, res, next) {
  if (!req.usuario.admin) return res.status(403).json({ erro: "Acesso negado." });
  next();
}

app.post("/registro", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const stmt = db.prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
    const resultado = stmt.run(nome, email, senhaCriptografada);
    res.status(201).json({ id: resultado.lastInsertRowid, nome, email });
  } catch {
    res.status(400).json({ erro: "Email já cadastrado." });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  const usuario = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
  if (!usuario) return res.status(401).json({ erro: "Email ou senha incorretos." });
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) return res.status(401).json({ erro: "Email ou senha incorretos." });
  const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email, admin: usuario.admin }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, nome: usuario.nome, admin: usuario.admin, id: usuario.id });
});

app.get("/usuarios", autenticar, apenasAdmin, (req, res) => {
  const usuarios = db.prepare("SELECT id, nome, email, admin FROM usuarios").all();
  res.json(usuarios);
});

app.get("/usuarios/:id/transacoes", autenticar, (req, res) => {
  const { id } = req.params;
  if (!req.usuario.admin && req.usuario.id !== parseInt(id)) {
    return res.status(403).json({ erro: "Acesso negado." });
  }
  const transacoes = db.prepare("SELECT * FROM transacoes WHERE usuario_id = ?").all(id);
  res.json(transacoes);
});

app.post("/usuarios/:id/transacoes", autenticar, (req, res) => {
  const { id } = req.params;
  if (!req.usuario.admin && req.usuario.id !== parseInt(id)) {
    return res.status(403).json({ erro: "Acesso negado." });
  }
  const { tipo, descricao, valor } = req.body;
  if (!tipo || !descricao || !valor) return res.status(400).json({ erro: "tipo, descricao e valor são obrigatórios." });
  const stmt = db.prepare("INSERT INTO transacoes (usuario_id, tipo, descricao, valor) VALUES (?, ?, ?, ?)");
  const resultado = stmt.run(id, tipo, descricao, valor);
  res.status(201).json({ id: resultado.lastInsertRowid, usuario_id: id, tipo, descricao, valor });
});

app.get("/usuarios/:id/saldo", autenticar, (req, res) => {
  const { id } = req.params;
  if (!req.usuario.admin && req.usuario.id !== parseInt(id)) {
    return res.status(403).json({ erro: "Acesso negado." });
  }
  const entradas = db.prepare("SELECT SUM(valor) as total FROM transacoes WHERE usuario_id = ? AND tipo = 'entrada'").get(id);
  const saidas = db.prepare("SELECT SUM(valor) as total FROM transacoes WHERE usuario_id = ? AND tipo = 'saida'").get(id);
  const saldo = (entradas.total || 0) - (saidas.total || 0);
  res.json({ usuario_id: id, saldo });
});

app.get("/perfil", autenticar, (req, res) => {
  const usuario = db.prepare("SELECT id, nome, email, admin FROM usuarios WHERE id = ?").get(req.usuario.id);
  res.json(usuario);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
