import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const YourScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TÍTULO GRANDE</Text>
      <View style={styles.rectangle}>
        <Text style={styles.loginText}>LOGIN:</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Cor de fundo
  },
  title: {
    fontSize: 36, // Tamanho do título
    marginBottom: 20, // Espaço abaixo do título
  },
  rectangle: {
    backgroundColor: 'green', // Cor do retângulo
    borderRadius: 10, // Bordas arredondadas
    padding: 10, // Espaço interno do retângulo
  },
  loginText: {
    color: 'white', // Cor do texto
    fontSize: 24, // Tamanho do texto "LOGIN:"
  },
});

export default YourScreen;
