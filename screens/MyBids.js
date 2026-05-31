import React, { useState } from 'react';
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
    Alert 
} from 'react-native';
import { theme } from '../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';

export function MyBids({ navigation }) {
    // Premium demo active bids dataset
    const [bids, setBids] = useState([
        {
            id: '1',
            title: '2 Bedrooms Apartment in Ayobo for rent',
            image: 'https://pictures-nigeria.jijistatic.com/128842763_ODk5LTIwNDgtYjE5MWUxZTZiMQ.webp',
            myBid: 5600000,
            highestBid: 5600000,
            status: 'Winning', // Winning status (emerald/teal)
            endDate: 'Ends in 1d 5h'
        },
        {
            id: '2',
            title: 'Flower Decor With Pimples Pot',
            image: 'https://pictures-nigeria.jijistatic.com/107850170_MTUwMC0xMTI1LTdiY2MxMTU5OWQ.webp',
            myBid: 9000,
            highestBid: 9500,
            status: 'Outbid', // Outbid status (rose crimson warning)
            endDate: 'Ends in 2h 15m'
        },
        {
            id: '3',
            title: '50cm Classic Fiberglass Flower Pots',
            image: 'https://pictures-nigeria.jijistatic.com/127485434_NjAwLTYwMC0xODNlNDNkODE5.webp',
            myBid: 6000,
            highestBid: 6000,
            status: 'Winning',
            endDate: 'Ends in 3d 12h'
        }
    ]);

    const handleQuickIncrement = (item) => {
        const incrementAmount = item.highestBid * 0.05; // 5% bump
        const newBid = item.highestBid + incrementAmount;
        
        // Update local bids state
        setBids(bids.map(b => {
            if (b.id === item.id) {
                return {
                    ...b,
                    myBid: newBid,
                    highestBid: newBid,
                    status: 'Winning'
                };
            }
            return b;
        }));

        Alert.alert(
            'Bid Placed Successfully',
            `You have successfully increased your bid on "${item.title.slice(0, 20)}..." to ₦${CommaSepNum(Math.round(newBid))}.`
        );
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Active Bids</Text>
                    <Text style={styles.headerSubtitle}>Track and manage your live auction lots</Text>
                </View>

                {bids.length > 0 ? (
                    <FlatList
                        data={bids}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const isWinning = item.status === 'Winning';
                            return (
                                <View style={[
                                    styles.bidCard, 
                                    isWinning ? styles.winningCardBorder : styles.outbidCardBorder
                                ]}>
                                    
                                    {/* Product frame-within-a-frame */}
                                    <View style={styles.imageWrapper}>
                                        <Image source={{ uri: item.image }} style={styles.productImg} />
                                    </View>
                                    
                                    <View style={styles.detailsBlk}>
                                        <View style={styles.statusRow}>
                                            <View style={[styles.statusBadge, isWinning ? styles.winningBadge : styles.outbidBadge]}>
                                                <View style={[styles.statusDot, isWinning ? styles.winningDot : styles.outbidDot]} />
                                                <Text style={[styles.statusText, isWinning ? styles.winningText : styles.outbidText]}>
                                                    {item.status.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text style={styles.timeText}>{item.endDate}</Text>
                                        </View>

                                        <Text style={styles.productTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>

                                        {/* Dynamic Bid Progress Indicator */}
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, isWinning ? styles.winningProgress : styles.outbidProgress]} />
                                        </View>

                                        <View style={styles.bidsInfoRow}>
                                            <View>
                                                <Text style={styles.bidLabel}>MY BID</Text>
                                                <Text style={[styles.bidPrice, isWinning ? styles.winningPriceText : styles.outbidPriceText]}>
                                                    ₦{CommaSepNum(Math.round(item.myBid))}
                                                </Text>
                                            </View>
                                            <View style={styles.highestBidContainer}>
                                                <Text style={styles.bidLabel}>CURRENT HIGH</Text>
                                                <Text style={styles.highestBidPrice}>
                                                    ₦{CommaSepNum(Math.round(item.highestBid))}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Action Buttons: Electric Coral CTA */}
                                        {!isWinning && (
                                            <TouchableOpacity 
                                                style={styles.actionBtn}
                                                activeOpacity={0.8}
                                                onPress={() => handleQuickIncrement(item)}>
                                                <Ionicons name="trending-up-outline" size={14} color="#FFFFFF" />
                                                <Text style={styles.actionBtnText}>Rebid +5%</Text>
                                            </TouchableOpacity>
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
                        <Ionicons name="hammer-outline" size={80} color={theme.colors.outline} />
                        <Text style={styles.emptyTitle}>No Active Bids</Text>
                        <Text style={styles.emptyText}>You haven't placed bids on any listed lots yet.</Text>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.colors.dullRed0, // Soft Ivory Canvas
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.lg,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: theme.colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 4,
    },
    listContent: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
    bidCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.75)', // Glass card background
        borderWidth: 1,
        borderRadius: theme.roundness.xl, // 28px XL rounded card
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        ...theme.shadows.glass,
        gap: theme.spacing.md,
    },
    winningCardBorder: {
        borderColor: 'rgba(16, 185, 129, 0.35)', // Glowing emerald border
    },
    outbidCardBorder: {
        borderColor: 'rgba(219, 30, 73, 0.35)', // Glowing Rose Crimson border
    },
    imageWrapper: {
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: theme.roundness.xl - 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    productImg: {
        width: 100,
        height: 130,
        borderRadius: theme.roundness.lg, // Nested 18px LG image border
        backgroundColor: theme.colors.surfaceContainerLow,
    },
    detailsBlk: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
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
        borderRadius: theme.roundness.sm,
        gap: 6,
    },
    winningBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // soft emerald green background
    },
    outbidBadge: {
        backgroundColor: 'rgba(217, 30, 73, 0.1)', // soft Rose Crimson background
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: theme.roundness.full,
    },
    winningDot: {
        backgroundColor: theme.colors.success,
    },
    outbidDot: {
        backgroundColor: theme.colors.error,
    },
    statusText: {
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    winningText: {
        color: theme.colors.success,
    },
    outbidText: {
        color: theme.colors.error,
    },
    timeText: {
        fontSize: 10,
        color: theme.colors.outline,
        fontWeight: '600',
    },
    productTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.primary,
        marginTop: 6,
    },
    progressBarBg: {
        height: 4,
        width: '100%',
        backgroundColor: 'rgba(26, 27, 47, 0.05)',
        borderRadius: theme.roundness.full,
        marginTop: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: theme.roundness.full,
    },
    winningProgress: {
        width: '100%',
        backgroundColor: theme.colors.success,
    },
    outbidProgress: {
        width: '65%',
        backgroundColor: theme.colors.error,
    },
    bidsInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    bidLabel: {
        fontSize: 9,
        color: theme.colors.outline,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    bidPrice: {
        fontSize: 15,
        fontWeight: '800',
        marginTop: 2,
    },
    winningPriceText: {
        color: theme.colors.success,
    },
    outbidPriceText: {
        color: theme.colors.error,
    },
    highestBidContainer: {
        alignItems: 'flex-end',
    },
    highestBidPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: theme.colors.primary,
        marginTop: 2,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.dullRed1, // Electric Coral CTA button
        borderRadius: theme.roundness.md, // Compact button
        paddingVertical: 6,
        marginTop: 8,
        gap: 6,
        ...theme.shadows.button,
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: theme.spacing.md,
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.outline,
        textAlign: 'center',
        marginTop: theme.spacing.sm,
        lineHeight: 20,
    }
});