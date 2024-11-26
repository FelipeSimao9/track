const pool = require("./db"); // Importa a conexão com o banco
const moment = require("moment-timezone"); // Importa a biblioteca
const express = require("express");
const app = express();
const PORT = 3000;


(async () => {
  try {
    const client = await pool.connect();
    console.log("Conexão com o banco de dados bem-sucedida!");
    client.release();
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
})();

// Middleware para lidar com JSON
app.use(express.json());

// Rota GET para obter os gastos consolidados por categoria com compras associadas
app.get("/gastos", async (req, res) => {
  try {
    const query = `
      SELECT categoria, SUM(valor) AS valor_total, 
      json_agg(json_build_object('nome', compra, 'valor', valor, 'data', data)) AS compras
      FROM gastos
      GROUP BY categoria;
    `;

    const result = await pool.query(query);

    // Transforma os resultados para o formato esperado
    const gastosConsolidados = result.rows.map((row) => ({
      categoria: row.categoria,
      valor: parseFloat(row.valor_total),
      compras: row.compras.map((compra) => ({
        nome: compra.nome,
        valor: parseFloat(compra.valor),
        data: compra.data,
      })),
    }));

    res.json(gastosConsolidados);
  } catch (error) {
    console.error("Erro ao buscar gastos:", error);
    res.status(500).json({ error: "Erro ao buscar gastos." });
  }
});


// Rota POST para adicionar ou atualizar uma categoria com compras
app.post("/gastos", async (req, res) => {
  const { categoria, valor, compra } = req.body;

  if (!categoria || !valor || !compra) {
    return res
      .status(400)
      .json({ error: "Categoria, valor e compra são obrigatórios" });
  }

  const valorFormatado = parseFloat(valor);

  if (isNaN(valorFormatado)) {
    return res.status(400).json({ error: "O valor deve ser um número válido" });
  }

  try {
    const query = `
      INSERT INTO gastos (categoria, valor, compra, data)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      categoria,
      valorFormatado,
      compra,
      moment().tz("America/Sao_Paulo").format(), // Adiciona a data ajustada para o fuso
    ];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]); // Retorna o registro adicionado
  } catch (error) {
    console.error("Erro ao adicionar gasto:", error);
    res.status(500).json({ error: "Erro ao adicionar gasto." });
  }
});

app.get("/gastosPorData", async (req, res) => {
  const { periodo } = req.query; // Captura o parâmetro "periodo"

  try {
    let query = `
      SELECT categoria, SUM(valor) AS valor_total, 
      json_agg(json_build_object('nome', compra, 'valor', valor, 'data', data)) AS compras
      FROM gastos
    `;
    const values = [];

    // Condições baseadas no período
    if (periodo === "hoje") {
      query += ` WHERE DATE(data AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE`;
    } else if (periodo === "semana") {
      query += ` WHERE DATE(data) >= CURRENT_DATE - INTERVAL '7 days'`;
    } else if (periodo === "mes") {
      query += ` WHERE DATE_PART('month', data) = DATE_PART('month', CURRENT_DATE)
                 AND DATE_PART('year', data) = DATE_PART('year', CURRENT_DATE)`;
    }

    // Agrupamento por categoria
    query += ` GROUP BY categoria`;

    const result = await pool.query(query, values);

    const gastosFiltrados = result.rows.map((row) => ({
      categoria: row.categoria,
      valor: parseFloat(row.valor_total),
      compras: row.compras.map((compra) => ({
        nome: compra.nome,
        valor: parseFloat(compra.valor),
        data: compra.data,
      })),
    }));

    res.json(gastosFiltrados);
  } catch (error) {
    console.error("Erro ao buscar gastos por data:", error);
    res.status(500).json({ error: "Erro ao buscar gastos por data." });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
