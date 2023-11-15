import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db, auth } from '../config/firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import { addDoc, collection } from "firebase/firestore";
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import InputMask from "../components/InputMask";
import convertToDateObject from "../utils/convertToDateObject";

type Props = {
    navigation: any;
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc', // Adjust this
        borderRadius: 5, // Adjust this
        color: 'black',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc', // Adjust this
        borderRadius: 5, // Adjust this
        color: 'black',
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
});

// Função para gerar o apelido/nick de login
const generateLoginNickname = (fullName: String) => {
    const randomChars = Math.random().toString(36).substring(2, 5);
    return fullName.substring(0, 3) + randomChars;
};

const SignUp: React.FC<Props> = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | undefined>();
    const handleInputChange = (field: string) => (value: string) => {
        formik.setFieldValue(field, value);
    };
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            cpf: '',
            dateOfBirth: '',
            phone: '',
            responsiblePhone: '',
            city: '',
            state: '',
            howDidYouKnow: '',
            password: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            cpf: Yup.string().required('Required').min(11, 'Invalid CPF'),
            dateOfBirth: Yup.string()
                .required('Required')
                .test('is-date', 'Invalid date format', value => {
                    const date = convertToDateObject(value);
                    return date instanceof Date && !isNaN(date.getTime());
                }),

            phone: Yup.string().required('Required').min(10, 'Invalid phone number'),
            responsiblePhone: Yup.string().min(10, 'Invalid phone number'),
            password: Yup.string().required('Required').min(6, 'Password must be at least 6 characters long'),
            city: Yup.string(),
            state: Yup.string(),
            howDidYouKnow: Yup.string(),
        }),
        onSubmit: async (values) => {
            // Convert dateOfBirth from string to Date object
            const dateOfBirthObj = convertToDateObject(values.dateOfBirth);

            if (!dateOfBirthObj) {
                setErrorMessage('Invalid date of birth');
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: values.fullName });

                const loginNickname = generateLoginNickname(values.fullName);

                try {
                    await addDoc(collection(db, "users"), {
                        uid: user.uid,
                        fullName: values.fullName,
                        loginNickname: loginNickname,
                        activated: false,
                        email: values.email,
                        cpf: values.cpf,
                        dateOfBirth: dateOfBirthObj, // Use the converted Date object
                        phone: values.phone,
                        responsiblePhone: values.responsiblePhone,
                        city: values.city,
                        state: values.state,
                        howDidYouKnow: values.howDidYouKnow,
                    });
                    navigation.navigate('AfterSignUp', { loginNickname: loginNickname });
                } catch (e) {
                    if (e instanceof Error) {
                        setErrorMessage(e.message);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                    if (error.message.includes("auth/email-already-in-use")) {
                        alert('Email já registrado');
                    }
                }
            }
        },

    });


    return (
        <ScrollView style={{flex: 1}}>
            <View style={styles.container}>
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
                <Input
                    placeholder='Nome Completo'
                    onChangeText={formik.handleChange('fullName')}
                    value={formik.values.fullName}
                    errorMessage={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : ''}
                />
                {/* Inputs com máscaras */}
                <InputMask
                    placeholder='CPF'
                    value={formik.values.cpf}
                    onChange={(e) => formik.setFieldValue('cpf', e)}
                    mask="cpf"
                    errorMessage={formik.touched.cpf && formik.errors.cpf ? formik.errors.cpf : ''}
                />
                <InputMask
                    placeholder='Data de Nascimento'
                    value={formik.values.dateOfBirth}
                    onChange={(e) => formik.setFieldValue('dateOfBirth', e)}
                    mask="date"
                    errorMessage={formik.touched.dateOfBirth && formik.errors.dateOfBirth ? formik.errors.dateOfBirth : ''}
                />
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <InputMask
                            placeholder='Telefone'
                            value={formik.values.phone}
                            onChange={(e) => formik.setFieldValue('phone', e)}
                            mask="phone"
                            errorMessage={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ''}
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <InputMask
                            placeholder='Telefone do Responsável'
                            value={formik.values.responsiblePhone}
                            onChange={(e) => formik.setFieldValue('responsiblePhone', e)}
                            mask="phone"
                            errorMessage={formik.touched.responsiblePhone && formik.errors.responsiblePhone ? formik.errors.responsiblePhone : ''}
                        />
                    </View>
                </View>


            <View style={styles.row}>
                <View style={styles.halfWidth}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setSelectedState(value);
                            formik.setFieldValue('state', value);
                        }}
                            items={[
                                {label: 'SP', value: 'SP'},
                                {label: 'RJ', value: 'RJ'},
                                {label: 'MG', value: 'MG'},
                                {label: 'ES', value: 'ES'},
                                {label: 'RS', value: 'RS'},
                                {label: 'SC', value: 'SC'},
                                {label: 'PR', value: 'PR'},
                                {label: 'MS', value: 'MS'},
                                {label: 'MT', value: 'MT'},
                                {label: 'GO', value: 'GO'},
                                {label: 'DF', value: 'DF'},
                                {label: 'BA', value: 'BA'},
                                {label: 'SE', value: 'SE'},
                                {label: 'AL', value: 'AL'},
                                {label: 'PE', value: 'PE'},
                                {label: 'PB', value: 'PB'},
                                {label: 'RN', value: 'RN'},
                                {label: 'CE', value: 'CE'},
                                {label: 'PI', value: 'PI'},
                                {label: 'MA', value: 'MA'},
                                {label: 'PA', value: 'PA'},
                                {label: 'AP', value: 'AP'},
                                {label: 'AM', value: 'AM'},
                                {label: 'RR', value: 'RR'},
                                {label: 'AC', value: 'AC'},
                                {label: 'RO', value: 'RO'},
                                {label: 'TO', value: 'TO'},
                            ]}
                        style={pickerSelectStyles}
                    />
                </View>
                <Input
                    containerStyle={styles.halfWidth}
                    placeholder='Cidade'
                    onChangeText={formik.handleChange('city')}
                    value={formik.values.city}
                    errorMessage={formik.touched.city && formik.errors.city ? formik.errors.city : ''}
                />
            </View>

                <Input placeholder={'Como nos conheceu?'}
                       onChangeText={formik.handleChange('howDidYouKnow')}
                       value={formik.values.howDidYouKnow}
                       errorMessage={formik.touched.howDidYouKnow && formik.errors.howDidYouKnow ? formik.errors.howDidYouKnow : ''}
                />
                {errorMessage && <Text style={{color: 'red'}}>{errorMessage}</Text>}
                <Button title="Registrar" onPress={() => formik.handleSubmit()}/>
                <Button title="Voltar para Login" type="clear"
                        onPress={() => navigation.navigate('Login')}/>

            </View>
        </ScrollView>

    );
};

export default SignUp;