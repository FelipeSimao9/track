const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres.cukjkuratshuakfxvaxt", // Nome de usuário fornecido
  host: "aws-0-sa-east-1.pooler.supabase.com", // Host da conexão externa
  database: "postgres", // Nome do banco de dados
  password: "6PYpTambNhQNE6!", // Senha fornecida
  port: 6543, // Porta padrão do PostgreSQL
});

module.exports = pool;
