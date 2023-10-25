import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button, Divider } from 'react-native-elements';
import { useColorScheme } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

type Props = {
    navigation: any;
};

const AfterSignUp: React.FC<Props> = ({ navigation }) => {
    
    return (
        <View style={[styles.container]}>
            <Text style={styles.successMessage}>Cadastro realizado com sucesso</Text>
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
    successMessage: {
        fontSize: 36, // Aumenta o tamanho da fonte
        textAlign: 'center',
        marginBottom: 20, // Move o texto para cima
    },
});

export default AfterSignUp;
