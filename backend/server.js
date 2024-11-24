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

// Rota para obter os dados de categorias e valores
app.get("/gastos", (req, res) => {
    const gastos = [
      { categoria: "Refeições", valor: 54.2 },
      { categoria: "Lanches", valor: 14.41 },
      { categoria: "Marina", valor: 103.99 },
    ];
  
    res.json(gastos);
  });
  