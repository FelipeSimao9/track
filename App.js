import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
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

      {/* Expense Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.category}>Refeições:</Text>
          <Text style={styles.amount}>R$ 54,20</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.category}>Lanches:</Text>
          <Text style={styles.amount}>R$ 14,41</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.category}>Marina:</Text>
          <Text style={styles.amount}>R$ 103,99</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.category}>Total</Text>
          <Text style={styles.totalAmount}>R$ 172,60</Text>
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
    width: "90%",
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
});
