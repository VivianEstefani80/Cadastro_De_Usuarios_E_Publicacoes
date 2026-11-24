const express = require("express");
const db = require("../database");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Listar publicações: acesso aberto
router.get("/", (req, res) => {
  db.query(`
    SELECT publicacoes.id, publicacoes.titulo,
           publicacoes.conteudo, usuarios.nome AS autor
    FROM publicacoes
    JOIN usuarios ON usuarios.id = publicacoes.usuario_id
  `, (erro, resultados) => {
    if (erro) {
      return res.status(500).json({
        erro: "Erro ao listar publicações"
      });
    }

    res.status(200).json(resultados);
  });
});

// Criar publicação: usuário logado
router.post("/", verificarToken, (req, res) => {
  const { titulo, conteudo } = req.body;

  if (!titulo || !conteudo) {
    return res.status(400).json({
      erro: "Título e conteúdo são obrigatórios"
    });
  }

  db.query(
    `INSERT INTO publicacoes (usuario_id, titulo, conteudo)
     VALUES (?, ?, ?)`,
    [req.usuario.id, titulo, conteudo],
    (erro, resultado) => {
      if (erro) {
        return res.status(500).json({
          erro: "Erro ao criar publicação"
        });
      }

      res.status(201).json({
        id: resultado.insertId,
        titulo,
        conteudo
      });
    }
  );
});

// Editar publicação: somente o dono
router.put("/:id", verificarToken, (req, res) => {
  db.query(
    "SELECT * FROM publicacoes WHERE id = ?",
    [req.params.id],
    (erro, resultados) => {
      if (erro) {
        return res.status(500).json({
          erro: "Erro ao consultar publicação"
        });
      }

      const publicacao = resultados[0];

      if (!publicacao) {
        return res.status(404).json({
          erro: "Publicação não encontrada"
        });
      }

      if (Number(publicacao.usuario_id) !== Number(req.usuario.id)) {
        return res.status(403).json({
          erro: "Sem permissão"
        });
      }

      const { titulo, conteudo } = req.body;

      if (!titulo || !conteudo) {
        return res.status(400).json({
          erro: "Título e conteúdo são obrigatórios"
        });
      }

      db.query(
        `UPDATE publicacoes
         SET titulo = ?, conteudo = ?
         WHERE id = ?`,
        [titulo, conteudo, req.params.id],
        (erro) => {
          if (erro) {
            return res.status(500).json({
              erro: "Erro ao atualizar publicação"
            });
          }

          res.status(200).json({
            mensagem: "Publicação atualizada"
          });
        }
      );
    }
  );
});

// Excluir publicação: somente o dono
router.delete("/:id", verificarToken, (req, res) => {
  db.query(
    "SELECT * FROM publicacoes WHERE id = ?",
    [req.params.id],
    (erro, resultados) => {
      if (erro) {
        return res.status(500).json({
          erro: "Erro ao consultar publicação"
        });
      }

      const publicacao = resultados[0];

      if (!publicacao) {
        return res.status(404).json({
          erro: "Publicação não encontrada"
        });
      }

      if (Number(publicacao.usuario_id) !== Number(req.usuario.id)) {
        return res.status(403).json({
          erro: "Sem permissão"
        });
      }

      db.query(
        "DELETE FROM publicacoes WHERE id = ?",
        [req.params.id],
        (erro) => {
          if (erro) {
            return res.status(500).json({
              erro: "Erro ao excluir publicação"
            });
          }

          res.status(204).send();
        }
      );
    }
  );
});

module.exports = router;
