
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {getFirestore, collection, query, where, getDocs, orderBy, Timestamp, doc, deleteDoc} from "firebase/firestore";
import { auth } from "../config/firebaseConfig";

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

    const db = getFirestore();

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
        return queue.map(user => {
            let createdAtDate = firestoreTimestampToDate(user.createdAt);
            let waitTimeMinutes = timeToMinutes(user.waitTime);
            return { ...user, futureTime: new Date(createdAtDate.getTime() + waitTimeMinutes * 60000) };
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

        newQueue = calculateFutureTimes(newQueue);
        newQueue = await removeElapsedUsers(newQueue);

        let calculatedTotalWaitTime = 0;
        let calculatedPeopleAhead = 0;
        let currentUserInLine = false;

        // Iterate over the queue to calculate the total wait time and number of people ahead
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
        fetchQueue();
    }, [selectedCategory]);




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

    // Fetch queue and user's nickname
    useEffect(() => {
        const fetchUserName = async () => {
            // ... logic to fetch user's nickname ...
        };

        if (auth.currentUser) {
            fetchUserName();
        }
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
                <Button title="Logout" onPress={() => {/* Logica do logout - fazer */}} />
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
