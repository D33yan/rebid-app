import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    StatusBar, 
    Dimensions
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming 
} from 'react-native-reanimated';
import Svg, { Rect, Defs, RadialGradient, Stop, LinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

export function Splash({ navigation }) {
    // 1. Entrance Animations using Reanimated Shared Values
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withTiming(1.0, { duration: 600 });
        opacity.value = withTiming(1.0, { duration: 600 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* 2. Full-bleed Radial Gradient Background */}
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
                
                {/* Animated Logo Entrance Block */}
                <Animated.View style={[styles.logoBlock, animatedStyle]}>
                    <Text style={styles.logoText}>REBID</Text>
                    
                    {/* Editorial diamond decorative divider line */}
                    <View style={styles.dividerRow}>
                        <View style={styles.line} />
                        <View style={styles.diamond} />
                        <View style={styles.line} />
                    </View>

                    <Text style={styles.tagline}>Nigeria's Premium Auction Marketplace</Text>
                </Animated.View>

                {/* Stacks of Sign In / Create Account Buttons */}
                <View style={styles.buttonStack}>
                    {/* Primary Sign In Coral Gradient CTA */}
                    <TouchableOpacity 
                        style={styles.signInBtn}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('sign-in')}>
                        <Svg height="56" width={width - 40} style={StyleSheet.absoluteFillObject}>
                            <Defs>
                                <LinearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#FF6B35" />
                                    <Stop offset="100%" stopColor="#FF4500" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" rx="14" fill="url(#coralGrad)" />
                        </Svg>
                        <Text style={styles.signInBtnText}>Sign In</Text>
                    </TouchableOpacity>

                    {/* Ghost Outline Create Account CTA */}
                    <TouchableOpacity 
                        style={styles.createAccountBtn}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('create-account')}>
                        <Text style={styles.createAccountText}>Create Account</Text>
                    </TouchableOpacity>

                    {/* Browse as Guest plain muted link */}
                    <TouchableOpacity 
                        style={styles.guestLink}
                        onPress={() => navigation.navigate('my-home', { isGuest: true })}>
                        <Text style={styles.guestText}>Browse as Guest</Text>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 40,
        zIndex: 10,
    },
    logoBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#F1F5F9',
        letterSpacing: 6,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 140,
        marginVertical: 16,
        gap: 6,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    diamond: {
        width: 6,
        height: 6,
        backgroundColor: '#FF6B35',
        transform: [{ rotate: '45deg' }],
    },
    tagline: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
    },
    buttonStack: {
        width: '100%',
        gap: 16,
        marginBottom: 20,
    },
    signInBtn: {
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
    signInBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    createAccountBtn: {
        width: '100%',
        height: 56,
        borderWidth: 1.5,
        borderColor: '#FF6B35',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    createAccountText: {
        color: '#FF6B35',
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    guestLink: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 48,
    },
    guestText: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '700',
    }
});
