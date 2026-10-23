const express = require("express");
const db = require("../database");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Consultar usuário
router.get("/:id", verificarToken, (req, res) => {
  const usuario = db.prepare(`
    SELECT id, nome, email
    FROM usuarios
    WHERE id = ?
  `).get(req.params.id);

  if (!usuario) {
    return res.status(404).json({
      erro: "Usuário não encontrado"
    });
  }

  res.status(200).json(usuario);
});

// Editar usuário
router.put("/:id", verificarToken, (req, res) => {
  if (req.usuario.id !== Number(req.params.id)) {
    return res.status(403).json({
      erro: "Sem permissão"
    });
  }

  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({
      erro: "Nome e e-mail são obrigatórios"
    });
  }

  try {
    const resultado = db.prepare(`
      UPDATE usuarios
      SET nome = ?, email = ?
      WHERE id = ?
    `).run(nome, email, req.params.id);

    if (!resultado.changes) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Usuário atualizado"
    });
  } catch (erro) {
    res.status(400).json({
      erro: "E-mail já cadastrado ou dados inválidos"
    });
  }
});

// Excluir usuário
router.delete("/:id", verificarToken, (req, res) => {
  if (req.usuario.id !== Number(req.params.id)) {
    return res.status(403).json({
      erro: "Sem permissão"
    });
  }

  try {
    const resultado = db.prepare(
      "DELETE FROM usuarios WHERE id = ?"
    ).run(req.params.id);

    if (!resultado.changes) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    res.status(204).send();
  } catch (erro) {
    res.status(500).json({
      erro: "Não foi possível excluir o usuário"
    });
  }
});

module.exports = router;
