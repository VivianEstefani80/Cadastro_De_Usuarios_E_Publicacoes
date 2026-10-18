const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API de usuários e publicações funcionando!"
  });
});

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
