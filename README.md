# 💰 Sistema Financeiro — API REST

API RESTful para gerenciamento financeiro de usuários, construída com **Node.js** e **Express**.

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/) *(banco de dados)*
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Nodemon](https://nodemon.io/) *(desenvolvimento)*
- [dotenv](https://github.com/motdotla/dotenv)
- [cors](https://github.com/expressjs/cors)

---

## 📋 Funcionalidades

- [x] Cadastro de usuários
- [x] Listagem de usuários
- [x] Transações financeiras (entrada e saída)
- [x] Consulta de saldo por usuário
- [x] Interface web (HTML/CSS/JS)
- [x] Banco de dados SQLite
- [ ] Autenticação (em breve)
- [ ] Relatórios (em breve)

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na sua máquina
- [Git](https://git-scm.com/) instalado

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/PedroJotha/sistema-financeiro.git

# Entre na pasta do projeto
cd sistema-financeiro

# Instale as dependências
npm install

# Inicie o servidor
node server.js
```

O servidor vai rodar em: `http://localhost:3000`

Abra o arquivo `index.html` no navegador para acessar a interface.

---

## 📡 Endpoints da API

### Usuários

| Método | Rota        | Descrição               |
|--------|-------------|--------------------------|
| GET    | /usuarios   | Lista todos os usuários  |
| POST   | /usuarios   | Cadastra um novo usuário |

### Transações

| Método | Rota                        | Descrição                        |
|--------|-----------------------------|----------------------------------|
| POST   | /usuarios/:id/transacoes    | Adiciona uma transação           |
| GET    | /usuarios/:id/transacoes    | Lista transações do usuário      |
| GET    | /usuarios/:id/saldo         | Retorna o saldo atual do usuário |

### Exemplo de requisição POST `/usuarios`

```json
{
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

---

## 👨‍💻 Autor

Feito por **Pedro Jotha**

[![GitHub](https://img.shields.io/badge/GitHub-PedroJotha-181717?style=flat&logo=github)](https://github.com/PedroJotha)

---

## 📄 Licença

Este projeto está sob a licença ISC.
