/**
 * QueueScreen Component for a Gaming Queue Management System
 *
 * Este componente React faz parte de um sistema de gerenciamento de filas para uma área de jogos em um shopping center. O sistema é projetado para ser descentralizado e independente de funções do lado do servidor, ideal para o uso com o plano gratuito do Firebase/Firestore, que não suporta funções de nuvem.
 *
 * Principais Características:
 * 1. Descentralização: A lógica de controle da fila é gerenciada pelo próprio cliente, em vez de depender de um servidor ou funções de nuvem. Isso aumenta a redundância e reduz a dependência de um único ponto de falha.
 *
 * 2. Cálculo Dinâmico do Tempo de Espera: O 'futureTime' de cada usuário na fila é calculado dinamicamente com base no tempo atual do servidor e no tempo de espera acumulado dos usuários anteriores na fila. Isso garante que o primeiro usuário comece imediatamente, e os tempos de espera sejam gerenciados de forma eficiente para os demais usuários.
 *
 * 3. Atualização e Remoção Automática: Usuários cujo 'futureTime' já passou são automaticamente removidos da fila local e do Firestore, garantindo que a fila esteja sempre atualizada.
 *
 * 4. Notificação ao Usuário: O usuário é notificado quando chega a sua vez de jogar, baseado em sua posição na fila e no tempo de espera.
 *
 * 5. Tempo de Servidor Confiável: Para evitar manipulações, como mudanças no tempo do dispositivo pelo usuário (cheating), o componente busca o horário atual do servidor de um serviço externo (worldtimeapi.org), garantindo que todos os usuários tenham um ponto de referência de tempo consistente e confiável.
 *
 * Este sistema é uma solução eficaz e econômica para a gestão de filas, especialmente útil em ambientes onde não é possível implementar lógica de servidor complexa, ou para economizar com custos de cloud computing.
 */


import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {getFirestore, collection, query, where, getDocs, orderBy, Timestamp, doc, deleteDoc} from "firebase/firestore";
import { auth } from "../config/firebaseConfig";
import {signOut} from "@firebase/auth";

interface QueueScreenProps {
    navigation: any;
}

interface UserInQueue {
    firestoreDocId: string;
    docId: string;
    loginNickname: string;
    waitTime: string;
    createdAt: Timestamp;
    futureTime?: Date;
}

