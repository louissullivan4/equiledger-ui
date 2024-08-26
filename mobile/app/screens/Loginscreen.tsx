import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import * as SecureStore from 'expo-secure-store';
import { SERVER_URL } from '../config';

type User = {
    name: string;
    email: string;
    token: string;
};

export default function LoginScreen({ setUser }: { setUser: (user: User) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (): Promise<void> => {
        try {
            // Simulate API call to authenticate the user and get user data
            const userData = await loginWithEmailAndPassword(email, password);

            // Save user data to SecureStore
            await SecureStore.setItemAsync('user', JSON.stringify(userData));

            // Set user in state to switch to the App flow
            setUser(userData);
        } catch (error) {
            // Show an alert with the error message
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.topText}>Login</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={styles.input}
            />
            <CustomButton title="Submit" onPress={handleLogin} />
        </View>
    );
}

async function loginWithEmailAndPassword(email: string, password: string) {
    try {
        const response = await fetch(`${SERVER_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to login, please check your credentials.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B59CE0',
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    topText: {
        fontSize: 25,
        marginBottom: 10,
        color: '#fff', // White text
        fontFamily: 'Inter', // Custom font
        fontWeight: 'bold',
    },
});
