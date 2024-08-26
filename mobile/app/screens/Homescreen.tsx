import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Button } from "react-native";
import TopBar from '../components/TopBar';
import HomeCard from "../components/HomeCard";

type RootStackParamList = {
    Home: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
    navigation: HomeScreenNavigationProp;
    setUser: React.Dispatch<React.SetStateAction<null>>; // Add this line
};

const HomeScreen: React.FC<Props> = ({ navigation, setUser }) => {
    return (
        <View style={styles.container}>
            <TopBar heightPercentage={30} />
            <View style={{ padding: 15 }}>
                <HomeCard heightPercentage={45} />
                {/* <Button title="Logout" onPress={() => setUser(null)} />  */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D2D1D1",
    },
});

export default HomeScreen;

