import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet } from "react-native";
import TopBar from '../components/TopBar';
import HomeCard from "../components/HomeCard";

type RootStackParamList = {
    Home: undefined;
    ExpenseScreen: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
    navigation: HomeScreenNavigationProp;
    setUser: React.Dispatch<React.SetStateAction<null>>;
};

const HomeScreen: React.FC<Props> = ({ navigation, setUser }) => {
    return (
        <View style={styles.container}>
            <TopBar heightPercentage={30} />
            <View style={{ padding: 15 }}>
                <HomeCard heightPercentage={45} navigation={navigation} />
                {/* <Button title="Logout" onPress={() => setUser(null)} />  */}
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
