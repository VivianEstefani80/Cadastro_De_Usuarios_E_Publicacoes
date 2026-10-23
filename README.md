# Cadastro de Usuários e Publicações

## Sobre o projeto

Este projeto consiste em uma API para cadastro de usuários e gerenciamento de publicações.

## Funcionalidades

- Cadastro de usuários.
- Login com senha protegida por hash.
- Consulta de perfil.
- Consulta, edição e exclusão de usuários.
- Criação, listagem, edição e exclusão de publicações.
- Controle de acesso por autenticação e identificação do dono.

## Tecnologias utilizadas

- Node.js
- Express
- SQLite
- JSON Web Token (JWT)
- bcryptjs

## Como executar

1. Instale o Node.js no computador.
2. Baixe ou clone este repositório.
3. Instale as dependências com:

   npm install

4. Configure as variáveis de ambiente em um arquivo `.env`.
5. Inicie a API com:

   npm start

## Rotas principais

- POST /auth/cadastro
- POST /auth/login
- GET /auth/perfil
- GET /usuarios/:id
- PUT /usuarios/:id
- DELETE /usuarios/:id
- GET /publicacoes
- POST /publicacoes
- PUT /publicacoes/:id
- DELETE /publicacoes/:id
