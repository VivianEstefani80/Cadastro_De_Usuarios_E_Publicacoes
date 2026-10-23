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

  try {
    const hash = bcrypt.hashSync(senha, 10);

    const resultado = db.prepare(`
      INSERT INTO usuarios (nome, email, senha)
      VALUES (?, ?, ?)
    `).run(nome, email, hash);

    res.status(201).json({
      id: resultado.lastInsertRowid,
      nome,
      email
    });
  } catch (erro) {
    res.status(400).json({
      erro: "Não foi possível cadastrar. Verifique se o e-mail já existe."
    });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const usuario = db.prepare(
    "SELECT * FROM usuarios WHERE email = ?"
  ).get(email);

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
});

// Consultar perfil
router.get("/perfil", verificarToken, (req, res) => {
  const usuario = db.prepare(`
    SELECT id, nome, email
    FROM usuarios
    WHERE id = ?
  `).get(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({
      erro: "Usuário não encontrado"
    });
  }

  res.json(usuario);
});

module.exports = router;
