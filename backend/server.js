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
    { categoria: "Refeições", valor: 54.2 },
    { categoria: "Lanches", valor: 14.41 },
    { categoria: "Marina", valor: 103.99 },
  ];
  
  // Rota GET para obter os gastos
  app.get("/gastos", (req, res) => {
    res.json(gastos);
  });
  
  // Rota POST para adicionar um novo gasto (categoria e valor)
  app.post("/gastos", (req, res) => {
    const { categoria, valor } = req.body;
  
    // Validação simples
    if (!categoria || !valor) {
      return res.status(400).json({ error: "Categoria e valor são obrigatórios" });
    }
  
    // Adiciona o novo gasto no array
    const novoGasto = { categoria, valor };
    gastos.push(novoGasto);
  
    // Retorna o novo gasto adicionado
    res.status(201).json(novoGasto);
  });
  