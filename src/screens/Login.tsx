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
import { sendPasswordResetEmail } from 'firebase/auth';
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";

type Props = {
    navigation: any;
};

const Login: React.FC<Props> = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const handleResetPassword = async () => {
        const email = formik.values.email;
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                setSuccessMessage('Email de redefinição de senha enviado.');
            } catch (error) {
                setErrorMessage('Erro ao enviar email de redefinição.');
            }
        } else {
            setErrorMessage('Por favor, insira seu email.');
        }
    };

    const onSubmit = async (values: { email: string; password: string; }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const userUid = userCredential.user.uid;
            const db = getFirestore();


            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', userUid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.activated) {
                    setSuccessMessage('Login bem-sucedido!');
                    setErrorMessage(null);
                    setShowResetPassword(false);
                    navigation.navigate('Fila');

                } else {
                    setErrorMessage('Acesso negado. Conta não ativada.');
                    auth.signOut();
                }
            } else {
                setErrorMessage('Usuário não encontrado no sistema.');
                auth.signOut();
            }
        } catch (error) {
            setErrorMessage((error as any).message);
            setSuccessMessage(null);
            setShowResetPassword(true);
        }
    };

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit,
    });


    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '192591185329-bprc85sjtf2nf10jveo5fr3o1llhffrp.apps.googleusercontent.com',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response]);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
            <Image source={require('./../../assets/images/Studio-Games.jpg')} style={styles.logo} />
            <Input
                placeholder='E-mail'
                onChangeText={formik.handleChange('email')}
                value={formik.values.email}
                errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            />
            <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            />
            {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}
            {errorMessage && <Text style={{ color: 'red' }}>{Array.isArray(errorMessage) ? errorMessage.join(' ') : errorMessage}</Text>}
            <Button title="Entrar" onPress={() => formik.handleSubmit()} />

            <View style={[styles.footerButtons, showResetPassword ? null : styles.centerButton]}>
                {showResetPassword && (
                    <Button
                        title="Esqueci a senha"
                        type="clear"
                        onPress={handleResetPassword}
                    />
                )}
                <Button
                    title="Cadastrar"
                    type="clear"
                    onPress={() => navigation.navigate('Cadastro')}
                />
            </View>


            <DividerWithText />

            <Button
                title="Entrar com Google"
                icon={<Image source={require('./../../assets/images/googleLogo.png')} style={{ width: 24, height: 24, marginRight: 10 }} />}
                onPress={() => promptAsync()}
            />
        </View>
    );
}

const DividerWithText = () => {
    return (
        <View style={styles.dividerContainer}>
            <Divider style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <Divider style={styles.line} />
        </View>
    );
};

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
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    centerButton: {
        justifyContent: 'center',
    },
});

export default Login;
