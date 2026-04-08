# Sistema Financeiro — API REST

API RESTful para gerenciamento financeiro de usuários, construída com **Node.js** e **Express**.

Acesse o sistema: https://pedrojotha.github.io/sistema-financeiro

---

# Tecnologias

- [cors](https://github.com/expressjs/cors)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [SQLite](https://www.sqlite.org/)
- [dotenv](https://github.com/motdotla/dotenv)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

---

# Funcionalidades

- Autenticação com JWT 
- Banco de dados SQLite 
- Painel administrativo 
- Interface web (HTML/CSS/JS) 
- Hospedagem na nuvem (Railway)
- Consulta de saldo por usuário 
- Transações financeiras (entrada e saída) 
- Cadastro e login de usuários com senha criptografada 

---

# Como rodar o projeto

# Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na sua máquina
- [Git](https://git-scm.com/) instalado

# Passo a passo

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

# Endpoints da API

# Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /registro | Cadastra um novo usuário |
| POST | /login | Autentica um usuário |
| GET | /perfil | Retorna dados do usuário logado |
| GET | /usuarios | Lista todos os usuários (admin) |

# Transações

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /usuarios/:id/transacoes | Adiciona uma transação |
| GET | /usuarios/:id/transacoes | Lista transações do usuário |
| GET | /usuarios/:id/saldo | Retorna o saldo atual do usuário |

---

# Autor

Feito por **Pedro Jotha**

[![GitHub](https://img.shields.io/badge/GitHub-PedroJotha-181717?style=flat&logo=github)](https://github.com/PedroJotha)

---

# Licença

Este projeto está sob a licença ISC. 