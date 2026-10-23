const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
    return res.status(401).json({
      erro: "Token não informado"
    });
  }

  const token = autorizacao.split(" ")[1];

  try {
    req.usuario = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Token inválido ou expirado"
    });
  }
}

module.exports = verificarToken;
