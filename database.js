const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((erro) => {
  if (erro) {
    console.error("Erro ao conectar:", erro);
    return;
  }

  console.log("Conectado ao MySQL!");
});

module.exports = db;
