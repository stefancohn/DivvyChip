import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { defDistributions, useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import { useEffect, useState } from 'react';
import RectangleButton from '../components/rectangleButton';
import CircleButton from '../components/CircleButton';
import { chipDistribution, getDistributionVariants} from '@/backend/chipDivsionAlgo';
import { colorMap } from '@/backend/constants';

export default function Payout() {
    return(
        <View>
            
        </View>
    );
}