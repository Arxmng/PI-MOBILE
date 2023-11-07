import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db, auth } from '../config/firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';


type Props = {
    navigation: any;
};

type FormValues = {
    fullName: string;
    email: string;
    cpf: string;
    dateOfBirth: string;
    phone: string;
    responsiblePhone: string;
    city: string;
    state: string;
    howDidYouKnow: string;
};

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



const SignUp: React.FC<Props> = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | undefined>();
    let senha = 0;
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
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            fullName: Yup.string(),
            cpf: Yup.string(),
            dateOfBirth: Yup.string(),
            phone: Yup.string(),
            responsiblePhone: Yup.string(),
            city: Yup.string(),
            state: Yup.string(),
            howDidYouKnow: Yup.string(),
        }),
        onSubmit: async (values) => {

                senha = Math.round(Math.random() * (999999 - 111111) + 0);
                createUserWithEmailAndPassword(auth, values.email, senha.toString())
              .then( async (userCredentials) => {
              const user = userCredentials.user;
              try {
                const docRef = await addDoc(collection(db, "studiogames"), {
                    fullName: values.fullName,
                    email: values.email,
                    cpf: values.cpf,
                    dateOfBirth: values.dateOfBirth,
                    phone: values.phone,
                    responsiblePhone: values.responsiblePhone,
                    city: values.city,
                    state: values.state,
                    howDidYouKnow: values.howDidYouKnow,
                });

                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
              }
              console.log(user.email, senha);
              navigation.navigate('AfterSignUp');
            }) .catch ((error) => {
                //const errorCode = error.code;
                const errorMessage = error.message;
                if (errorMessage == "Firebase: Error (auth/email-already-in-use)."){
                    alert('Email ja registrado')
                }
            });
            //navigation.navigate('Home')
        },
    });


    return (
        <ScrollView style={{flex: 1}}>
            <View style={styles.container}>
                <Input
                    placeholder='Nome Completo'
                    onChangeText={formik.handleChange('fullName')}
                    value={formik.values.fullName}
                    errorMessage={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : ''}
                />
                <Input
                    placeholder='E-mail'
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                    errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
                />
                <Input
                    placeholder='CPF'
                    onChangeText={formik.handleChange('cpf')}
                    value={formik.values.cpf}
                    errorMessage={formik.touched.cpf && formik.errors.cpf ? formik.errors.cpf : ''}
                />
                <Input placeholder={'Data de Nascimento'}
                       onChangeText={formik.handleChange('dateOfBirth')}
                       value={formik.values.dateOfBirth}
                       errorMessage={formik.touched.dateOfBirth && formik.errors.dateOfBirth ? formik.errors.dateOfBirth : ''}
                />
                <View style={styles.row}>
                    <Input
                        containerStyle={styles.halfWidth}
                        placeholder='Telefone'
                        onChangeText={formik.handleChange('phone')}
                        value={formik.values.phone}
                        errorMessage={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ''}
                    />
                    <Input
                        containerStyle={styles.halfWidth}
                        placeholder='Telefone do Responsável'
                        onChangeText={formik.handleChange('responsiblePhone')}
                        value={formik.values.responsiblePhone}
                        errorMessage={formik.touched.responsiblePhone && formik.errors.responsiblePhone ? formik.errors.responsiblePhone : ''}
                    />
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