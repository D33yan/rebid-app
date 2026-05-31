import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    TextInput, 
    Platform, 
    StatusBar,
    Animated,
    Dimensions,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utilities/api';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export function Verification({ route, navigation }) {
    const emailAddress = route.params?.email || 'julian.sterling@rebid.com';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [countdown, setCountdown] = useState(60);

    const [pulseAnim] = useState(new Animated.Value(0.3));
    const borderScales = useRef([
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1)
    ]).current;

    const inputRefs = useRef([]);

    useEffect(() => {
        // Ticking Resend Timer
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Blinking pulse overlay
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.8,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();

        return () => clearInterval(timer);
    }, []);

    const animateBorder = (index, focus) => {
        Animated.timing(borderScales[index], {
            toValue: focus ? 1.08 : 1,
            duration: 200,
            useNativeDriver: true
        }).start();
    };

    const handleOtpChange = (text, idx) => {
        if (text.length > 1) return;
        const newOtp = [...otp];
        newOtp[idx] = text;
        setOtp(newOtp);

        // Auto-advance
        if (text && idx < 5) {
            inputRefs.current[idx + 1].focus();
            setFocusedIndex(idx + 1);
        }
    };

    const handleKeyPress = (e, idx) => {
        // Go back on delete
        if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1].focus();
            setFocusedIndex(idx - 1);
        }
    };

    const handleVerify = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) {
            Alert.alert("Incomplete Code", "Please enter the entire 6-digit verification code.");
            return;
        }
        try {
            const userId = route.params?.userId;
            await api.auth.verifyOtp(fullOtp);
            navigation.navigate('onboarding', { userId });
        } catch (e) {
            Alert.alert("Verification Failed", e.message || "Failed to verify OTP code.");
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.container}>
                
                {/* Back button */}
                <TouchableOpacity 
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F1F5F9" />
                </TouchableOpacity>

                <View style={styles.content}>
                    
                    {/* Pulsing Envelope badge overlay */}
                    <View style={styles.iconCircle}>
                        <Animated.View style={[styles.pulseCircle, { opacity: pulseAnim }]} />
                        <Ionicons name="mail-open-outline" size={32} color="#FF6B35" />
                    </View>

                    <Text style={styles.headline}>Check Your Email</Text>
                    <Text style={styles.subtext}>
                        We sent a verification link to <Text style={styles.emailHighlight}>{emailAddress}</Text> — enter the 6-digit code below to activate your account.
                    </Text>

                    {/* 6-digit OTP input grid (52x60px each) */}
                    <View style={styles.otpGrid}>
                        {otp.map((val, idx) => {
                            const isFocused = focusedIndex === idx;
                            return (
                                <Animated.View 
                                    key={idx}
                                    style={[
                                        styles.otpBoxWrapper, 
                                        { transform: [{ scale: borderScales[idx] }] },
                                        isFocused && styles.focusedOtpBoxWrapper
                                    ]}>
                                    <TextInput
                                        ref={el => inputRefs.current[idx] = el}
                                        value={val}
                                        onChangeText={(text) => handleOtpChange(text, idx)}
                                        onKeyPress={(e) => handleKeyPress(e, idx)}
                                        onFocus={() => {
                                            setFocusedIndex(idx);
                                            animateBorder(idx, true);
                                        }}
                                        onBlur={() => animateBorder(idx, false)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        style={styles.otpBoxInput}
                                        selectionColor="#FF6B35"
                                    />
                                </Animated.View>
                            );
                        })}
                    </View>

                </View>

                {/* Submits and tickers */}
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.verifyBtn}
                        activeOpacity={0.9}
                        onPress={handleVerify}>
                        <Svg height="52" width={width - 40} style={StyleSheet.absoluteFillObject}>
                            <Defs>
                                <LinearGradient id="coralVerify" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#FF6B35" />
                                    <Stop offset="100%" stopColor="#FF4500" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" rx="14" fill="url(#coralVerify)" />
                        </Svg>
                        <Text style={styles.verifyText}>Verify Email</Text>
                    </TouchableOpacity>

                    {/* Resend Code countdown timer directly below grid */}
                    <View style={styles.resendRow}>
                        <Text style={styles.resendText}>Didn't receive code? </Text>
                        {countdown > 0 ? (
                            <Text style={styles.countdownText}>Resend in 0:{countdown < 10 ? `0${countdown}` : countdown}</Text>
                        ) : (
                            <TouchableOpacity onPress={() => setCountdown(60)}>
                                <Text style={styles.resendLink}>Resend Code</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity 
                        style={styles.wrongEmailBtn}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.wrongEmailText}>Wrong email? Go back</Text>
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
        paddingVertical: 30,
    },
    backBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 10 : 20,
    },
    content: {
        alignItems: 'center',
        marginTop: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 107, 53, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 24,
    },
    pulseCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
        position: 'absolute',
    },
    headline: {
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        fontWeight: 'bold',
        color: '#F1F5F9',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtext: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
        paddingHorizontal: 16,
    },
    emailHighlight: {
        color: '#F1F5F9',
        fontWeight: '700',
    },
    otpGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 40,
    },
    otpBoxWrapper: {
        width: 52,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#111827',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0A0F1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    focusedOtpBoxWrapper: {
        borderColor: '#FF6B35',
        shadowColor: '#FF6B35',
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    otpBoxInput: {
        width: '100%',
        height: '100%',
        color: '#F1F5F9',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
    },
    footer: {
        width: '100%',
        gap: 16,
        marginBottom: 20,
    },
    verifyBtn: {
        width: '100%',
        height: 52,
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
    verifyText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    resendText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    countdownText: {
        fontSize: 12,
        color: '#FF6B35',
        fontWeight: '700',
    },
    resendLink: {
        fontSize: 12,
        color: '#FF6B35',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    wrongEmailBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    wrongEmailText: {
        color: 'rgba(255, 255, 255, 0.45)',
        fontSize: 12,
        fontWeight: '600',
    }
});
