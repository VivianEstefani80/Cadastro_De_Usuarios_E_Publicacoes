const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Cadastro de usuário
router.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: "Preencha todos os campos"
    });
  }

  const hash = bcrypt.hashSync(senha, 10);

  db.query(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, hash],
    (erro, resultado) => {
      if (erro) {
        return res.status(400).json({
          erro: "Não foi possível cadastrar. Verifique o e-mail."
        });
      }

      res.status(201).json({
        id: resultado.insertId,
        nome,
        email
      });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (erro, resultados) => {
      if (erro) {
        return res.status(500).json({
          erro: "Erro no banco de dados"
        });
      }

      const usuario = resultados[0];

      if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
        return res.status(401).json({
          erro: "E-mail ou senha incorretos"
        });
      }

      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token });
    }
  );
});

// Consultar perfil
router.get("/perfil", verificarToken, (req, res) => {
  db.query(
    "SELECT id, nome, email FROM usuarios WHERE id = ?",
    [req.usuario.id],
    (erro, resultados) => {
      if (erro) {
        return res.status(500).json({
          erro: "Erro ao consultar perfil"
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      res.json(resultados[0]);
    }
  );
});

module.exports = router;
