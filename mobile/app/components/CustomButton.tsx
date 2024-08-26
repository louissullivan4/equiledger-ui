import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    iconName?: string;
    fontSize?: number; // Optional font size
    backgroundColor?: string; // Optional background color
    fontColor?: string; // Optional font color
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    iconName,
    fontSize = 18, // Default font size
    backgroundColor = 'white', // Default background color
    fontColor = '#B59CE0', // Default font color
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]} // Apply background color
            onPress={onPress}
        >
            {iconName && (
                <MaterialIcons name={iconName} size={30} color={fontColor} style={styles.icon} />
            )}
            <Text style={[styles.buttonText, { fontSize, color: fontColor }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '48%', // Ensures two buttons per row with some space between them
        paddingVertical: 15,
        borderRadius: 8, // Curved borders
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F0F0F0', // Optional: shadow for a subtle 3D effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2, // Android equivalent of shadow
        padding: 15,
        flexDirection: 'row',
    },
    buttonText: {
        fontFamily: 'Inter', // Custom font
    },
    icon: {
        marginRight: 8,
        right: 10,
    },
});

export default CustomButton;