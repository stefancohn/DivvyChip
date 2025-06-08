import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import {images, } from "../../backend/constants"

export default function PremiumButton() {
    const handlePress = () => {
        alert('bruh');
    }
    
    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Image source={images.premium} resizeMode="stretch" style={styles.image} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 25,
    position: 'absolute'
  },
  image: {
    width: 115,
    height: 40,
  },
});