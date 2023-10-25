import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { db } from '../config/firebaseConfig';
import { getDocs, collection, doc, onSnapshot } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

type Queue = {
    category: string,
    waitTime: number,
    usersInQueue: number
}

const QueueScreen: React.FC = () => {
    const navigation: any = useNavigation(); // forçando a tipagem para 'any'
    const [queues, setQueues] = useState<Queue[]>([]);
    const [userPosition, setUserPosition] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "queues"));
            const queuesData: Queue[] = [];
            querySnapshot.forEach((doc) => {
                queuesData.push(doc.data() as Queue);
            });
            setQueues(queuesData);
        };

        const userDoc = doc(db, "users", "userID");
        const unsubscribe = onSnapshot(userDoc, (doc) => {
            const userData = doc.data();
            if (userData && 'position' in userData) {
                setUserPosition(userData.position);
                if (userData.position === 1) {
                    navigation.navigate("Notification");
                }
            }
        });

        fetchData();

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Olá, {/* Nome de Usuário */}!</Text>
            {userPosition !== null && <Text>Sua posição atual: {userPosition}</Text>}
            {queues.map((queue, index) => (
                <View key={index} style={styles.queueContainer}>
                    <Text>Categoria: {queue.category}</Text>
                    <Text>Tempo de Espera: {queue.waitTime} min</Text>
                    <Text>Usuários na Fila: {queue.usersInQueue}</Text>
                </View>
            ))}
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    queueContainer: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5
    }
});

export default QueueScreen;
