import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function LoginScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometryAvailable, setBiometryAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  // Verifica se o dispositivo suporta biometria e Face ID
  async function checkBiometricSupport() {
    const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (hasBiometricHardware && supportedTypes.length > 0) {
      setBiometryAvailable(true);
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setFaceIdAvailable(true);
      }
    } else {
      Alert.alert("Erro", "Seu dispositivo não suporta autenticação biométrica.");
    }
  }

  // Função para autenticação biométrica
  async function handleBiometricAuth() {
    authenticateUser("Autentique-se com Impressão Digital");
  }

  // Função para autenticação com Face ID
  async function handleFaceIdAuth() {
    if (!faceIdAvailable) {
      return Alert.alert("Erro", "Seu dispositivo não suporta Face ID.");
    }
    authenticateUser("Autentique-se com Face ID");
  }

  // Função genérica para autenticar o usuário
  async function authenticateUser(promptMessage) {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isEnrolled) {
      return Alert.alert("Erro", "Nenhuma biometria cadastrada no dispositivo.");
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: "Use a senha do dispositivo",
      cancelLabel: "Cancelar",
    });

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      Alert.alert("Erro", "Falha na autenticação.");
    }
  }

  // Função para logout
  function handleLogout() {
    setIsAuthenticated(false);
  }

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <View style={styles.authenticatedContainer}>
          <Text style={styles.successText}>✅ Você está autenticado!</Text>
          <Button title="Sair" onPress={handleLogout} color="red" />
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Bem-vindo à Página de Login</Text>

          {biometryAvailable && (
            <View style={styles.buttonSpacing}>
              <Button title="Login com Impressão Digital" onPress={handleBiometricAuth} />
            </View>
          )}

          {faceIdAvailable && Platform.OS === "ios" && (
            <View style={styles.buttonSpacing}>
              <Button title="Login com Face ID" onPress={handleFaceIdAuth} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginContainer: {
    alignItems: "center",
  },
  authenticatedContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonSpacing: {
    marginVertical: 10,
    width: 200,
  },
});

