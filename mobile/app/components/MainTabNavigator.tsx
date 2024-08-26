import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../screens/Homescreen';
import ExpenseScreen from '../screens/Expensescreen';
// import IncomeScreen from '../screens/HomeScreen';
// import TaxScreen from '../screens/HomeScreen';
// import DocumentsScreen from '../screens/HomeScreen';

// Define the prop types
type MainTabNavigatorProps = {
    setUser: React.Dispatch<React.SetStateAction<null>>;
};

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ setUser }) => {
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
                            iconName = 'attach-money';
                            break;
                        case 'Tax':
                            iconName = 'account-balance';
                            break;
                        case 'Documents':
                            iconName = 'folder';
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
                {(props) => <HomeScreen {...props} setUser={setUser} />}
            </Tab.Screen>
            <Tab.Screen name="Expense">
                {(props) => <ExpenseScreen {...props} setUser={setUser} />}
            </Tab.Screen>
            {/* <Tab.Screen name="Expense" component={ExpenseScreen} />
            <Tab.Screen name="Income" component={IncomeScreen} />
            <Tab.Screen name="Tax" component={TaxScreen} />
            <Tab.Screen name="Documents" component={DocumentsScreen} /> */}
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
