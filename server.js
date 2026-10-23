require("dotenv").config();

const express = require("express");
const app = express();

require("./database");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API de usuários e publicações funcionando!"
  });
});

app.use("/auth", require("./routes/auth"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/publicacoes", require("./routes/publicacoes"));

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada"
  });
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`API rodando na porta ${PORTA}`);
});
