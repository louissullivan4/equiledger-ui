import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import GenericTopBar from '../components/GenericTopBar';
import { StackNavigationProp } from '@react-navigation/stack';

interface Expense {
    id: number;
    user_id: number;
    title: string;
    description: string;
    category: string;
    amount: number;
    currency: string;
    receipt_image_url: string;
    created_at: string;
    updated_at: string;
}

interface ExpenseScreenProps {
    navigation: StackNavigationProp<any>;
    setUser: React.Dispatch<React.SetStateAction<null>>;
}

const ExpenseScreen: React.FC<ExpenseScreenProps> = ({ navigation, setUser }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [expandedExpenseIds, setExpandedExpenseIds] = useState<number[]>([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all time');
    const [sortOption, setSortOption] = useState<string>('date-latest');

    const toggleExpand = (id: number) => {
        if (expandedExpenseIds.includes(id)) {
            setExpandedExpenseIds(expandedExpenseIds.filter(expenseId => expenseId !== id));
        } else {
            setExpandedExpenseIds([...expandedExpenseIds, id]);
        }
    };

    const resetFilters = () => {
        setSelectedDateFilter('all time');
        setSortOption('date-latest');
    };

    const filteredAndSortedExpenses = expenses
        .filter(expense => {

            const now = new Date();
            const createdAt = new Date(expense.created_at);

            switch (selectedDateFilter) {
                case 'day':
                    return createdAt.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now);
                    weekAgo.setDate(now.getDate() - 7);
                    return createdAt >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(now.getMonth() - 1);
                    return createdAt >= monthAgo;
                case 'year':
                    const yearAgo = new Date(now);
                    yearAgo.setFullYear(now.getFullYear() - 1);
                    return createdAt >= yearAgo;
                default:
                    return true;
            }
        })
        .sort((a, b) => {
            if (sortOption === 'date-latest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortOption === 'date-earliest') {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortOption === 'amount-high-low') {
                return b.amount - a.amount;
            } else if (sortOption === 'amount-low-high') {
                return a.amount - b.amount;
            }
            return 0;
        });

    return (
        <View style={styles.container}>
            <GenericTopBar heightPercentage={8} title={'Expenses'} />
            <ScrollView contentContainerStyle={styles.mainContainer}>
                {filteredAndSortedExpenses.map((expense) => (
                    <TouchableOpacity
                        key={expense.id}
                        style={styles.card}
                        onPress={() => toggleExpand(expense.id)}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{expense.title}</Text>
                            <Text style={styles.amount}>{expense.amount} {expense.currency}</Text>
                        </View>
                        <Text style={styles.date}>{new Date(expense.created_at).toLocaleDateString()}</Text>
                        {expandedExpenseIds.includes(expense.id) && (
                            <View style={styles.expandedSection}>
                                <Text style={styles.description}>{expense.description}</Text>
                                <Text style={styles.category}>Category: {expense.category}</Text>
                                {/* You can add an image or other content here */}
                                {/* <Image source={{ uri: expense.receipt_image_url }} style={styles.receiptImage} /> */}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setIsFilterModalVisible(true)}
                >
                    <Text style={styles.filterButtonText}>Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addExpenseButton}
                    onPress={() => navigation.navigate('Expense')}
                >
                    <Text style={styles.filterButtonText}>Add Expense</Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isFilterModalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter Expenses</Text>
                        {/* Filter by Date */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalLabel}>Date:</Text>
                            <Button 
                                title={`All Time ${selectedDateFilter === 'all time' ? '(Selected)' : ''}`} 
                                onPress={() => setSelectedDateFilter('all time')} 
                            />
                            <Button 
                                title={`Day ${selectedDateFilter === 'day' ? '(Selected)' : ''}`} 
                                onPress={() => setSelectedDateFilter('day')} 
                            />
                            <Button 
                                title={`Week ${selectedDateFilter === 'week' ? '(Selected)' : ''}`} 
                                onPress={() => setSelectedDateFilter('week')} 
                            />
                            <Button 
                                title={`Month ${selectedDateFilter === 'month' ? '(Selected)' : ''}`} 
                                onPress={() => setSelectedDateFilter('month')} 
                            />
                            <Button 
                                title={`Year ${selectedDateFilter === 'year' ? '(Selected)' : ''}`} 
                                onPress={() => setSelectedDateFilter('year')} 
                            />
                        </View>

                        {/* Sort Options */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalLabel}>Sort by:</Text>
                            <Button 
                                title={`Date: Latest to Earliest ${sortOption === 'date-latest' ? '(Selected)' : ''}`} 
                                onPress={() => setSortOption('date-latest')} 
                            />
                            <Button 
                                title={`Date: Earliest to Latest ${sortOption === 'date-earliest' ? '(Selected)' : ''}`} 
                                onPress={() => setSortOption('date-earliest')} 
                            />
                            <Button 
                                title={`Amount: High to Low ${sortOption === 'amount-high-low' ? '(Selected)' : ''}`} 
                                onPress={() => setSortOption('amount-high-low')} 
                            />
                            <Button 
                                title={`Amount: Low to High ${sortOption === 'amount-low-high' ? '(Selected)' : ''}`} 
                                onPress={() => setSortOption('amount-low-high')} 
                            />
                        </View>

                        <View style={styles.buttonGroup}>
                            <Button title="Reset" onPress={resetFilters} />
                            <Button title="Close" onPress={() => setIsFilterModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'left',
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007BFF',
    },
    date: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    expandedSection: {
        marginTop: 15,
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    category: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    filterButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '45%',
    },
    addExpenseButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '45%',
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    },
    modalContent: {
        width: '85%', // Slightly wider for better space utilization
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20, // Increased margin for better separation
        textAlign: 'center', // Centered title
        color: '#333',
    },
    modalSection: {
        marginBottom: 20, // Increased margin for cleaner spacing
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10, // Added space between label and buttons
        color: '#333',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Distribute buttons evenly
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    resetButton: {
        backgroundColor: '#FF6347', // Different color for the reset button to make it stand out
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#CCCCCC', // Grey for the close button
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});


export default ExpenseScreen;