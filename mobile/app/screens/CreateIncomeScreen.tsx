import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    TouchableOpacity, 
    Alert, 
    Keyboard, 
    TouchableWithoutFeedback, 
    ActivityIndicator 
} from 'react-native';
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

interface Income {
    title: string;
    description: string;
    category: string;
    amount: number | string;
    currency: string;
    receipt: any;
}

interface CreateIncomeScreenProps {
    navigation: StackNavigationProp<any>;
    user: User;
    route?: any;
}

const CreateIncomeScreen: React.FC<CreateIncomeScreenProps> = ({ navigation, user, route }) => {
    const [income, setIncome] = useState<Income>({
        title: '',
        description: '',
        category: 'income',
        amount: '',
        currency: 'EUR',
        receipt: null,
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useFocusEffect(
        React.useCallback(() => {
            setIncome({
                title: '',
                description: '',
                category: 'income',
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
            "Upload Documentation",
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
            setIncome({ ...income, receipt: result.assets[0] });
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
            setIncome({ ...income, receipt: result.assets[0] });
        }
    };

    const handleInputChange = (key: keyof Income, value: any) => {
        if (key === 'amount') {
            if (/^\d*\.?\d*$/.test(value)) {
                setIncome({ ...income, [key]: value });
            }
        } else {
            setIncome({ ...income, [key]: value });
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);  // Start loading
        const formData = new FormData();
    
        formData.append('title', income.title);
        formData.append('description', income.description);
        formData.append('category', income.category);
        formData.append('amount', income.amount.toString());
        formData.append('currency', income.currency);
    
        if (income.receipt) {
            const fileUri = income.receipt.uri;
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
            const response = await axios.post(`${SERVER_URL}/income`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response from server:', response.data);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'There was an issue creating your income. Please try again.');
        } finally {
            setIsLoading(false);  // Stop loading
        }
    };

    const [currency, setCurrency] = useState('EUR');
    const items = [
        { label: 'Euro', value: 'EUR' },
        { label: 'US Dollar', value: 'USD' },
        { label: 'British Pound', value: 'GBP' },
        { label: 'Japanese Yen', value: 'JPY' },
        { label: 'Canadian Dollar', value: 'CAD' },
    ];
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <GenericTopBar heightPercentage={9} title={'New Income'} />
                <View style={styles.mainContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#28A745" />
                            <Text style={styles.loadingText}>Submitting Income...</Text>
                        </View>
                    ) : (
                        <Animatable.View
                            animation={isSuccess ? "fadeIn" : undefined}
                            duration={2000}
                            style={[styles.card, isSuccess && styles.successCard]}
                        >
                            {isSuccess ? (
                                <View>
                                    <Animatable.View
                                        animation="bounceIn"
                                        duration={600}
                                        style={styles.successContainer}
                                    >
                                        <Icon name="checkmark-circle" size={100} color="#FFF" />
                                    </Animatable.View>
                                    <View style={styles.buttonGroup}>
                                        <TouchableOpacity
                                            style={styles.anotherButton}
                                            onPress={() => {
                                                setIncome({
                                                    title: '',
                                                    description: '',
                                                    category: 'income',
                                                    amount: '',
                                                    currency: 'EUR',
                                                    receipt: null,
                                                });
                                                setIsSuccess(false);
                                            }}
                                        >
                                            <Text style={styles.anotherButtonText}>Add Another Income</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.addExpenseButton}
                                            onPress={() => navigation.navigate('Income')}
                                        >
                                            <Text style={styles.anotherButtonText}>View Income</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.inputLabel}>Title</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Income title"
                                        value={income.title}
                                        onChangeText={(text) => handleInputChange('title', text)}
                                    />

                                    <Text style={styles.inputLabel}>Description</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Income description"
                                        value={income.description}
                                        onChangeText={(text) => handleInputChange('description', text)}
                                    />

                                    <View style={styles.inlineContainer}>
                                        <View style={styles.amountContainer}>
                                            <Text style={styles.inputLabel}>Amount</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Amount"
                                                value={income.amount.toString()}
                                                keyboardType="numeric"
                                                onChangeText={(text) => handleInputChange('amount', text)}
                                            />
                                        </View>

                                        <View style={styles.currencyContainer}>
                                            <Text style={styles.inputLabel}>Currency</Text>
                                            <View style={styles.pickerWrapper}>
                                                <CustomDropdown
                                                    selectedValue={currency}
                                                    onValueChange={(value) => {
                                                        setCurrency(value);
                                                        handleInputChange('currency', value);
                                                    }}
                                                    items={items}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={styles.inputLabel}>Upload Documentation</Text>
                                    {income.receipt ? (
                                        <View style={styles.imageContainer}>
                                            <Text style={styles.receiptFilename}>{income.receipt.uri.split('/').pop()}</Text>
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
                    )}

                    {!isSuccess && !isLoading && (
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit Income</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    mainContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        flex: 1, // Ensure main container takes up available space
        justifyContent: 'center', // Center content vertically when loading
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#333',
    },
});

export default CreateIncomeScreen;