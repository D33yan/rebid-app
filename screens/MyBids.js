import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    StatusBar, 
    Platform,
    Animated
} from 'react-native';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';

import { api } from '../utilities/api';

export function MyBids({ navigation }) {
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();
    
    // Premium demo active bids dataset matching interactive mockup exactly
    const [bids, setBids] = useState([]);
    const [skeletonOpacity] = useState(new Animated.Value(0.3));
    const [isLoading, setIsLoading] = useState(true);

    const loadActiveBids = async () => {
        try {
            const data = await api.bids.active();
            setBids(data);
        } catch (e) {
            console.error("Failed to load active bids portfolio from REST API:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadActiveBids();

        // Blinking skeleton loading effect
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonOpacity, {
                    toValue: 1.0,
                    duration: 850,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonOpacity, {
                    toValue: 0.3,
                    duration: 850,
                    useNativeDriver: true,
                })
            ])
        );
        anim.start();

        return () => anim.stop();
    }, []);

    const handleQuickIncrement = async (item) => {
        const incrementAmount = item.highestBid * 0.05; // 5% bump
        const newBid = item.highestBid + incrementAmount;
        
        try {
            await api.bids.place(item.id, newBid);
            showToast(
                'success', 
                'Bid Placed Successfully!', 
                `You are now the leading bidder on ${item.title.slice(0, 18)}... at ₦${CommaSepNum(Math.round(newBid))}.`
            );
            loadActiveBids(); // Refresh from Supabase database
        } catch (e) {
            showToast('outbid', 'Bidding Failed', e.message || 'Transactional bid placement failed.');
        }
    };

    // Urgency Countdown Color Coder (green -> yellow -> red)
    const getUrgencyDetails = (endDate) => {
        if (!endDate) return { color: '#00D97E', text: 'Ends Soon' };
        
        if (endDate.includes('3d') || endDate.includes('4d') || endDate.includes('5d')) {
            return { color: '#00D97E', text: endDate }; // Emerald Green
        }
        if (endDate.includes('1d') || endDate.includes('2d')) {
            return { color: '#F5C518', text: endDate }; // Premium Amber Gold
        }
        return { color: '#FF4560', text: `EXPIRING: ${endDate.replace('Ends in ', '')}` }; // Crimson Urgency
    };

    const renderSkeletonCard = () => (
        <Animated.View style={[styles.skeletonCard, { opacity: skeletonOpacity }]}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonDetailsBlk}>
                <View style={styles.skeletonHeaderRow}>
                    <View style={styles.skeletonBadge} />
                    <View style={styles.skeletonTimer} />
                </View>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonProgressBar} />
                <View style={styles.skeletonInfoRow}>
                    <View style={styles.skeletonBidInfo} />
                    <View style={styles.skeletonBidInfo} />
                </View>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: '#0A0F1E' }]}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>My Active Bids</Text>
                        <Text style={styles.headerSubtitle}>Monitor and fast-track your premium bids in real-time</Text>
                    </View>
                    <View style={styles.badgeCountContainer}>
                        <Text style={styles.badgeCountText}>{bids.filter(b => b.status === 'Winning').length} Leading</Text>
                    </View>
                </View>

                {isLoading ? (
                    <View style={styles.listContent}>
                        {renderSkeletonCard()}
                        {renderSkeletonCard()}
                        {renderSkeletonCard()}
                    </View>
                ) : bids.length > 0 ? (
                    <FlatList
                        data={bids}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const isWinning = item.status === 'Winning';
                            const urgency = getUrgencyDetails(item.endDate);
                            const progressPercent = Math.min(100, Math.round((item.myBid / item.highestBid) * 100));

                            return (
                                <View style={[
                                    styles.bidCard, 
                                    isWinning ? styles.winningCardGlow : styles.outbidCardGlow
                                ]}>
                                    
                                    {/* Thumbnail Image Container with nested glass overlay */}
                                    <View style={styles.imageWrapper}>
                                        <Image source={{ uri: item.image }} style={styles.productImg} />
                                        <View style={styles.categoryTag}>
                                            <Text style={styles.categoryTagText}>{item.category}</Text>
                                        </View>
                                    </View>
                                    
                                    {/* Item Details */}
                                    <View style={styles.detailsBlk}>
                                        <View style={styles.statusRow}>
                                            <View style={[
                                                styles.statusBadge, 
                                                isWinning ? styles.winningBadgeBg : styles.outbidBadgeBg
                                            ]}>
                                                <View style={[
                                                    styles.statusDot, 
                                                    isWinning ? styles.winningDotBg : styles.outbidDotBg
                                                ]} />
                                                <Text style={[
                                                    styles.statusText, 
                                                    isWinning ? styles.winningTextClr : styles.outbidTextClr
                                                ]}>
                                                    {item.status.toUpperCase()}
                                                </Text>
                                            </View>
                                            
                                            {/* Urgency Color Coded Countdown */}
                                            <View style={[styles.timerBadge, { borderColor: urgency.color + '30' }]}>
                                                <Ionicons name="time-outline" size={10} color={urgency.color} />
                                                <Text style={[styles.timeText, { color: urgency.color }]}>
                                                    {urgency.text}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.productTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>

                                        {/* Dynamic Bid Progress bar comparing My Bid vs Highest Bid */}
                                        <View style={styles.progressBarContainer}>
                                            <View style={styles.progressBarBg}>
                                                <Animated.View style={[
                                                    styles.progressBarFill, 
                                                    { 
                                                        width: `${progressPercent}%`,
                                                        backgroundColor: isWinning ? '#00D97E' : '#FF4560'
                                                    }
                                                ]} />
                                            </View>
                                            <Text style={styles.progressPercentText}>{progressPercent}% Match</Text>
                                        </View>

                                        {/* Bids Info Grid */}
                                        <View style={styles.bidsInfoRow}>
                                            <View>
                                                <Text style={styles.bidLabel}>YOUR BID</Text>
                                                <Text style={[
                                                    styles.bidPrice, 
                                                    isWinning ? styles.winningPriceText : styles.outbidPriceText
                                                ]}>
                                                    ₦{CommaSepNum(Math.round(item.myBid))}
                                                </Text>
                                            </View>
                                            <View style={styles.highestBidContainer}>
                                                <Text style={styles.bidLabel}>HIGHEST BID</Text>
                                                <Text style={styles.highestBidPrice}>
                                                    ₦{CommaSepNum(Math.round(item.highestBid))}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Action buttons: fast re-bid with high-fi feedback */}
                                        {!isWinning ? (
                                            <TouchableOpacity 
                                                style={styles.actionBtn}
                                                activeOpacity={0.8}
                                                onPress={() => handleQuickIncrement(item)}>
                                                <Ionicons name="flash-outline" size={13} color="#FFFFFF" />
                                                <Text style={styles.actionBtnText}>Rebid +5%</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.leadingBadgeContainer}>
                                                <Ionicons name="checkmark-circle" size={12} color="#00D97E" />
                                                <Text style={styles.leadingBadgeText}>You are currently winning this lot</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="hammer-outline" size={44} color="#FF6B35" />
                        </View>
                        <Text style={styles.emptyTitle}>No Active Bids Yet</Text>
                        <Text style={styles.emptyText}>
                            Start exploring high-value real estate, jewelry, or electronics on Rebid to place your first bid.
                        </Text>
                        <TouchableOpacity 
                            style={styles.exploreBtn}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.exploreBtnText}>Browse Live Auctions</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 22,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif-medium',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#8A95A5',
        marginTop: 4,
    },
    badgeCountContainer: {
        backgroundColor: 'rgba(0, 217, 126, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 217, 126, 0.25)',
    },
    badgeCountText: {
        color: '#00D97E',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    bidCard: {
        flexDirection: 'row',
        backgroundColor: '#111827', // Card Surface
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        gap: 14,
    },
    winningCardGlow: {
        borderColor: 'rgba(0, 217, 126, 0.25)', // glowing emerald border
        shadowColor: '#00D97E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    outbidCardGlow: {
        borderColor: 'rgba(255, 69, 96, 0.25)', // glowing crimson outbid border
        shadowColor: '#FF4560',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    productImg: {
        width: 100,
        height: 135,
        borderRadius: 12,
        backgroundColor: '#161E30',
    },
    categoryTag: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: 'rgba(8, 13, 24, 0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryTagText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    detailsBlk: {
        flex: 1,
        justifyContent: 'space-between',
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        gap: 5,
    },
    winningBadgeBg: {
        backgroundColor: 'rgba(0, 217, 126, 0.1)',
    },
    outbidBadgeBg: {
        backgroundColor: 'rgba(255, 69, 96, 0.1)',
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 5,
    },
    winningDotBg: {
        backgroundColor: '#00D97E',
    },
    outbidDotBg: {
        backgroundColor: '#FF4560',
    },
    statusText: {
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    winningTextClr: {
        color: '#00D97E',
    },
    outbidTextClr: {
        color: '#FF4560',
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        gap: 4,
    },
    timeText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 6,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif-medium',
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 8,
    },
    progressBarBg: {
        height: 3,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressPercentText: {
        color: '#8A95A5',
        fontSize: 8,
        fontWeight: 'bold',
    },
    bidsInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    bidLabel: {
        fontSize: 8,
        color: '#8A95A5',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    bidPrice: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 2,
    },
    winningPriceText: {
        color: '#00D97E',
    },
    outbidPriceText: {
        color: '#FF4560',
    },
    highestBidContainer: {
        alignItems: 'flex-end',
    },
    highestBidPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 2,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B35', // Electric Coral
        borderRadius: 8,
        paddingVertical: 7,
        marginTop: 10,
        gap: 6,
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    leadingBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 6,
        backgroundColor: 'rgba(0, 217, 126, 0.05)',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    leadingBadgeText: {
        color: '#00D97E',
        fontSize: 10,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 80,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 107, 53, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 53, 0.12)',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 13,
        color: '#8A95A5',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 24,
    },
    exploreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B35',
        paddingHorizontal: 20,
        paddingVertical: 11,
        borderRadius: 24,
        gap: 8,
    },
    exploreBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },

    // Skeleton items
    skeletonCard: {
        flexDirection: 'row',
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        gap: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    skeletonImage: {
        width: 100,
        height: 135,
        borderRadius: 12,
        backgroundColor: '#1C2333',
    },
    skeletonDetailsBlk: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    skeletonHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skeletonBadge: {
        width: 60,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#1C2333',
    },
    skeletonTimer: {
        width: 50,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#1C2333',
    },
    skeletonTitle: {
        width: '80%',
        height: 16,
        borderRadius: 4,
        backgroundColor: '#1C2333',
        marginTop: 10,
    },
    skeletonProgressBar: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        backgroundColor: '#1C2333',
        marginTop: 10,
    },
    skeletonInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    skeletonBidInfo: {
        width: 60,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#1C2333',
    }
});