const QueueScreen = ({ navigation }: QueueScreenProps) => {
    const [queue, setQueue] = useState<UserInQueue[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('PCs');
    const [peopleAhead, setPeopleAhead] = useState<number>(0);
    const [totalWaitTime, setTotalWaitTime] = useState<number>(0);
    const [currentUserNickname, setCurrentUserNickname] = useState<string>("");
    const [serverTime, setServerTime] = useState(new Date());
    const [currentUserUID, setCurrentUserUID] = useState<string>("");
    const [userPosition, setUserPosition] = useState<number | null>(null);

    const db = getFirestore();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao sair:', error);
        }
    };
    const removeUserFromFirestore = async (firestoreDocId: string) => {
        const queueRef = collection(db, "queues");
        try {
            await deleteDoc(doc(queueRef, firestoreDocId));
            console.log(`User with ID ${firestoreDocId} removed from Firestore.`);
        } catch (error) {
            console.error(`Error removing user from Firestore: ${error}`);
        }
    };


    const formatTime = (date?: Date): string => {
        if (!date) {
            return "Início: --:--";
        }
        return `Início: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };


    const fetchServerTime = async () => {
        try {
            const response = await fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo');
            const data = await response.json();
            return new Date(data.utc_datetime);
        } catch (error) {
            console.error('Error fetching server time:', error);
            return new Date(); // fallback to local time in case of an error
        }
    };


    const firestoreTimestampToDate = (timestamp: Timestamp): Date => {
        return new Date(timestamp.seconds * 1000);
    };

    const calculateFutureTimes = (queue: UserInQueue[]): UserInQueue[] => {
        let accumulatedWaitTimeInMinutes = 0;

        return queue.map((user, index) => {
            let waitTimeMinutes = timeToMinutes(user.waitTime);

            if (index === 0) {
                // Para o primeiro usuário, o futureTime é o tempo atual do servidor
                return { ...user, futureTime: new Date(serverTime.getTime()) };
            } else {
                // Para os usuários subsequentes, acumula o tempo de espera
                accumulatedWaitTimeInMinutes += waitTimeMinutes;
                let futureTime = new Date(serverTime.getTime() + accumulatedWaitTimeInMinutes * 60000);
                return { ...user, futureTime };
            }
        });
    };

    const removeElapsedUsers = async (queue: UserInQueue[]) => {
        const currentServerTime = new Date();
        const filteredQueue = queue.filter(user => user.futureTime && user.futureTime > currentServerTime);

        for (const user of queue) {
            if (user.futureTime && user.futureTime <= currentServerTime) {
                await removeUserFromFirestore(user.firestoreDocId);
            }
        }

        return filteredQueue;
    };



    const fetchQueue = async () => {
        const q = query(
            collection(db, "queues"),
            where("category", "==", selectedCategory),
            orderBy("createdAt", "asc")
        );

        const querySnapshot = await getDocs(q);
        let newQueue = querySnapshot.docs.map(doc => ({
            ...doc.data() as UserInQueue,
            firestoreDocId: doc.id
        }));

            const notifyUser = (message: string) => {
                alert(message);
            };

        const notifyUserIfItsTheirTurn = () => {
            const currentUserInQueue = queue.find(user => user.loginNickname === currentUserNickname && user.docId === currentUserUID);

            if (currentUserInQueue) {
                const isCurrentUserTurn = currentUserInQueue.futureTime && new Date() >= currentUserInQueue.futureTime;
                if (isCurrentUserTurn) {
                    notifyUser("Sua vez de jogar!");
                }
            }
        };

        newQueue = calculateFutureTimes(newQueue);
        newQueue = await removeElapsedUsers(newQueue);

        setQueue(newQueue);
        notifyUserIfItsTheirTurn();


        let calculatedTotalWaitTime = 0;
        let calculatedPeopleAhead = 0;
        let currentUserInLine = false;

        newQueue.forEach((user, index) => {
            if (user.loginNickname === currentUserNickname && user.docId === currentUserUID) {
                if (index === 0 && user.futureTime && user.futureTime <= new Date()) {
                    notifyUser("Sua vez de jogar!");
                } else if (index !== 0) {
                    notifyUser("Está quase na sua vez de jogar!");
                }
            }
        });

        newQueue.forEach((user: UserInQueue) => {
            if (user.loginNickname === currentUserNickname) {
                currentUserInLine = true;
                return;
            }
            if (!currentUserInLine) {
                calculatedPeopleAhead++;
                calculatedTotalWaitTime += timeToMinutes(user.waitTime);
            }
        });

        setPeopleAhead(calculatedPeopleAhead);
        setTotalWaitTime(calculatedTotalWaitTime);
        setQueue(newQueue);
    };




    useEffect(() => {

        if (auth.currentUser) {
            setCurrentUserUID(auth.currentUser.uid);
        }

        const interval = setInterval(() => {
            fetchQueue();
        }, 10000); // Irá atualizar a fila a cada 10 segundos

        return () => clearInterval(interval);
    }, [selectedCategory, serverTime]);




    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };


    useEffect(() => {
        const initServerTime = async () => {
            const time = await fetchServerTime();
            console.log(`Fetched Server Time: ${time}`); // Debugging log
            setServerTime(time);
        };

        initServerTime();
    }, [selectedCategory]); // Fetch server time only when selectedCategory changes

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", userId));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    if (doc.data().fullName) {
                        setCurrentUserNickname(doc.data().fullName);
                    }
                });
            }
        };

        fetchUserName();
        fetchQueue();
    }, [selectedCategory, serverTime]); // Depend on serverTime to re-fetch the queue

    return (
        <View style={styles.container}>

            <Text style={styles.greeting}>Olá, {currentUserNickname || "Usuário"}!</Text>
            <Text>Você tem {peopleAhead} pessoas na frente.</Text>
            <Text>Tempo estimado de espera: {totalWaitTime} minutos.</Text>

            <ScrollView>
                {queue.map((user, index) => (
                    <View key={user.docId} style={styles.userItem}>
                        <Text>{`${index + 1}. ${user.loginNickname}`}</Text>
                        <Text>{formatTime(user.futureTime)}</Text>
                    </View>
                ))}
            </ScrollView>


            <View style={styles.tabs}>
                {['PCs', 'Consoles', 'Simuladores', 'VRs'].map(category => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        style={selectedCategory === category ? styles.selectedTab : null}
                    >
                        <Text>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.logoutButtonContainer}>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    greeting: {
        fontSize: 20,
        marginBottom: 20,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    selectedTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    logoutButtonContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },
});

export default QueueScreen;
