const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para lidar com JSON
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Array simulado para armazenar os gastos
const gastos = [
  { categoria: "Refeições", valor: 54.2, compra: "Almoço" },
  { categoria: "Lanches", valor: 14.41, compra: "Café" },
  { categoria: "Marina", valor: 103.99, compra: "Flores" },
];
  
  // Rota GET para obter os gastos
  app.get("/gastos", (req, res) => {
    res.json(gastos);
  });
  
// Rota POST para adicionar um novo gasto
app.post("/gastos", (req, res) => {
  const { categoria, valor, compra } = req.body;

  // Validação para garantir que os três campos estão presentes
  if (!categoria || !valor || !compra) {
    return res.status(400).json({ error: "Categoria, valor e compra são obrigatórios" });
  }

  // Adiciona o novo gasto no array
  const novoGasto = { categoria, valor, compra };
  gastos.push(novoGasto);

  // Retorna o novo gasto adicionado
  res.status(201).json(novoGasto);
});  