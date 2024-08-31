import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { StackNavigationProp } from '@react-navigation/stack';

const screenHeight = Dimensions.get('window').height;

type User = {
    name: string;
    email: string;
    token: string;
};

interface TopBarProps {
    heightPercentage: number;
    user: User
    navigation: StackNavigationProp<any>;
}

const TopBar: React.FC<TopBarProps> = ({ heightPercentage, user, navigation }) => {
    const height = screenHeight * (heightPercentage / 100);
    const main = heightPercentage >= 30;

    const handleCategoryPress = (category: string) => {
        navigation.navigate('NewExpense', { category });
    };

    return (
        <View style={[styles.container, { height }]}>
            <Text style={styles.topText}>Hi {user.name ? user.name : 'User'}</Text>
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
