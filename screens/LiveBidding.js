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

const { width } = Dimensions.get('window');

export function LiveBidding({ route, navigation }) {
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();

    // Resolve product or fallback
    const { product } = route.params || {
        product: {
            id: '1',
            title: 'Retro Nebula X-1',
            desc: 'Extremely limited collector\'s hand-crafted mechanical galactic art piece featuring vintage brass dials and glowing vacuum tubes.',
            imageUr: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600',
            numberOfBids: 52,
            currentBid: 2450000,
            initialPrice: 1800000,
            bidIncrement: 10000,
            category: 'Gadgets',
            endsIn: '02:45:07'
        }
    };

    const minIncrement = product.bidIncrement || 10000;
    const [bidAmount, setBidAmount] = useState(String(product.currentBid + minIncrement));
    const [currentBidPrice, setCurrentBidPrice] = useState(product.currentBid);
    const [totalBidsCount, setTotalBidsCount] = useState(product.numberOfBids);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false); // Specs: expandable bid history

    // Ticking countdown states
    const [hours, setHours] = useState('02');
    const [minutes, setMinutes] = useState('45');
    const [seconds, setSeconds] = useState('07');

    useEffect(() => {
        let totalSeconds = 2 * 3600 + 45 * 60 + 7;
        if (product.endsIn && product.endsIn.includes(':')) {
            const parts = product.endsIn.split(':');
            if (parts.length === 3) {
                totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
            }
        } else {
            totalSeconds = 28 * 3600 + 15 * 60;
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
    }, [product.endsIn]);

    const [bidLogs, setBidLogs] = useState([
        { id: '1', name: 'Adebayo Johnson', amount: 2450000, time: '1m ago', rating: '4.7 ★' },
        { id: '2', name: 'Elena Rostova', amount: 2440000, time: '3m ago', rating: '4.9 ★' },
        { id: '3', name: 'Sarah Williams', amount: 2420000, time: '6m ago', rating: '4.8 ★' },
        { id: '4', name: 'Chinedu Obi', amount: 2400000, time: '12m ago', rating: '4.6 ★' }
    ]);

    const handlePlaceBid = () => {
        const bidVal = parseInt(bidAmount);
        const minRequired = currentBidPrice + minIncrement;
        
        if (isNaN(bidVal) || bidVal < minRequired) {
            Alert.alert("Invalid Bid", `Minimum bid amount required is ₦${CommaSepNum(minRequired)}.`);
            return;
        }

        const newLog = {
            id: (bidLogs.length + 1).toString(),
            name: 'Julian Sterling (You)',
            amount: bidVal,
            time: 'Just now',
            rating: '5.0 ★'
        };

        setBidLogs([newLog, ...bidLogs]);
        setCurrentBidPrice(bidVal);
        setTotalBidsCount(prev => prev + 1);
        setBidAmount(String(bidVal + minIncrement));

        showToast('success', 'Bidding Registered', `Your bid of ₦${CommaSepNum(bidVal)} has been placed successfully!`);
    };

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: isDarkMode ? '#060D14' : '#F7F7F8' }]}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}>
                
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>
                    
                    {/* Full-screen aspect image with back arrow overlay */}
                    <View style={styles.imageHeaderWrapper}>
                        <Image source={{ uri: product.imageUr }} style={styles.fullImage} />
                        
                        {/* Overlay back and favorite icons */}
                        <View style={styles.headerOverlayRow}>
                            <TouchableOpacity 
                                style={styles.overlayBtn} 
                                onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={22} color="#0D1B2A" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.overlayBtn} 
                                onPress={() => {
                                    setIsFavorited(!isFavorited);
                                    showToast('success', isFavorited ? 'Watchlist Removed' : 'Watchlist Added', 'Updated Lot list preferences.');
                                }}>
                                <Ionicons 
                                    name={isFavorited ? "heart" : "heart-outline"} 
                                    size={22} 
                                    color={isFavorited ? '#E11D48' : '#0D1B2A'} 
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.timerOverlayBadge}>
                            <Ionicons name="time" size={12} color="#FFFFFF" />
                            <Text style={styles.timerOverlayText}>{hours}:{minutes}:{seconds}</Text>
                        </View>
                    </View>

                    <View style={styles.container}>
                        
                        {/* Specs: Seller details below image (avatar + name + rating) */}
                        <View style={[styles.sellerCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                            <Image 
                                source={require('../assets/user.jpg')} 
                                style={styles.sellerAvatar} 
                            />
                            <View style={styles.sellerMeta}>
                                <Text style={[styles.sellerName, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>Alhaji Garba Audu</Text>
                                <Text style={styles.sellerRating}>Verified Premier Seller • 4.9 ★ (128 sales)</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.chatSellerBtn}
                                onPress={() => navigation.navigate('chat')}>
                                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FF6B35" />
                            </TouchableOpacity>
                        </View>

                        {/* Item Info block */}
                        <View style={styles.infoCard}>
                            <Text style={[styles.cardCategory, { color: '#FF6B35' }]}>
                                {product.category.toUpperCase()} • LOT #{product.id}
                            </Text>
                            <Text style={[styles.itemTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                {product.title}
                            </Text>
                            <Text style={styles.itemDescription}>
                                {product.desc || 'Certified authentic luxury lot. Comes complete with high-end certificate overlays, packaging, and premier mechanical verification papers.'}
                            </Text>
                        </View>

                        {/* Specs: Current Bid in large coral text & countdown */}
                        <View style={[styles.bidsCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                            <View style={styles.bidsHeader}>
                                <View>
                                    <Text style={styles.cardLabel}>CURRENT HIGHEST BID</Text>
                                    {/* Large Coral Text */}
                                    <Text style={styles.coralPrice}>
                                        ₦{CommaSepNum(currentBidPrice)}
                                    </Text>
                                </View>
                                <View style={styles.bidsBiddersBadge}>
                                    <Text style={styles.biddersText}>{totalBidsCount} active bidders</Text>
                                </View>
                            </View>

                            <View style={styles.cardDivider} />

                            <Text style={styles.countdownTitle}>LOT EXPIRATION COUNTDOWN</Text>
                            <View style={styles.timerGridRow}>
                                <View style={styles.timerBox}>
                                    <Text style={styles.timerBoxVal}>{hours}</Text>
                                    <Text style={styles.timerBoxUnit}>HRS</Text>
                                </View>
                                <Text style={styles.timerSep}>:</Text>
                                <View style={styles.timerBox}>
                                    <Text style={styles.timerBoxVal}>{minutes}</Text>
                                    <Text style={styles.timerBoxUnit}>MIN</Text>
                                </View>
                                <Text style={styles.timerSep}>:</Text>
                                <View style={styles.timerBox}>
                                    <Text style={styles.timerBoxVal}>{seconds}</Text>
                                    <Text style={styles.timerBoxUnit}>SEC</Text>
                                </View>
                            </View>
                        </View>

                        {/* Specs: Expandable Bid History section */}
                        <View style={[styles.expandableHistoryContainer, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                            <TouchableOpacity 
                                style={styles.expandableHeader}
                                activeOpacity={0.8}
                                onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}>
                                <View style={styles.expHeaderLeft}>
                                    <Ionicons name="list" size={16} color="#FF6B35" />
                                    <Text style={[styles.expHeaderTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                        Expandable Bid History ({bidLogs.length})
                                    </Text>
                                </View>
                                <Ionicons 
                                    name={isHistoryExpanded ? "chevron-up" : "chevron-down"} 
                                    size={18} 
                                    color="#FF6B35" 
                                />
                            </TouchableOpacity>

                            {isHistoryExpanded && (
                                <View style={styles.expandableContent}>
                                    {bidLogs.map((log) => (
                                        <View key={log.id} style={styles.historyLogItem}>
                                            <View style={styles.historyLogLeft}>
                                                <Ionicons name="person-circle-outline" size={24} color="#64748B" />
                                                <View style={styles.historyLogMeta}>
                                                    <Text style={[styles.historyLogName, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                                        {log.name}
                                                    </Text>
                                                    <Text style={styles.historyLogRating}>{log.rating} rating</Text>
                                                </View>
                                            </View>
                                            <View style={styles.historyLogRight}>
                                                <Text style={[styles.historyLogPrice, { color: '#FF6B35' }]}>
                                                    ₦{CommaSepNum(log.amount)}
                                                </Text>
                                                <Text style={styles.historyLogTime}>{log.time}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                    </View>
                </ScrollView>

                {/* Specs: Bid Input pre-filled with min increment & Place Bid CTA pinned to bottom */}
                <View style={[styles.bottomStickyBar, { backgroundColor: isDarkMode ? '#060D14' : '#FFFFFF' }]}>
                    <View style={styles.stickyInputWrapper}>
                        <Text style={styles.stickyInputLabel}>PRE-FILLED MIN NEXT BID</Text>
                        <TextInput
                            style={[styles.stickyInput, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A', backgroundColor: isDarkMode ? '#1A2A3A' : '#F7F7F8' }]}
                            value={bidAmount}
                            onChangeText={setBidAmount}
                            keyboardType="number-pad"
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.stickyBidBtn} 
                        activeOpacity={0.9}
                        onPress={handlePlaceBid}>
                        <Ionicons name="hammer-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.stickyBidBtnText}>PLACE BID</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 110,
    },
    imageHeaderWrapper: {
        width: '100%',
        height: 280,
        position: 'relative',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerOverlayRow: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overlayBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerOverlayBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(13, 27, 42, 0.85)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
    },
    timerOverlayText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    container: {
        paddingHorizontal: 16, // Specs: 16px horizontal padding
    },
    sellerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        ...theme.shadows.glass,
    },
    sellerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    sellerMeta: {
        flex: 1,
        marginLeft: 12,
    },
    sellerName: {
        fontSize: 14,
        fontWeight: '800',
    },
    sellerRating: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2,
        fontWeight: '600',
    },
    chatSellerBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFE6DD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoCard: {
        marginTop: 16,
        paddingHorizontal: 4,
    },
    cardCategory: {
        fontSize: 8,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    itemTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginTop: 4,
        lineHeight: 28,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    itemDescription: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
        marginTop: 8,
    },
    bidsCard: {
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        ...theme.shadows.glass,
    },
    bidsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    coralPrice: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FF6B35', // Specs: Large coral text current bid
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        marginTop: 4,
    },
    bidsBiddersBadge: {
        backgroundColor: 'rgba(255, 107, 53, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    biddersText: {
        color: '#FF6B35',
        fontSize: 10,
        fontWeight: '800',
    },
    cardDivider: {
        height: 1,
        backgroundColor: 'rgba(13, 27, 42, 0.05)',
        marginVertical: 14,
    },
    countdownTitle: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.8,
        marginBottom: 8,
        textAlign: 'center',
    },
    timerGridRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    timerBox: {
        width: 50,
        height: 48,
        backgroundColor: 'rgba(13, 27, 42, 0.03)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.05)',
    },
    timerBoxVal: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0D1B2A',
    },
    timerBoxUnit: {
        fontSize: 7,
        color: '#64748B',
        fontWeight: 'bold',
        letterSpacing: 0.3,
        marginTop: 2,
    },
    timerSep: {
        fontSize: 20,
        color: '#FF6B35',
        fontWeight: '800',
        bottom: 4,
    },
    expandableHistoryContainer: {
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        ...theme.shadows.glass,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 32,
    },
    expHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    expHeaderTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    expandableContent: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(13, 27, 42, 0.05)',
        paddingTop: 12,
    },
    historyLogItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13, 27, 42, 0.03)',
    },
    historyLogLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    historyLogMeta: {
        justifyContent: 'center',
    },
    historyLogName: {
        fontSize: 12,
        fontWeight: '700',
    },
    historyLogRating: {
        fontSize: 9,
        color: '#64748B',
        marginTop: 1,
    },
    historyLogRight: {
        alignItems: 'flex-end',
    },
    historyLogPrice: {
        fontSize: 12,
        fontWeight: '800',
    },
    historyLogTime: {
        fontSize: 9,
        color: '#94A3B8',
        marginTop: 1,
    },
    bottomStickyBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 94 : 80,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    },
    stickyInputWrapper: {
        flex: 1,
        marginRight: 16,
        justifyContent: 'center',
    },
    stickyInputLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    stickyInput: {
        height: 44,
        borderRadius: 12,
        paddingHorizontal: 12,
        fontSize: 14,
        fontWeight: '800',
        borderWidth: 1.5,
        borderColor: '#FF6B35', // Highlight focus border
    },
    stickyBidBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B35', // Specs: Warm coral Place Bid CTA
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
        height: 44,
    },
    stickyBidBtnText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.5,
    }
});
