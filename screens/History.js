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
    Platform 
} from 'react-native';
import { theme } from '../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';

export function History({ navigation }) {
    // Premium demo transaction history ledger
    const [transactions, setTransactions] = useState([
        {
            id: '1',
            title: '50cm Classic Fiberglass Flower Pots',
            image: 'https://pictures-nigeria.jijistatic.com/127485434_NjAwLTYwMC0xODNlNDNkODE5.webp',
            price: 6000,
            type: 'Purchase', // Won Lot
            status: 'Delivered',
            date: 'May 28, 2026'
        },
        {
            id: '2',
            title: 'Good Quality Chest (Bd 108) Freezers',
            image: 'https://pictures-nigeria.jijistatic.com/124839391_OTYwLTEyODAtZjdiMTc0MDY2OQ.webp',
            price: 47500,
            type: 'Sale', // Sold Lot
            status: 'Completed',
            date: 'May 14, 2026'
        },
        {
            id: '3',
            title: 'Quality WC Seats',
            image: 'https://pictures-nigeria.jijistatic.com/110614223_NzU2LTEwMDgtMzNkNzE5MDdkZQ.webp',
            price: 23000,
            type: 'Purchase',
            status: 'Payment Sent',
            date: 'April 30, 2026'
        }
    ]);

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Transaction Ledger</Text>
                    <Text style={styles.headerSubtitle}>History of won lots and completed sales</Text>
                </View>

                {transactions.length > 0 ? (
                    <FlatList
                        data={transactions}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const isPurchase = item.type === 'Purchase';
                            return (
                                <View style={styles.ledgerCard}>
                                    
                                    {/* Product frame-within-a-frame */}
                                    <Image source={{ uri: item.image }} style={styles.productImg} />
                                    
                                    <View style={styles.detailsBlk}>
                                        <View style={styles.metaRow}>
                                            <View style={[styles.typeBadge, isPurchase ? styles.purchaseBadge : styles.saleBadge]}>
                                                <Text style={[styles.typeText, isPurchase ? styles.purchaseText : styles.saleText]}>
                                                    {item.type}
                                                </Text>
                                            </View>
                                            <Text style={styles.dateText}>{item.date}</Text>
                                        </View>

                                        <Text style={styles.productTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>

                                        <View style={styles.priceRow}>
                                            <View>
                                                <Text style={styles.label}>Price</Text>
                                                <Text style={styles.priceText}>₦{CommaSepNum(item.price)}</Text>
                                            </View>
                                            <View style={styles.statusContainer}>
                                                <Ionicons 
                                                    name={item.status === 'Delivered' || item.status === 'Completed' ? 'checkmark-circle-outline' : 'cash-outline'} 
                                                    size={14} 
                                                    color={theme.colors.outline} 
                                                />
                                                <Text style={styles.statusText}>{item.status}</Text>
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
                        <Ionicons name="receipt-outline" size={80} color={theme.colors.outline} />
                        <Text style={styles.emptyTitle}>No Transaction History</Text>
                        <Text style={styles.emptyText}>Completed trades and won items will be logged here.</Text>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.colors.dullRed0, // Soft Ice-Blue Canvas
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.primary,
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
    ledgerCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // glass card background
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)', // 1px white border at 40% opacity
        borderRadius: theme.roundness.xl, // 24px XL rounded card
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        ...theme.shadows.glass,
        gap: theme.spacing.md,
    },
    productImg: {
        width: 80,
        height: 100,
        borderRadius: theme.roundness.lg, // Nested 16px LG image border
        backgroundColor: theme.colors.surfaceContainer,
    },
    detailsBlk: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: theme.roundness.sm,
    },
    purchaseBadge: {
        backgroundColor: 'rgba(26, 27, 47, 0.06)', // primary deep blue/grey background tint
    },
    saleBadge: {
        backgroundColor: 'rgba(255, 122, 89, 0.08)', // electric coral tint
    },
    typeText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    purchaseText: {
        color: theme.colors.primary,
    },
    saleText: {
        color: theme.colors.dullRed1,
    },
    dateText: {
        fontSize: 10,
        color: theme.colors.outline,
        fontWeight: '500',
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    label: {
        fontSize: 10,
        color: theme.colors.outline,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.primary,
        marginTop: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        color: theme.colors.outline,
        fontWeight: '600',
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