import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import TopBar from '../components/TopBar';
import HomeCard from "../components/HomeCard";

type User = {
    name: string;
    email: string;
    token: string;
};

type RootStackParamList = {
    Home: undefined;
    ExpenseScreen: undefined;
    CreateExpense: undefined;
    IncomeScreen: undefined;
    CreateIncome: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
    navigation: HomeScreenNavigationProp;
    user: User
};

const HomeScreen: React.FC<Props> = ({ navigation, user }) => {
    return (
        <View style={styles.container}>
            <TopBar heightPercentage={30} user={user} navigation={navigation} />
            <View style={{ padding: 15 }}>
                <HomeCard heightPercentage={45} navigation={navigation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
    },
});

export default HomeScreen;
