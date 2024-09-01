import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import GenericTopBar from '../components/GenericTopBar';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { SERVER_URL } from '../config';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import CustomDropdown from '../components/CustomDropdown';

type User = {
    name: string;
    email: string;
    token: string;
};

interface Expense {
    title: string;
    description: string;
    category: string;
    amount: number | string;
    currency: string;
    receipt: any;
}

interface CreateExpenseScreenProps {
    navigation: StackNavigationProp<any>;
    user: User;
    route?: any;
}

const CreateExpenseScreen: React.FC<CreateExpenseScreenProps> = ({ navigation, user, route }) => {
    const [expense, setExpense] = useState<Expense>({
        title: '',
        description: '',
        category: route.params?.category || '',
        amount: '',
        currency: 'EUR',
        receipt: null,
    });

    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useFocusEffect(
        React.useCallback(() => {
            setExpense({
                title: '',
                description: '',
                category: route.params?.category || '',
                amount: '',
                currency: 'EUR',
                receipt: null,
            });
            setIsSuccess(false);
        }, [route.params?.category])
    );

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const imagePickerStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (cameraStatus.status !== 'granted' || imagePickerStatus.status !== 'granted') {
                alert('Sorry, we need camera and photo library permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async () => {
        Alert.alert(
            "Upload Receipt",
            "Choose an option:",
            [
                {
                    text: "Take Photo",
                    onPress: () => openCamera(),
                },
                {
                    text: "Choose from Gallery",
                    onPress: () => openImageLibrary(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    const openImageLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setExpense({ ...expense, receipt: result.assets[0] });
        }
    };

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setExpense({ ...expense, receipt: result.assets[0] });
        }
    };

    const handleInputChange = (key: keyof Expense, value: any) => {
        if (key === 'amount') {
            if (/^\d*\.?\d*$/.test(value)) {
                setExpense({ ...expense, [key]: value });
            }
        } else {
            setExpense({ ...expense, [key]: value });
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
    
        formData.append('title', expense.title);
        formData.append('description', expense.description);
        formData.append('category', expense.category);
        formData.append('amount', expense.amount.toString());
        formData.append('currency', expense.currency);
    
        if (expense.receipt) {
            const fileUri = expense.receipt.uri;
            const fileName = fileUri.split('/').pop();
            const response = await fetch(fileUri);
            const blob = await response.blob();
    
            formData.append('receipt_image', {
                uri: fileUri,
                type: blob.type,
                name: fileName,
            });
        }
    
        try {
            const response = await axios.post(`${SERVER_URL}/expenses`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response from server:', response.data);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'There was an issue creating your expense. Please try again.');
        }
    };

    const categories = [
        { label: "Accommodation", value: "accommodation" },
        { label: "Equipment / Supplies", value: "equipment" },
        { label: "Healthcare", value: "healthcare" },
        { label: "Interest On Loans", value: "loan-interest" },
        { label: "Legal & Accounting", value: "accounting" },
        { label: "Meals", value: "meals" },
        { label: "Mobile - Phone Bill, Internet & Repairs", value: "mobile" },
        { label: "Motor Expenses - NCT, Insurance, Service, Repairs & Parking", value: "motor-expenses" },
        { label: "Motor Fuel", value: "motor-fuel" },
        { label: "Office Equipment", value: "office" },
        { label: "PPE Clothing", value: "ppe" },
        { label: "Personal Insurance", value: "personal-insurance" },
        { label: "Stationary & Postage", value: "stationary" },
        { label: "Trade Subscriptions & Memberships", value: "memberships" },
        { label: "Transport - Flight, Ferry & Public Transport", value: "transport" },
        { label: "Training", value: "training" },
        { label: "Other", value: "other" },
    ];

    const [currency, setCurrency] = useState('EUR');
    const items = [
        { label: 'Euro', value: 'EUR' },
        { label: 'US Dollar', value: 'USD' },
        { label: 'British Pound', value: 'GBP' },
        { label: 'Japanese Yen', value: 'JPY' },
        { label: 'Canadian Dollar', value: 'CAD' },
    ];

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <GenericTopBar heightPercentage={8} title={'New Expense'} />
                <View style={styles.mainContainer}>
                    <Animatable.View
                        animation={isSuccess ? "fadeIn" : undefined}
                        duration={2000}
                        style={[styles.card, isSuccess && styles.successCard]}
                    >
                        {isSuccess && (
                            <View>
                                <View>
                                    <Animatable.View
                                        animation="bounceIn"
                                        duration={6000}
                                        style={styles.successContainer}
                                    >
                                        <Icon name="checkmark-circle" size={100} color="#FFF" />
                                    </Animatable.View>
                                </View>
                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity
                                        style={styles.anotherButton}
                                        onPress={() => {
                                            // Reset the form state to initial values
                                            setExpense({
                                                title: '',
                                                description: '',
                                                category: '',
                                                amount: '',
                                                currency: 'EUR',
                                                receipt: null,
                                            });
                                            setIsSuccess(false);
                                        }}
                                    >
                                        <Text style={styles.anotherButtonText}>Add Another Expense</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.addExpenseButton}
                                        onPress={() => navigation.navigate('Expense')}
                                    >
                                        <Text style={styles.anotherButtonText}>View Expenses</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
    
                        {!isSuccess && (
                            <>
                                <Text style={styles.inputLabel}>Title</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Expense title"
                                    value={expense.title}
                                    onChangeText={(text) => handleInputChange('title', text)}
                                />
    
                                <Text style={styles.inputLabel}>Description</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Expense description"
                                    value={expense.description}
                                    onChangeText={(text) => handleInputChange('description', text)}
                                />
    
                                <Text style={styles.inputLabel}>Category</Text>
                                <View style={styles.pickerWrapper}>
                                    <CustomDropdown
                                        selectedValue={expense.category}
                                        onValueChange={(value: any) => handleInputChange('category', value)}
                                        items={categories}
                                    />
                                </View>
    
                                <View style={styles.inlineContainer}>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.inputLabel}>Amount</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Amount"
                                            value={expense.amount.toString()}
                                            keyboardType="numeric"
                                            onChangeText={(text) => handleInputChange('amount', text)}
                                        />
                                    </View>
    
                                    <View style={styles.currencyContainer}>
                                        <Text style={styles.inputLabel}>Currency</Text>
                                        <View style={styles.pickerWrapper}>
                                        <CustomDropdown
                                            selectedValue={currency}
                                            onValueChange={setCurrency}
                                            items={items}
                                        />
                                        </View>
                                    </View>
                                </View>
    
                                <Text style={styles.inputLabel}>Upload Receipt</Text>
                                {expense.receipt ? (
                                    <View style={styles.imageContainer}>
                                        <Text style={styles.receiptFilename}>{expense.receipt.uri.split('/').pop()}</Text>
                                        <TouchableOpacity onPress={pickImage}>
                                            <Text style={styles.replaceButtonText}>Replace</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                        <Text style={styles.plusSign}>+</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                    </Animatable.View>
    
                    {!isSuccess && (
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit Expense</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    mainContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    successCard: {
        backgroundColor: '#28A745',
        justifyContent: 'center',
        marginTop: 40,
        alignItems: 'center',
    },
    successContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        marginTop: 80,
        transform: [{ translateX: -40 }, { translateY: -40 }],
    },
    anotherButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '45%',
    },
    addExpenseButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '45%',
    },
    anotherButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    pickerWrapper: {
        borderColor: 'white',
        overflow: 'hidden',
        marginBottom: 15,
    },
    picker: {
        height: 40,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        color: '#000',
    },
    pickerItem: {
        height: 40,
        color: '#000',
        backgroundColor: 'white',
        borderRadius: 8,
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amountContainer: {
        flex: 2,
        marginRight: 20,
    },
    currencyContainer: {
        flex: 1,
    },
    imagePicker: {
        backgroundColor: '#F0F0F0',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
    },
    plusSign: {
        fontSize: 40,
        color: '#D3D3D3',
    },
    imageContainer: {
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    receiptFilename: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    replaceButtonText: {
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    submitButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CreateExpenseScreen;
