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

  // Função para buscar os dados do backend
  const fetchGastos = async () => {
    try {
      const response = await axios.get("http://192.168.0.6:3000/gastos"); // Atualize com o IP correto
      setGastos(response.data);
    } catch (error) {
      console.error("Erro ao buscar os gastos:", error);
    }
  };

  // Buscar os dados assim que o componente for montado
  useEffect(() => {
    fetchGastos();
  }, []);

  // Função para adicionar um novo gasto
  const handleAddExpense = async () => {
    if (!selectedCategory || !price || !itemName) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.6:3000/gastos", {
        categoria: selectedCategory,
        compra: itemName, // Inclui o campo compra
        valor: parseFloat(price),
      });

      // Atualiza a lista de gastos após adicionar
      setGastos((prevGastos) => [...prevGastos, response.data]);

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Hoje ▾</Text>
      </View>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}></Text>
        <Text style={styles.balanceAmount}>
          -R$ {gastos.reduce((total, gasto) => total + gasto.valor, 0).toFixed(2)}
        </Text>
      </View>

      {/* Expense Summary */}
      <View style={styles.summaryCard}>
        {gastos.map((gasto, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.category}>{gasto.categoria}:</Text>
            <Text style={styles.amount}>R$ {gasto.valor.toFixed(2)}</Text>
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
                {gastos.map((gasto, index) => (
                  <Picker.Item
                    key={index}
                    label={gasto.categoria}
                    value={gasto.categoria}
                  />
                ))}
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
              placeholder="Ex: 25.90"
              value={price}
              onChangeText={(text) => setPrice(text)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  header: {
    width: "100%",
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
});
