import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const NotificationScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../../assets/images/NotificationIcon.png')}
            />
            <Text style={styles.title}>Atenção</Text>
            <Text style={styles.message}>Sua posição na fila chegou, venha até o equipamento.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 40,
        color: '#666',
    },
});

export default NotificationScreen;
