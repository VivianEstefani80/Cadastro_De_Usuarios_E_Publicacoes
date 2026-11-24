require("dotenv").config();

const mysql = require("mysql2");

const DB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "cadastro_de_usuarios_e_publicacoes"
});

DB.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }

    console.log("Conectado ao MySQL!");
});

module.exports = DB;
