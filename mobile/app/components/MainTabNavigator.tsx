import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../screens/Homescreen';
import ExpenseScreen from '../screens/Expensescreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import IncomeScreen from '../screens/Incomescreen';
import CreateIncome from '../screens/CreateIncomeScreen';

// Define the prop types
type User = {
    name: string;
    email: string;
    token: string;
};

type MainTabNavigatorProps = {
    navigation: StackNavigationProp<any>;
    user: User;
};

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ navigation, user }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Expense':
                            iconName = 'receipt-long';
                            break;
                        case 'Income':
                        iconName = 'account-balance-wallet';
                        break;
                        default:
                            iconName = 'help-outline';
                    }

                    return (
                        <MaterialIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: '#D7CBED',
                tabBarInactiveTintColor: '#B59CE0',
                headerShown: false,
                tabBarStyle: { backgroundColor: 'white' },
            })}
        >
            <Tab.Screen name="Home">
                {(props) => <HomeScreen {...props} user={user} />}
            </Tab.Screen>
            <Tab.Screen name="Expense">
                {(props) => <ExpenseScreen user={user} navigation={navigation}/>}
            </Tab.Screen>
            <Tab.Screen name="NewExpense" options={{tabBarButton: () => null}}>
                {(props) => <CreateExpenseScreen {...props} user={user} />}
            </Tab.Screen>
            <Tab.Screen name="Income">
                {(props) => <IncomeScreen user={user} navigation={navigation}/>}
            </Tab.Screen>
            <Tab.Screen name="CreateIncome" options={{tabBarButton: () => null}}>
                {(props) => <CreateIncome {...props} user={user} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
