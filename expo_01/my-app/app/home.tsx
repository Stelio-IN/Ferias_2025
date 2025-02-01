import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moto Pussy</Text>
      <Text style={styles.subtitle}>Transporte rápido e seguro para sua moto</Text>
      <Text style={styles.info}>Motocicletas transportadas: 12,345</Text>
      <Text style={styles.info}>Clientes satisfeitos: 98%</Text>
      <Text style={styles.info}>Cidades atendidas: 25</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff5733',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
});
