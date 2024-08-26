import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore

const screenHeight = Dimensions.get('window').height;

interface TopBarProps {
    heightPercentage: number;
}

const TopBar: React.FC<TopBarProps> = ({ heightPercentage }) => {
    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const height = screenHeight * (heightPercentage / 100);
    const main = heightPercentage >= 30;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setName(user.name);
                } else {
                    console.error('No user data found in SecureStore');
                }
            } catch (error) {
                console.error('Error fetching user data from SecureStore:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }

    return (
        <View style={[styles.container, { height }]}>
            <Text style={styles.topText}>Hi {name ? name : 'User'}</Text>
            {main && (
                <View style={styles.mainContainer}>
                    <View style={styles.buttonContainer}>
                        <CustomButton title="Diesel" iconName="directions-car" onPress={() => alert('Button clicked 1')} />
                        <CustomButton title="Food" iconName="restaurant" onPress={() => alert('Button clicked 2')} />
                        <CustomButton title="Travel" iconName="airplanemode-active" onPress={() => alert('Button clicked 3')} />
                        <CustomButton title="Repair" iconName="construction" onPress={() => alert('Button clicked 4')} />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#B59CE0',
        padding: 30,
    },
    topText: {
        fontSize: 25,
        marginBottom: 10,
        color: '#fff', // White text
        fontFamily: 'Inter', // Custom font
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#B59CE0',
        borderRadius: 8,
    },
    mainContainer: {
        alignItems: 'center',
    }
});

export default TopBar;
