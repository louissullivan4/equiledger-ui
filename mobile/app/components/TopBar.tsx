import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import CustomButton from './CustomButton';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { StackNavigationProp } from '@react-navigation/stack';
import LogoutButton from './LogoutButton';

const screenHeight = Dimensions.get('window').height;

type User = {
    name: string;
    email: string;
    token: string;
};

interface TopBarProps {
    heightPercentage: number;
    user: User | null;
    navigation: StackNavigationProp<any>;
    setUser: (user: User | null) => void;
}

const TopBar: React.FC<TopBarProps> = ({ heightPercentage, user, navigation, setUser }) => {
    const height = screenHeight * (heightPercentage / 100);
    const main = heightPercentage >= 30;

    const handleCategoryPress = (category: string) => {
        navigation.navigate('NewExpense', { category });
    };

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('user');
            setUser(null);
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while trying to log out.');
        }
    };

    return (
        <View style={[styles.container, { height }]}>
            <View style={styles.topContainer}>
                <Text style={styles.topText}>Hi {user?.name ? user.name : 'User'}</Text>
                <LogoutButton onPress={handleLogout} />
            </View>
            {main && (
                <View style={styles.mainContainer}>
                    <View style={styles.buttonContainer}>
                        <CustomButton title="Motor Fuel" iconName="directions-car" leftmargin={32} onPress={() => handleCategoryPress('motor-fuel')} />
                        <CustomButton title="Meals" iconName="restaurant" leftmargin={32} onPress={() => handleCategoryPress('meals')} />
                        <CustomButton title="Transport" iconName="airplanemode-active" leftmargin={32} onPress={() => handleCategoryPress('transport')} />
                        <CustomButton title="Equipment" iconName="construction" leftmargin={32} onPress={() => handleCategoryPress('equipment')} />
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
        color: '#fff',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
    topContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
