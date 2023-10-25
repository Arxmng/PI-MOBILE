import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button, Divider } from 'react-native-elements';
import { useColorScheme } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

type Props = {
    navigation: any;
};

const AfterSignUp: React.FC<Props> = ({ navigation }) => {
    
    return (
        <View style={[styles.container]}>
            <Text>Cadastro realizado com sucesso</Text>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>LOGIN</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 20,
        height: 100,
        width: 100,
    },
    lightMode: {
        backgroundColor: 'white',
    },
    darkMode: {
        backgroundColor: 'black',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    line: {
        flex: 1,
        height: 2,
    },
    dividerText: {
        width: 40,
        textAlign: 'center',
    },
    loginContainer: {
        backgroundColor: 'green',
        borderRadius: 10, // Define as bordas arredondadas
        padding: 10, // Adiciona espaço interno para o texto
        marginTop: 10, // Define a margem superior (aumentada para 10)
    },
    loginText: {
        textAlign: 'center',
        color: 'white', // Cor do texto
        fontSize: 24, // Aumenta o tamanho do texto para 24 (ou ajuste conforme desejado)
    },
});

export default AfterSignUp;
    