import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

type Props = {
    route: any;
    navigation: any;
};

const AfterSignUp: React.FC<Props> = ({ route, navigation }) => {
    const { loginNickname } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.successMessage}>Cadastro Realizado com Sucesso!</Text>
            <Text style={styles.nickname}>Seu nickname: {loginNickname}</Text>
            <Text style={styles.instruction}>
                Solicite a ajuda de um de nossos atendentes para a ativação do seu cadastro.
            </Text>
            <Button title="Voltar para Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    successMessage: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    nickname: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    instruction: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
});

export default AfterSignUp;
