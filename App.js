import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import axios from "axios"; // Importando Axios para requisições

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemName, setItemName] = useState(""); // Nome do gasto (compra)
  const [price, setPrice] = useState(""); // Preço
  const [gastos, setGastos] = useState([]); // Estado para armazenar os dados do backend
  const [expandedCategories, setExpandedCategories] = useState([]); // Controle de categorias expandidas
  const [selectedPeriod, setSelectedPeriod] = useState("hoje");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const periods = [
    { label: "Hoje", value: "hoje" },
    { label: "Últimos 7 Dias", value: "semana" },
    { label: "Último Mês", value: "mes" },
    { label: "Total", value: "all" },
  ];

  // Função para buscar os dados do backend
  const fetchGastos = async (periodo) => {
    try {
      const response = await axios.get(
        `https://track-1kvk.onrender.com/gastosPorData?periodo=${periodo}`
      );
      setGastos(response.data); // Armazena as categorias, valores e compras
    } catch (error) {
      console.error("Erro ao buscar os gastos:", error);
    }
  };

  // Buscar os dados assim que o componente for montado
  useEffect(() => {
    fetchGastos(selectedPeriod);
  }, [selectedPeriod]);

  // Função para alternar a expansão da categoria
  const toggleCategory = (categoria) => {
    setExpandedCategories(
      (prev) =>
        prev.includes(categoria)
          ? prev.filter((cat) => cat !== categoria) // Remove se já está expandida
          : [...prev, categoria] // Adiciona se não está expandida
    );
  };

  const handleSelectPeriod = (value) => {
    setSelectedPeriod(value);
    setDropdownVisible(false); // Fecha o dropdown
  };

  // Função para adicionar um novo gasto
  const handleAddExpense = async () => {
    if (!selectedCategory || !price || !itemName) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Converte a vírgula para ponto e garante um número decimal
      const formattedPrice = parseFloat(price.replace(",", "."));

      if (isNaN(formattedPrice)) {
        alert("Por favor, insira um valor válido.");
        return;
      }
      await axios.post("https://track-1kvk.onrender.com/gastos", {
        categoria: selectedCategory,
        valor: formattedPrice,
        compra: itemName,
      });

      await fetchGastos(selectedPeriod);

      // Limpa os campos e fecha o modal
      setSelectedCategory("");
      setItemName("");
      setPrice("");
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error);
      alert("Erro ao adicionar o gasto. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        {/* Dropdown Trigger */}
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {periods.find((p) => p.value === selectedPeriod)?.label}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownContainer}>
            <FlatList
              data={periods}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPeriod(item.value)}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          -R${" "}
          {gastos.reduce((total, gasto) => total + gasto.valor, 0).toFixed(2)}
        </Text>
      </View>

      {/* Expense Summary */}
      <ScrollView
        style={styles.summaryScroll}
        contentContainerStyle={styles.summaryContent}
      >
        <View style={styles.summaryCard}>
          {gastos.map((gasto, index) => (
            <View key={index}>
              {/* Categoria Principal */}
              <TouchableOpacity
                style={styles.summaryItem}
                onPress={() => toggleCategory(gasto.categoria)}
              >
                <Text style={styles.category}>{gasto.categoria}:</Text>
                <Text style={styles.amount}>R$ {gasto.valor.toFixed(2)}</Text>
              </TouchableOpacity>

              {/* Compras (Somente se Categoria Estiver Expandida) */}
              {expandedCategories.includes(gasto.categoria) &&
                gasto.compras.map((compra, idx) => (
                  <View key={idx} style={styles.purchaseItem}>
                    <Text style={styles.purchaseName}>{compra.nome}</Text>
                    <Text style={styles.purchaseAmount}>
                      R$ {compra.valor.toFixed(2)}
                    </Text>
                  </View>
                ))}
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.category}>Total:</Text>
            <Text style={styles.totalAmount}>
              R$
              {gastos
                .reduce((total, gasto) => total + gasto.valor, 0)
                .toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Gasto</Text>

            {/* Dropdown for Category */}
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              >
                <Picker.Item label="Selecione uma categoria" value="" />
                {[...new Set(gastos.map((gasto) => gasto.categoria))].map(
                  (categoria, index) => (
                    <Picker.Item
                      key={index}
                      label={categoria}
                      value={categoria}
                    />
                  )
                )}
              </Picker>
            </View>

            {/* Input for Item Name */}
            <Text style={styles.label}>O que você comprou?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Café, Presente..."
              value={itemName}
              onChangeText={(text) => setItemName(text)}
            />

            {/* Input for Price */}
            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 25,90"
              value={price}
              onChangeText={(text) => {
                // Permite números, vírgula e ponto
                const formattedText = text.replace(/[^0-9.,]/g, "");
                setPrice(formattedText);
              }}
              keyboardType="numeric"
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addExpenseButton}
                onPress={handleAddExpense}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 100, // Adiciona espaçamento no topo
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownTrigger: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    width: 150, // Ajuste para deixar menor
    marginTop: 50, // Espaço para ficar abaixo do "hoje"
    marginRight: 20, // Alinhado à direita
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fundo com transparência
    borderRadius: 10,
    paddingVertical: 5, // Menor altura interna
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 8, // Menor altura para os itens
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0", // Linha mais sutil
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#777",
  },
  balanceContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#555",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  purchaseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#rrr",
  },
  purchaseName: {
    fontSize: 16,
    color: "#777",
  },
  purchaseAmount: {
    fontSize: 16,
    color: "#555",
  },
  summaryCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    color: "#333",
  },
  amount: {
    fontSize: 18,
    color: "#555",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 160,
    width: 60,
    height: 60,
    backgroundColor: "#333",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  summaryScroll: {
    maxHeight: 400, // Altura máxima ajustável para o ScrollView
    width: "100%", // Certifica que o scroll ocupa a largura total
  },
  summaryContent: {
    paddingBottom: 20, // Espaço interno para evitar cortes no conteúdo final
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  addExpenseButton: {
    flex: 1,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  picker: {
    height: 40,
    width: 150,
    color: "#333",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
