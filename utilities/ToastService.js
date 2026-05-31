import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastContext = createContext({
    showToast: (type, title, message) => {},
});

const { width } = Dimensions.get('window');

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null); // { type: 'success'|'info'|'outbid', title: '', message: '' }
    const [animation] = useState(new Animated.Value(-120)); // Hide above screen

    const showToast = (type, title, message) => {
        setToast({ type, title, message });
        
        // Slide down
        Animated.spring(animation, {
            toValue: Platform.OS === 'ios' ? 44 : 24, // Slide to top of safe area
            useNativeDriver: true,
            friction: 5,
        }).start();
    };

    const hideToast = () => {
        // Slide up
        Animated.timing(animation, {
            toValue: -150,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setToast(null);
        });
    };

    // Auto-hide unless it is highly critical like outbid
    useEffect(() => {
        if (toast && toast.type !== 'outbid') {
            const timer = setTimeout(() => {
                hideToast();
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Animated.View 
                    style={[
                        styles.toastContainer, 
                        toast.type === 'success' && styles.successToast,
                        toast.type === 'info' && styles.infoToast,
                        toast.type === 'outbid' && styles.outbidToast,
                        { transform: [{ translateY: animation }] }
                    ]}>
                    
                    <View style={styles.toastContent}>
                        <View style={styles.iconWrapper}>
                            <Ionicons 
                                name={
                                    toast.type === 'success' ? 'checkmark-circle-outline' :
                                    toast.type === 'outbid' ? 'alert-circle-outline' : 'information-circle-outline'
                                } 
                                size={toast.type === 'outbid' ? 28 : 22} 
                                color="#FFFFFF" 
                            />
                        </View>
                        <View style={styles.textWrapper}>
                            <Text style={[styles.title, toast.type === 'outbid' && styles.outbidTitle]}>
                                {toast.title}
                            </Text>
                            {toast.message ? (
                                <Text style={styles.message}>{toast.message}</Text>
                            ) : null}
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={hideToast}>
                            <Ionicons name="close" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 16,
        right: 16,
        zIndex: 9999,
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    successToast: {
        backgroundColor: '#FF6B35', // Specs: coral for success
    },
    infoToast: {
        backgroundColor: '#0D1B2A', // Specs: navy for general info
    },
    outbidToast: {
        backgroundColor: '#E11D48', // Specs: red outbid alerts (most urgent)
        left: 0,
        right: 0,
        borderRadius: 0,
        paddingTop: Platform.OS === 'ios' ? 32 : 16,
        paddingBottom: 20,
        paddingHorizontal: 20,
        top: -44, // Align to true top split full-screen overlay banner
    },
    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconWrapper: {
        marginRight: 12,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    outbidTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    message: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
        marginLeft: 8,
    }
});
