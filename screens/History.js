import React, { useState, useEffect, useRef } from 'react';
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
    Animated,
    Dimensions
} from 'react-native';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';

const { width } = Dimensions.get('window');

export function History({ navigation }) {
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();
    
    // Quick filter categories
    const [selectedFilter, setSelectedFilter] = useState('All');

    // Segmented control sizes
    const containerWidth = width - 32;
    const itemWidth = containerWidth / 3;

    const slideAnim = useRef(new Animated.Value(0)).current; // Index 0 is 'All'
    
    // Premium demo transaction history ledger matching interactive mockup
    const [transactions] = useState([
        {
            id: '1',
            title: 'Lagos Modern Mansionette',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
            price: 145000000,
            type: 'Purchase', // Won Lot
            status: 'Payment Settled',
            date: 'May 28, 2026',
            category: 'Real Estate'
        },
        {
            id: '2',
            title: 'Mercedes Benz G63 AMG 2025',
            image: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=600',
            price: 92000000,
            type: 'Sale', // Sold Lot
            status: 'Escrow Completed',
            date: 'May 14, 2026',
            category: 'Vehicles'
        },
        {
            id: '3',
            title: 'Premium Sapphire Pendant',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
            price: 4200000,
            type: 'Purchase',
            status: 'Shipped',
            date: 'April 30, 2026',
            category: 'Jewelry'
        },
        {
            id: '4',
            title: 'Rolex Cosmograph Daytona',
            image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600',
            price: 34500000,
            type: 'Purchase',
            status: 'Delivered',
            date: 'April 12, 2026',
            category: 'Watches'
        }
    ]);

    const [skeletonOpacity] = useState(new Animated.Value(0.3));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonOpacity, {
                    toValue: 1.0,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonOpacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const filteredTransactions = transactions.filter(t => {
        if (selectedFilter === 'All') return true;
        if (selectedFilter === 'Purchases') return t.type === 'Purchase';
        if (selectedFilter === 'Sales') return t.type === 'Sale';
        return true;
    });

    const handleFilterSelect = (filter, index) => {
        setSelectedFilter(filter);
        Animated.spring(slideAnim, {
            toValue: index,
            useNativeDriver: true,
            tension: 70,
            friction: 9
        }).start();
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [2, itemWidth + 2, itemWidth * 2 + 2]
    });

    // Compute stats
    const totalWins = transactions.filter(t => t.type === 'Purchase').reduce((sum, curr) => sum + curr.price, 0);
    const totalSales = transactions.filter(t => t.type === 'Sale').reduce((sum, curr) => sum + curr.price, 0);

    const getStatusDetails = (status) => {
        switch (status) {
            case 'Payment Settled':
            case 'Escrow Completed':
            case 'Delivered':
                return { color: '#16C784', icon: 'checkmark-circle-outline' }; // Success Emerald
            case 'Shipped':
                return { color: '#D4AF37', icon: 'paper-plane-outline' }; // Premium Gold
            default:
                return { color: '#8E96A8', icon: 'time-outline' }; // Secondary Slate Text
        }
    };

    const renderSkeletonCard = () => (
        <Animated.View style={[styles.skeletonCard, { opacity: skeletonOpacity }]}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonDetails}>
                <View style={styles.skeletonRow}>
                    <View style={styles.skeletonBadge} />
                    <View style={styles.skeletonDate} />
                </View>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonFooterRow}>
                    <View style={styles.skeletonPrice} />
                    <View style={styles.skeletonStatus} />
                </View>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: '#050B18' }]}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Transaction Ledger</Text>
                        <Text style={styles.headerSubtitle}>History of won premium lots and completed sales</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.downloadBtn} 
                        onPress={() => {
                            showToast('info', 'Exporting Ledger', 'Your monthly PDF invoice is being generated.');
                        }}>
                        <Ionicons name="cloud-download-outline" size={18} color="#FF7A45" />
                    </TouchableOpacity>
                </View>

                {/* Micro Ledger Stats Widgets */}
                <View style={styles.statsCardGrid}>
                    <View style={styles.miniStatsCard}>
                        <Text style={styles.miniStatsLabel}>TOTAL PURCHASED</Text>
                        <Text style={styles.miniStatsValue}>₦{CommaSepNum(totalWins)}</Text>
                        <View style={[styles.trendIndicator, { backgroundColor: 'rgba(22, 199, 132, 0.1)' }]}>
                            <Ionicons name="arrow-down" size={10} color="#16C784" />
                            <Text style={styles.trendTextWinning}>{transactions.filter(t => t.type === 'Purchase').length} Lots</Text>
                        </View>
                    </View>
                    
                    <View style={styles.miniStatsCard}>
                        <Text style={styles.miniStatsLabel}>TOTAL LIQUIDATED</Text>
                        <Text style={styles.miniStatsValue}>₦{CommaSepNum(totalSales)}</Text>
                        <View style={[styles.trendIndicator, { backgroundColor: 'rgba(255, 122, 69, 0.1)' }]}>
                            <Ionicons name="arrow-up" size={10} color="#FF7A45" />
                            <Text style={styles.trendTextCoral}>{transactions.filter(t => t.type === 'Sale').length} Lots</Text>
                        </View>
                    </View>
                </View>

                {/* Custom sliding Filter Segmented Control */}
                <View style={styles.segmentedControlWrapper}>
                    <Animated.View 
                        style={[
                            styles.slidingPill, 
                            { 
                                width: itemWidth - 4,
                                transform: [{ translateX: translateX }] 
                            }
                        ]} 
                    />
                    {['All', 'Purchases', 'Sales'].map((filter, index) => {
                        const isActive = selectedFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                style={styles.segmentedTab}
                                onPress={() => handleFilterSelect(filter, index)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.segmentedTabText,
                                    isActive && styles.segmentedTabTextActive
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {isLoading ? (
                    <View style={styles.listContent}>
                        {renderSkeletonCard()}
                        {renderSkeletonCard()}
                        {renderSkeletonCard()}
                    </View>
                ) : filteredTransactions.length > 0 ? (
                    <FlatList
                        data={filteredTransactions}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const isPurchase = item.type === 'Purchase';
                            const status = getStatusDetails(item.status);
                            
                            return (
                                <View style={styles.ledgerCard}>
                                    {/* Square High-Fidelity Thumbnail Image */}
                                    <View style={styles.imageWrapper}>
                                        <Image source={{ uri: item.image }} style={styles.productImg} />
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryBadgeText}>{item.category}</Text>
                                        </View>
                                    </View>
                                    
                                    {/* Details */}
                                    <View style={styles.detailsBlk}>
                                        <View style={styles.metaRow}>
                                            <View style={[
                                                styles.typeBadge, 
                                                isPurchase ? styles.purchaseBadgeBg : styles.saleBadgeBg
                                            ]}>
                                                <Ionicons 
                                                    name={isPurchase ? "arrow-down-circle" : "arrow-up-circle"} 
                                                    size={12} 
                                                    color={isPurchase ? "#16C784" : "#FF7A45"} 
                                                    style={{ marginRight: 4 }}
                                                />
                                                <Text style={[
                                                    styles.typeText, 
                                                    isPurchase ? styles.purchaseTextClr : styles.saleTextClr
                                                ]}>
                                                    {item.type.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text style={styles.dateText}>{item.date}</Text>
                                        </View>

                                        <Text style={styles.productTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>

                                        <View style={styles.priceRow}>
                                            <View>
                                                <Text style={styles.label}>SETTLED AMOUNT</Text>
                                                <Text style={[styles.priceText, isPurchase ? styles.purchasePrice : styles.salePrice]}>
                                                    ₦{CommaSepNum(item.price)}
                                                </Text>
                                            </View>
                                            
                                            {/* Beautiful Status Badging */}
                                            <View style={[styles.statusContainer, { borderColor: status.color + '25', backgroundColor: status.color + '10' }]}>
                                                <Ionicons name={status.icon} size={11} color={status.color} />
                                                <Text style={[styles.statusText, { color: status.color }]}>{item.status}</Text>
                                            </View>
                                        </View>
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
                            <Ionicons name="receipt-outline" size={40} color="#FF7A45" />
                        </View>
                        <Text style={styles.emptyTitle}>No Transactions Found</Text>
                        <Text style={styles.emptyText}>
                            Your completed auction purchases and listed sales will appear here as soon as settlement is locked.
                        </Text>
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
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: '#050B18',
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
        color: '#8E96A8',
        marginTop: 4,
    },
    downloadBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 122, 69, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 69, 0.2)',
    },
    statsCardGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 12,
    },
    miniStatsCard: {
        flex: 1,
        backgroundColor: '#0E1628', // Elevated Surface
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    miniStatsLabel: {
        fontSize: 8,
        color: '#8E96A8',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    miniStatsValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 4,
    },
    trendIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 8,
        gap: 3,
    },
    trendTextWinning: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#16C784',
    },
    trendTextCoral: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#FF7A45',
    },
    segmentedControlWrapper: {
        flexDirection: 'row',
        backgroundColor: '#0E1628',
        borderRadius: 14,
        height: 44,
        padding: 2,
        marginHorizontal: 16,
        marginTop: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        position: 'relative',
    },
    slidingPill: {
        position: 'absolute',
        top: 2,
        bottom: 2,
        backgroundColor: '#FF7A45', // Primary Fintech Coral
        borderRadius: 12,
        shadowColor: '#FF7A45',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 3,
    },
    segmentedTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    segmentedTabText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#8E96A8',
    },
    segmentedTabTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: 16,
        paddingBottom: 110, // Added padding to clear absolute floating bottom tabs
    },
    ledgerCard: {
        flexDirection: 'row',
        backgroundColor: '#0E1628', // Elevated Surface
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        gap: 14,
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    productImg: {
        width: 80,
        height: 80, // High-fidelity square rounded thumbnail
        borderRadius: 12,
        backgroundColor: '#050B18',
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        backgroundColor: 'rgba(5, 11, 24, 0.85)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryBadgeText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    detailsBlk: {
        flex: 1,
        justifyContent: 'space-between',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    purchaseBadgeBg: {
        backgroundColor: 'rgba(22, 199, 132, 0.1)',
    },
    saleBadgeBg: {
        backgroundColor: 'rgba(255, 122, 69, 0.1)',
    },
    typeText: {
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    purchaseTextClr: {
        color: '#16C784',
    },
    saleTextClr: {
        color: '#FF7A45',
    },
    dateText: {
        fontSize: 9,
        color: '#8E96A8',
        fontWeight: 'bold',
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 6,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif-medium',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    label: {
        fontSize: 8,
        color: '#8E96A8',
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 2,
    },
    purchasePrice: {
        color: '#16C784',
    },
    salePrice: {
        color: '#FF7A45',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        gap: 4,
    },
    statusText: {
        fontSize: 9,
        fontWeight: 'bold',
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
        backgroundColor: 'rgba(255, 122, 69, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 69, 0.15)',
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
        color: '#8E96A8',
        textAlign: 'center',
        lineHeight: 18,
    },

    // Skeleton loader items
    skeletonCard: {
        flexDirection: 'row',
        backgroundColor: '#0E1628',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        gap: 14,
    },
    skeletonImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#050B18',
    },
    skeletonDetails: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    skeletonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skeletonBadge: {
        width: 60,
        height: 14,
        borderRadius: 4,
        backgroundColor: '#050B18',
    },
    skeletonDate: {
        width: 40,
        height: 14,
        borderRadius: 4,
        backgroundColor: '#050B18',
    },
    skeletonTitle: {
        width: '80%',
        height: 14,
        borderRadius: 4,
        backgroundColor: '#050B18',
        marginTop: 8,
    },
    skeletonFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    skeletonPrice: {
        width: 70,
        height: 18,
        borderRadius: 4,
        backgroundColor: '#050B18',
    },
    skeletonStatus: {
        width: 60,
        height: 18,
        borderRadius: 4,
        backgroundColor: '#050B18',
    }
});