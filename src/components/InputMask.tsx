import React from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';
import { Input } from 'react-native-elements';

type InputMaskProps = {
    value: string;
    onChange: (e: string | React.ChangeEvent<any>) => void;
    mask: 'cpf' | 'phone' | 'date' | 'text' | 'email' | 'password';
    errorMessage?: string;
} & TextInputProps;


const applyMask = (value: string, mask: 'cpf' | 'phone' | 'date' | 'text' | 'email' | 'password'): string => {
    switch (mask) {
        case 'cpf':
        return value
            .replace(/\D/g, '') // Remove non-numeric characters
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'); // Maximum of 11 digits
        case 'phone':
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d{1,4})/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1'); // Brazilian phone format
        case 'date':
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d{1,4})/, '$1/$2')
                .replace(/(\/\d{4})\d+?$/, '$1'); // Date format dd/mm/yyyy
        case 'text':
        case 'email':
        case 'password':
            return value; // Sem máscara para texto, e-mail e senha
        default:
            return value;
    }
};

const validateInput = (value: string, mask: 'cpf' | 'phone' | 'date' | 'text' | 'email' | 'password'): string => {
    // Você pode adicionar validações específicas se necessário
    return value;
};

const InputMask: React.FC<InputMaskProps> = ({ value, onChange, mask, errorMessage, ...props }) => {
    const handleChange = (e: string | React.ChangeEvent<any>) => {
        const text = typeof e === 'string' ? e : e.target.value;
        const validatedText = validateInput(text, mask);
        const maskedText = applyMask(validatedText, mask);
        onChange(maskedText);
    };

    return (
        <View>
            <Input
                value={value}
                onChangeText={handleChange}

                {...props}
                errorStyle={{ color: 'red' }}
                errorMessage={errorMessage}
            />
        </View>
    );
};


export default InputMask;
