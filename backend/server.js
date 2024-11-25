const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para lidar com JSON
app.use(express.json());

// Array simulado para armazenar os gastos
const gastos = [
  { categoria: "Refeições", valor: 54.2, compra: "Almoço" },
  { categoria: "Lanches", valor: 14.41, compra: "Café" },
  { categoria: "Marina", valor: 103.99, compra: "Flores" },
];

// Rota GET para obter os gastos consolidados por categoria com compras associadas
app.get("/gastos", (req, res) => {
  // Cria um objeto consolidado para evitar duplicações de categorias
  const gastosConsolidados = gastos.reduce((acc, gasto) => {
    if (!acc[gasto.categoria]) {
      acc[gasto.categoria] = {
        categoria: gasto.categoria,
        valor: 0,
        compras: [],
      };
    }

    // Atualiza o valor total da categoria
    acc[gasto.categoria].valor += parseFloat(gasto.valor);

    // Adiciona a compra como um objeto separado
    acc[gasto.categoria].compras.push({
      nome: gasto.compra,
      valor: parseFloat(gasto.valor),
    });
    console.log(
      `Categoria: ${gasto.categoria}, Valor acumulado: ${
        acc[gasto.categoria].valor
      }, Novo valor: ${parseFloat(gasto.valor)}`
    );

    return acc;
  }, {});

  // Transforma o objeto consolidado em um array
  const resultado = Object.values(gastosConsolidados);
  res.json(resultado);
});

// Rota POST para adicionar ou atualizar uma categoria com compras
app.post("/gastos", (req, res) => {
  const { categoria, valor, compra } = req.body;

  if (!categoria || !valor || !compra) {
    return res
      .status(400)
      .json({ error: "Categoria, valor e compra são obrigatórios" });
  }

  // Converte o valor para número decimal
  const valorFormatado = parseFloat(valor);

  if (isNaN(valorFormatado)) {
    return res.status(400).json({ error: "O valor deve ser um número válido" });
  }

  gastos.push({ categoria, valor: valorFormatado, compra });

  res.status(201).json({ success: true });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
