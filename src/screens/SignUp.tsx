import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
    password: string;
};

const SignUp: React.FC<Props> = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
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
            password: Yup.string().required('Required'),
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
            try {
                await createUserWithEmailAndPassword(auth, values.email, values.password);
                // You can add logic here to save other form values to your database
            } catch (error) {
                setErrorMessage((error as any).message);
            }
        },
    });

    return (
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
                placeholder='Senha'
                secureTextEntry
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
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
            <View style={styles.halfWidth}>
                <Input
                    placeholder='Telefone'
                    onChangeText={formik.handleChange('phone')}
                    value={formik.values.phone}
                    errorMessage={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ''}
                />
            </View>
            <View style={styles.halfWidth}>
                <Input
                    placeholder='Telefone do Responsável'
                    onChangeText={formik.handleChange('responsiblePhone')}
                    value={formik.values.responsiblePhone}
                    errorMessage={formik.touched.responsiblePhone && formik.errors.responsiblePhone ? formik.errors.responsiblePhone : ''}
                />
            </View>
            <View style={styles.leftHalf}>
                <Input
                    placeholder='Cidade'
                    onChangeText={formik.handleChange('city')}
                    value={formik.values.city}
                    errorMessage={formik.touched.city && formik.errors.city ? formik.errors.city : ''}
                />
            </View>
            <View style={styles.rightHalf}>
                <Picker
                    selectedValue={formik.values.state}
                    onValueChange={(itemValue: string | number) =>
                        formik.setFieldValue('state', itemValue)
                    }
                >
                    <Picker.Item label="SP" value="SP" />
                    <Picker.Item label="RJ" value="RJ" />
                    <Picker.Item label="MG" value="MG" />
                    <Picker.Item label="ES" value="ES" />
                    <Picker.Item label="RS" value="RS" />
                    <Picker.Item label="SC" value="SC" />
                    <Picker.Item label="PR" value="PR" />
                    <Picker.Item label="MS" value="MS" />
                    <Picker.Item label="MT" value="MT" />
                    <Picker.Item label="GO" value="GO" />
                    <Picker.Item label="DF" value="DF" />
                    <Picker.Item label="AC" value="AC" />
                    <Picker.Item label="AM" value="AM" />
                    <Picker.Item label="RR" value="RR" />
                    <Picker.Item label="PA" value="PA" />
                    <Picker.Item label="AP" value="AP" />
                    <Picker.Item label="TO" value="TO" />
                    <Picker.Item label="RO" value="RO" />
                    <Picker.Item label="BA" value="BA" />
                    <Picker.Item label="SE" value="SE" />
                    <Picker.Item label="AL" value="AL" />
                    <Picker.Item label="PE" value="PE" />
                    <Picker.Item label="PB" value="PB" />
                    <Picker.Item label="RN" value="RN" />
                    <Picker.Item label="CE" value="CE" />
                    <Picker.Item label="PI" value="PI" />
                    <Picker.Item label="MA" value="MA" />
                </Picker>
            </View>
            <Input placeholder={'Como nos conheceu?'}
                onChangeText={formik.handleChange('howDidYouKnow')}
                value={formik.values.howDidYouKnow}
                errorMessage={formik.touched.howDidYouKnow && formik.errors.howDidYouKnow ? formik.errors.howDidYouKnow : ''}
            />
            {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
            <Button title="Registrar" onPress={() => formik.handleSubmit()} />
            <Button title="Voltar para Login" type="clear" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    halfWidth: {
        width: '48%',
        paddingRight: 2.5,
        paddingLeft: 2.5,
    },
});

export default SignUp;