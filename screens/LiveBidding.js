import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    Image, 
    TouchableOpacity, 
    FlatList, 
    ScrollView, 
    StatusBar, 
    Platform, 
    Alert,
    Dimensions,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';
import { api } from '../utilities/api';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export function LiveBidding({ route, navigation }) {
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();

    // Resolve product or fallback
    const { product } = route.params || {
        product: {
            id: '1',
            title: 'Lagos Modern Mansionette',
            description: 'Stunning 5-bedroom luxury smart-home located in premium Lekki Phase 1, Lagos.',
            image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
            current_price: 145000000,
            initial_price: 120000000,
            bid_increment: 5000000,
            category: 'Real Estate',
            end_date: new Date(Date.now() + 2 * 3600 * 1000).toISOString()
        }
    };

    const imageUrl = product.image_url || product.imageUr || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';
    const minIncrement = Number(product.bid_increment || product.bidIncrement || 100000);
    const [currentBidPrice, setCurrentBidPrice] = useState(Number(product.current_price || product.currentBid || product.initial_price));
    
    // Calculated +5% Quick Bid amount
    const quickBidAmount = Math.round(currentBidPrice * 1.05);
    const [bidAmount, setBidAmount] = useState(String(currentBidPrice + minIncrement));
    const [isFavorited, setIsFavorited] = useState(false);

    // Ticking countdown states
    const [hours, setHours] = useState('02');
    const [minutes, setMinutes] = useState('45');
    const [seconds, setSeconds] = useState('07');

    useEffect(() => {
        let totalSeconds = 2 * 3600 + 45 * 60 + 7;
        const targetDate = product.end_date || product.endDate;
        if (targetDate) {
            const diffMs = new Date(targetDate).getTime() - Date.now();
            if (diffMs > 0) {
                totalSeconds = Math.floor(diffMs / 1000);
            }
        }

        const interval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(interval);
                return;
            }
            totalSeconds -= 1;
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;

            setHours(h < 10 ? `0${h}` : `${h}`);
            setMinutes(m < 10 ? `0${m}` : `${m}`);
            setSeconds(s < 10 ? `0${s}` : `${s}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [product.end_date, product.endDate]);

    // Bidding attempts history ledger
    const [bidLogs, setBidLogs] = useState([
        { id: '1', name: 'Garba Audu', amount: currentBidPrice, time: '1m ago', status: 'WINNING' },
        { id: '2', name: 'Elena Rostova', amount: currentBidPrice - minIncrement, time: '3m ago', status: 'OUTBID' },
        { id: '3', name: 'Sarah Williams', amount: currentBidPrice - (minIncrement * 2), time: '6m ago', status: 'OUTBID' }
    ]);

    // Handle transactional API bid placement
    const handlePlaceBid = async (amountToBid) => {
        const bidVal = Number(amountToBid || bidAmount);
        const minRequired = currentBidPrice + minIncrement;
        
        if (isNaN(bidVal) || bidVal < minRequired) {
            Alert.alert("Invalid Bid", `Minimum bid amount required is ₦${CommaSepNum(minRequired)}.`);
            return;
        }

        try {
            const data = await api.bids.place(product.id, bidVal);
            setCurrentBidPrice(data.currentBid);
            setBidAmount(String(Number(data.currentBid) + minIncrement));
            
            // Push leading bid attempt onto visual ledger
            const newLog = {
                id: Math.random().toString(),
                name: 'Chidi (You)',
                amount: bidVal,
                time: 'Just now',
                status: 'WINNING'
            };
            
            // Map previous win to outbid state
            const updatedLogs = bidLogs.map(log => ({
                ...log,
                status: 'OUTBID'
            }));

            setBidLogs([newLog, ...updatedLogs]);
            showToast('success', 'Bidding Registered', data.message || `Your bid of ₦${CommaSepNum(bidVal)} has been placed successfully!`);
        } catch (e) {
            console.warn("Transactional bid placement failed:", e.message);
            showToast('outbid', 'Bidding Failed', e.message || 'Transactional bid placement failed.');
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}>
                
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>
                    
                    {/* 1. Hero Image: Top 40% of screen */}
                    <View style={styles.imageHeaderWrapper}>
                        <Image source={{ uri: imageUrl }} style={styles.fullImage} />
                        
                        {/* Custom SVG bottom fading mask */}
                        <View style={StyleSheet.absoluteFillObject}>
                            <Svg height="100%" width="100%">
                                <Defs>
                                    <LinearGradient id="heroMask" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#0A0F1E" stopOpacity="0.4" />
                                        <Stop offset="70%" stopColor="#0A0F1E" stopOpacity="0" />
                                        <Stop offset="100%" stopColor="#0A0F1E" stopOpacity="0.9" />
                                    </LinearGradient>
                                </Defs>
                                <Rect width="100%" height="100%" fill="url(#heroMask)" />
                            </Svg>
                        </View>

                        {/* Pulsing Live Badge Overlay */}
                        <View style={styles.liveBadge}>
                            <View style={styles.pulsingDot} />
                            <Text style={styles.liveBadgeText}>LIVE</Text>
                        </View>

                        {/* Top Right Countdown Badge */}
                        <View style={styles.timerOverlayBadge}>
                            <Ionicons name="time" size={12} color="#FFFFFF" />
                            <Text style={styles.timerOverlayText}>{hours}:{minutes}:{seconds}</Text>
                        </View>

                        {/* Back and favorite controls overlay */}
                        <View style={styles.headerOverlayRow}>
                            <TouchableOpacity 
                                style={styles.overlayBtn} 
                                onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={20} color="#F1F5F9" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.overlayBtn} 
                                onPress={() => {
                                    setIsFavorited(!isFavorited);
                                    showToast('success', isFavorited ? 'Watchlist Removed' : 'Watchlist Added', 'Updated Lot list preferences.');
                                }}>
                                <Ionicons 
                                    name={isFavorited ? "heart" : "heart-outline"} 
                                    size={20} 
                                    color={isFavorited ? '#FF4560' : '#F1F5F9'} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 2. Bidding Terminal Card: #1C2333, rises over the image */}
                    <View style={styles.terminalContainer}>
                        
                        <View style={styles.terminalHeader}>
                            <Text style={styles.lotCategory}>{product.category || 'Luxury'}</Text>
                            <Text style={styles.assetName}>{product.title}</Text>
                            <Text style={styles.assetDesc}>{product.description || 'Certified luxury lot listed securely by Rebid verified seller.'}</Text>
                        </View>

                        {/* Highest Bidder Details Card Row */}
                        <View style={styles.highestBidderCard}>
                            <View style={styles.bidderProfileRow}>
                                <Image source={require('../assets/user.jpg')} style={styles.bidderAvatar} />
                                <View>
                                    <Text style={styles.bidderLabel}>LEADING BIDDER</Text>
                                    <Text style={styles.bidderName}>{bidLogs[0]?.name || 'Garba Audu'}</Text>
                                </View>
                            </View>
                            <Text style={styles.bidderAmount}>₦{CommaSepNum(currentBidPrice)}</Text>
                        </View>

                        {/* Next Min Bid requirements */}
                        <View style={styles.minBidRow}>
                            <Text style={styles.minBidLabel}>MINIMUM REQUIRED NEXT BID</Text>
                            <Text style={styles.minBidVal}>₦{CommaSepNum(currentBidPrice + minIncrement)}</Text>
                        </View>

                        {/* +5% Quick Bid full-width Coral Gradient CTA */}
                        <TouchableOpacity 
                            style={styles.quickBidBtn}
                            activeOpacity={0.9}
                            onPress={() => handlePlaceBid(quickBidAmount)}>
                            <Svg height="56" width={width - 32} style={StyleSheet.absoluteFillObject}>
                                <Defs>
                                    <LinearGradient id="coralQuick" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <Stop offset="0%" stopColor="#FF6B35" />
                                        <Stop offset="100%" stopColor="#FF4500" />
                                    </LinearGradient>
                                </Defs>
                                <Rect width="100%" height="100%" rx="14" fill="url(#coralQuick)" />
                            </Svg>
                            <Text style={styles.quickBidText}>⚡ QUICK BID ₦{CommaSepNum(quickBidAmount)} (+5%)</Text>
                        </TouchableOpacity>

                        {/* Custom Input below with active coral state */}
                        <View style={styles.customInputRow}>
                            <Text style={styles.customLabel}>OR SUBMIT CUSTOM BID (₦)</Text>
                            <TextInput 
                                style={styles.customInput}
                                value={bidAmount}
                                onChangeText={setBidAmount}
                                keyboardType="number-pad"
                                selectionColor="#FF6B35"
                            />
                            <TouchableOpacity 
                                style={styles.customSubmitBtn}
                                activeOpacity={0.8}
                                onPress={() => handlePlaceBid()}>
                                <Text style={styles.customSubmitText}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bid History Ledger flat list */}
                        <View style={styles.ledgerBlock}>
                            <Text style={styles.ledgerTitle}>Bidding Log History</Text>
                            {bidLogs.map((log) => {
                                const isWin = log.status === 'WINNING';
                                return (
                                    <View 
                                        key={log.id} 
                                        style={[
                                            styles.ledgerRow, 
                                            isWin ? styles.winningRow : styles.outbidRow
                                        ]}>
                                        <View style={styles.ledgerBidderBlock}>
                                            <Image source={require('../assets/user.jpg')} style={styles.ledgerAvatar} />
                                            <View>
                                                <Text style={styles.ledgerName}>{log.name}</Text>
                                                <Text style={styles.ledgerTime}>{log.time}</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.ledgerAmount, { color: isWin ? '#00D97E' : '#FF4560' }]}>
                                            ₦{CommaSepNum(log.amount)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageHeaderWrapper: {
        height: height * 0.4,
        width: '100%',
        position: 'relative',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlayRow: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    overlayBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: 'rgba(10, 15, 30, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B35',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 6,
    },
    pulsingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    liveBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    timerOverlayBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(10, 15, 30, 0.75)',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
    },
    timerOverlayText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    terminalContainer: {
        backgroundColor: '#1C2333',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        padding: 16,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    terminalHeader: {
        marginBottom: 20,
    },
    lotCategory: {
        fontSize: 11,
        color: '#FF6B35',
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    assetName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#F1F5F9',
        marginTop: 4,
        letterSpacing: -0.5,
    },
    assetDesc: {
        fontSize: 13,
        color: '#CBD5E1',
        lineHeight: 20,
        marginTop: 8,
    },
    highestBidderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 14,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        marginBottom: 20,
    },
    bidderProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    bidderAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
    },
    bidderLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 0.5,
    },
    bidderName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#F1F5F9',
        marginTop: 2,
    },
    bidderAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#00D97E',
    },
    minBidRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    minBidLabel: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    minBidVal: {
        fontSize: 14,
        color: '#F1F5F9',
        fontWeight: '700',
    },
    quickBidBtn: {
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
        marginBottom: 24,
    },
    quickBidText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    customInputRow: {
        marginBottom: 24,
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 14,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    customLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    customInput: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#F1F5F9',
        paddingHorizontal: 12,
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: '#0A0F1E',
        marginBottom: 12,
    },
    customSubmitBtn: {
        height: 44,
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customSubmitText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    ledgerBlock: {
        marginTop: 10,
    },
    ledgerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: 12,
        letterSpacing: -0.2,
    },
    ledgerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111827',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    winningRow: {
        borderLeftWidth: 3,
        borderLeftColor: '#00D97E',
    },
    outbidRow: {
        borderLeftWidth: 3,
        borderLeftColor: '#FF4560',
    },
    ledgerBidderBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    ledgerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    ledgerName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#F1F5F9',
    },
    ledgerTime: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },
    ledgerAmount: {
        fontSize: 14,
        fontWeight: '700',
    }
});
