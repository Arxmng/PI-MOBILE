import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button, Divider } from 'react-native-elements';
import { useColorScheme } from 'react-native';
import firebase from '../../config/firebaseConfig';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = {
    navigation: any;
};

const Login: React.FC<Props> = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [loaded, setLoaded] = useState(false);


    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required')
        }),
        onSubmit: async (values) => {
            try {
               // await firebase.auth().signInWithEmailAndPassword(values.email, values.password);
            } catch (error) {
                setErrorMessage((error as any).message);
            }
        },
    });

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: 'YOUR_WEB_CLIENT_ID',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

           // const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
           // firebase.auth().signInWithCredential(credential);
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
            {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
            <Button title="Entrar" onPress={() => formik.handleSubmit()} />
            <Button title="Esqueceu a senha?" type="clear" onPress={() => navigation.navigate('ForgotPassword')} />
            <Button title="Cadastrar" type="clear" onPress={() => navigation.navigate('SignUp')} />

            {/* Linha e palavra "ou" */}
            <DividerWithText />

            <Button
                title="Entrar com Google"
                icon={<Image source={require('./../../assets/images/google_logo.png')} style={{ width: 24, height: 24, marginRight: 10 }} />}
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
});


export default Login;
