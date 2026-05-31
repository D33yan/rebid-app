import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    StatusBar, 
    Platform,
    Dimensions
} from "react-native";
import { theme } from "../config/theme";
import Svg, { Rect, Defs, RadialGradient, Stop, LinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

export function Starter({ navigation }) {
    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* 1. Radial Background */}
            <View style={StyleSheet.absoluteFillObject}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <RadialGradient id="radial" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                            <Stop offset="0%" stopColor="#1B2D42" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#0A0F1E" stopOpacity="1" />
                        </RadialGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#radial)" />
                </Svg>
            </View>

            <View style={styles.container}>
                {/* 2. Frosted Content Card Surface */}
                <View style={styles.contentCard}>
                    <Text style={styles.brandName}>Rebid</Text>
                    <Text style={styles.subTitle}>
                        Exclusively curated premium auctions. Elevate your luxury portfolio on the go.
                    </Text>
                    
                    {/* Primary CTA button with Coral Gradient */}
                    <TouchableOpacity 
                        style={styles.continueBtn}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('my-home')}>
                        <Svg height="56" width={width * 0.8} style={StyleSheet.absoluteFillObject}>
                            <Defs>
                                <LinearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#FF6B35" />
                                    <Stop offset="100%" stopColor="#FF4500" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" rx="14" fill="url(#coralGrad)" />
                        </Svg>
                        <Text style={styles.btnLabel}>Enter Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 60,
    },
    contentCard: {
        width: '90%',
        backgroundColor: '#111827',
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        paddingHorizontal: 24,
        paddingVertical: 36,
        alignItems: 'center',
        shadowColor: '#0A0F1E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
    },
    brandName: {
        fontSize: 44,
        color: '#F1F5F9',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subTitle: {
        fontSize: 15,
        color: '#CBD5E1',
        fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    continueBtn: {
        marginTop: 32,
        width: '100%',
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 6,
        position: 'relative',
    },
    btnLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});