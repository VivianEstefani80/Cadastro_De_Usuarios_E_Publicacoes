const express = require("express");
const db = require("../database");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Consultar usuário
router.get("/:id", verificarToken, (req, res) => {
  db.query(
    "SELECT id, nome, email FROM usuarios WHERE id = ?",
    [req.params.id],
    (erro, resultados) => {
      if (erro) {
        return res.status(500).json({
          erro: "Erro ao consultar usuário"
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      res.status(200).json(resultados[0]);
    }
  );
});

// Editar usuário
router.put("/:id", verificarToken, (req, res) => {
  if (Number(req.usuario.id) !== Number(req.params.id)) {
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

  db.query(
    "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
    [nome, email, req.params.id],
    (erro, resultado) => {
      if (erro) {
        return res.status(400).json({
          erro: "E-mail já cadastrado ou dados inválidos"
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      res.status(200).json({
        mensagem: "Usuário atualizado"
      });
    }
  );
});

// Excluir usuário
router.delete("/:id", verificarToken, (req, res) => {
  if (Number(req.usuario.id) !== Number(req.params.id)) {
    return res.status(403).json({
      erro: "Sem permissão"
    });
  }

  db.query(
    "DELETE FROM usuarios WHERE id = ?",
    [req.params.id],
    (erro, resultado) => {
      if (erro) {
        return res.status(500).json({
          erro: "Não foi possível excluir o usuário"
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      res.status(204).send();
    }
  );
});

module.exports = router;
