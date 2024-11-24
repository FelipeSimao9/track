import React, { useState } from "react";
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
import { Picker } from '@react-native-picker/picker';


export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false); // Controle do modal
  const [selectedCategory, setSelectedCategory] = useState(""); // Categoria selecionada
  const [itemName, setItemName] = useState(""); // Nome do item
  const [price, setPrice] = useState(""); // Preço

  const categories = ["Refeições", "Lanches", "Marina", "Jogos", "Compras"];

  const handleAddExpense = () => {
    console.log("Categoria:", selectedCategory);
    console.log("Item:", itemName);
    console.log("Preço:", price);

    // Limpa os campos após salvar
    setSelectedCategory("");
    setItemName("");
    setPrice("");
    setModalVisible(false);
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
        <Text style={styles.balanceLabel}>Dinheiro</Text>
        <Text style={styles.balanceAmount}>-R$ 172,60</Text>
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
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
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
            <Text style={styles.label}>Preço</Text>
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
    alignItems: "center",
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
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
  addButton: {
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
