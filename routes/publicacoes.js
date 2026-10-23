const express = require("express");
const db = require("../database");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Listar publicações: acesso aberto
router.get("/", (req, res) => {
  const publicacoes = db.prepare(`
    SELECT publicacoes.id, titulo, conteudo,
           usuarios.nome AS autor
    FROM publicacoes
    JOIN usuarios ON usuarios.id = publicacoes.usuario_id
  `).all();

  res.status(200).json(publicacoes);
});

// Criar publicação: usuário logado
router.post("/", verificarToken, (req, res) => {
  const { titulo, conteudo } = req.body;

  if (!titulo || !conteudo) {
    return res.status(400).json({
      erro: "Título e conteúdo são obrigatórios"
    });
  }

  const resultado = db.prepare(`
    INSERT INTO publicacoes (usuario_id, titulo, conteudo)
    VALUES (?, ?, ?)
  `).run(req.usuario.id, titulo, conteudo);

  res.status(201).json({
    id: resultado.lastInsertRowid,
    titulo,
    conteudo
  });
});

// Editar publicação: somente o dono
router.put("/:id", verificarToken, (req, res) => {
  const publicacao = db.prepare(
    "SELECT * FROM publicacoes WHERE id = ?"
  ).get(req.params.id);

  if (!publicacao) {
    return res.status(404).json({
      erro: "Publicação não encontrada"
    });
  }

  if (publicacao.usuario_id !== req.usuario.id) {
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

  db.prepare(`
    UPDATE publicacoes
    SET titulo = ?, conteudo = ?
    WHERE id = ?
  `).run(titulo, conteudo, req.params.id);

  res.status(200).json({
    mensagem: "Publicação atualizada"
  });
});

// Excluir publicação: somente o dono
router.delete("/:id", verificarToken, (req, res) => {
  const publicacao = db.prepare(
    "SELECT * FROM publicacoes WHERE id = ?"
  ).get(req.params.id);

  if (!publicacao) {
    return res.status(404).json({
      erro: "Publicação não encontrada"
    });
  }

  if (publicacao.usuario_id !== req.usuario.id) {
    return res.status(403).json({
      erro: "Sem permissão"
    });
  }

  db.prepare(
    "DELETE FROM publicacoes WHERE id = ?"
  ).run(req.params.id);

  res.status(204).send();
});

module.exports = router;
