import * as React from 'react';
import { 
    View, 
    Text, 
    Image, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList, 
    StatusBar, 
    Platform, 
    TextInput,
    Animated,
    Alert
} from 'react-native';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { api } from '../utilities/api';
import { CommaSepNum } from '../utilities/comma-sep-num';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../assets/categories';
import Svg, { Circle, Path } from "react-native-svg";

export function Auctions({ route, navigation }) {
    const routeCategory = route.params?.selectedCategory || 'All';
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();

    const [auctions, setAuctions] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(routeCategory);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [favoriteIds, setFavoriteIds] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [skeletonOpacity] = React.useState(new Animated.Value(0.3));

    const loadAuctions = async () => {
        setIsLoading(true);
        try {
            const data = await api.auctions.list(selectedCategory, searchQuery);
            // Format to client keys
            const formatted = data.map(item => ({
                id: item.id,
                title: item.title,
                desc: item.description,
                imageUr: item.image_url,
                currentBid: Number(item.current_price),
                numberOfBids: 1,
                endsIn: item.end_date,
                category: item.category
            }));
            setAuctions(formatted);
        } catch (error) {
            console.error("Failed to load auctions from API:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 800);
        }
    };

    React.useEffect(() => {
        loadAuctions();
    }, [selectedCategory, searchQuery]);

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonOpacity, {
                    toValue: 1.0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonOpacity, {
                    toValue: 0.3,
                    duration: 600,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const categoriesList = ['All', ...categories.map(c => c.title)];

    const toggleFavorite = (id) => {
        if (favoriteIds.includes(id)) {
            setFavoriteIds(favoriteIds.filter(fId => fId !== id));
            showToast('info', 'Favorites Updated', 'Lot removed from watchlist.');
        } else {
            setFavoriteIds([...favoriteIds, id]);
            showToast('success', 'Added to Watchlist', 'You will receive notifications for this lot.');
        }
    };

    const getUrgencyDetails = (endsIn) => {
        if (!endsIn) return { color: '#10B981', label: 'Ends: Soon' };

        if (endsIn.includes('d')) {
            return { color: '#10B981', label: `Ends in ${endsIn}` }; // Green
        }
        if (endsIn.includes('h') && !endsIn.includes('d')) {
            const hours = parseInt(endsIn.split('h')[0]);
            if (hours >= 12) {
                return { color: '#10B981', label: `Ends in ${endsIn}` }; // Green
            }
            return { color: '#F59E0B', label: `Ends in ${endsIn}` }; // Yellow
        }
        return { color: '#E11D48', label: `EXPIRING: ${endsIn}` }; // Red
    };

    const filteredAuctions = auctions.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderSkeletonCard = () => (
        <Animated.View style={[styles.skeletonCard, { opacity: skeletonOpacity, backgroundColor: isDarkMode ? '#2C3E50' : '#E2E8F0' }]}>
            <View style={[styles.skeletonImage, { backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
            <View style={styles.skeletonDetails}>
                <View style={[styles.skeletonText, { width: '70%', backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
                <View style={[styles.skeletonText, { width: '40%', marginTop: 6, backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
                <View style={[styles.skeletonText, { width: '90%', height: 28, marginTop: 10, borderRadius: 8, backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: isDarkMode ? '#060D14' : '#F7F7F8' }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <View style={styles.container}>
                
                {/* Sticky Header with Search */}
                <View style={[styles.header, { backgroundColor: isDarkMode ? '#060D14' : '#FFFFFF' }]}>
                    <TouchableOpacity 
                        style={[styles.backButton, { backgroundColor: isDarkMode ? '#1A2A3A' : '#F5F5FA' }]} 
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={20} color={isDarkMode ? '#F0F0F0' : '#0D1B2A'} />
                    </TouchableOpacity>
                    
                    <View style={[styles.searchBarContainer, { backgroundColor: isDarkMode ? '#1A2A3A' : '#F5F5FA' }]}>
                        <Ionicons name="search-outline" size={16} color="#64748B" style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search active listings..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>
                </View>

                {/* Horizontal Category Scroll Pills */}
                <View style={[styles.pillsContainer, { backgroundColor: isDarkMode ? '#060D14' : '#FFFFFF' }]}>
                    <FlatList
                        data={categoriesList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.pillsList}
                        renderItem={({ item }) => {
                            const isSelected = selectedCategory === item;
                            return (
                                <TouchableOpacity 
                                    style={[
                                        styles.pillBtn, 
                                        isSelected && styles.activePillBtn,
                                        { backgroundColor: isDarkMode ? '#1A2A3A' : '#F5F5FA' }
                                    ]}
                                    onPress={() => setSelectedCategory(item)}>
                                    <Text style={[
                                        styles.pillText, 
                                        isSelected && styles.activePillText,
                                        { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item) => item}
                    />
                </View>

                {/* Main Auctions List */}
                {isLoading ? (
                    <View style={styles.loaderList}>
                        {renderSkeletonCard()}
                        {renderSkeletonCard()}
                    </View>
                ) : filteredAuctions.length > 0 ? (
                    <FlatList
                        data={filteredAuctions}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const isFav = favoriteIds.includes(item.id);
                            const urgency = getUrgencyDetails(item.endsIn);
                            return (
                                <TouchableOpacity 
                                    activeOpacity={0.9}
                                    style={[styles.auctionCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}
                                    onPress={() => navigation.navigate('live-bidding', { product: item })}>
                                    
                                    {/* Aspect Ratio Locked Product Image */}
                                    <View style={styles.imageWrapper}>
                                        <Image
                                            style={styles.productImg}
                                            source={{ uri: item.imageUr }}
                                        />
                                        
                                        {/* Heart Icon Toggle State */}
                                        <TouchableOpacity 
                                            style={styles.heartOverlay}
                                            onPress={() => toggleFavorite(item.id)}>
                                            <Ionicons 
                                                name={isFav ? "heart" : "heart-outline"} 
                                                size={16} 
                                                color={isFav ? '#E11D48' : '#0D1B2A'} 
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.detailsBlk}>
                                        <View style={styles.topInfoRow}>
                                            <Text style={styles.categoryLabel}>{item.category.toUpperCase()}</Text>
                                            
                                            {/* Real-time countdown timer with urgency color-coding */}
                                            <View style={[styles.timeTag, { backgroundColor: urgency.color + '15' }]}>
                                                <Ionicons name="time-outline" size={10} color={urgency.color} />
                                                <Text style={[styles.timeTagText, { color: urgency.color }]}>{urgency.label}</Text>
                                            </View>
                                        </View>

                                        <Text style={[styles.productTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.description} numberOfLines={1}>
                                            {item.desc}
                                        </Text>

                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { backgroundColor: urgency.color }]} />
                                        </View>

                                        {/* Columns Grid */}
                                        <View style={styles.columnsRow}>
                                            <View style={styles.columnLeft}>
                                                <Text style={styles.priceLabel}>CURRENT BID</Text>
                                                <Text style={[styles.priceText, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                                    ₦{CommaSepNum(item.currentBid)}
                                                </Text>
                                            </View>
                                            <View style={styles.columnRight}>
                                                <Text style={styles.volumeLabel}>VOLUME</Text>
                                                <Text style={[styles.volumeText, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                                    {item.numberOfBids} bids
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Electric Coral Place Bid CTA */}
                                        <TouchableOpacity 
                                            style={styles.placeBidBtn}
                                            activeOpacity={0.8}
                                            onPress={() => navigation.navigate('live-bidding', { product: item })}>
                                            <Ionicons name="hammer-outline" size={12} color="#FFFFFF" />
                                            <Text style={styles.placeBidBtnText}>PLACE BID</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    /* Designed Empty State */
                    <View style={[styles.emptyContainer, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                        <Svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                            <Circle cx="50" cy="50" r="40" fill="rgba(255, 107, 53, 0.08)" />
                            <Path d="M30 65 L45 50 L55 60 L70 45" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" />
                            <Circle cx="70" cy="45" r="4" fill="#0D1B2A" />
                        </Svg>
                        <Text style={[styles.emptyTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>No lots under this category</Text>
                        <Text style={styles.emptySubtitle}>Try searching for another keyword or select a different category.</Text>
                        <TouchableOpacity 
                            style={styles.emptyCta}
                            activeOpacity={0.8}
                            onPress={() => {
                                setSelectedCategory('All');
                                setSearchQuery('');
                            }}>
                            <Text style={styles.emptyCtaText}>Clear Filters</Text>
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
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 38,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        paddingVertical: 0,
    },
    pillsContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    pillsList: {
        paddingHorizontal: 16,
        gap: 8,
    },
    pillBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activePillBtn: {
        backgroundColor: '#FF6B35', // Highlight Active categories
    },
    pillText: {
        fontSize: 11,
        fontWeight: '700',
    },
    activePillText: {
        color: '#FFFFFF !important',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    auctionCard: {
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        padding: 10,
        marginBottom: 16,
        ...theme.shadows.glass,
    },
    imageWrapper: {
        position: 'relative',
    },
    productImg: {
        width: 100,
        height: 146,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    heartOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsBlk: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    topInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    timeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    timeTagText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    productTitle: {
        fontSize: 15,
        fontWeight: '800',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    description: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 1,
    },
    progressBarBg: {
        height: 3,
        width: '100%',
        backgroundColor: 'rgba(26, 27, 47, 0.05)',
        borderRadius: 2,
        marginTop: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        width: '75%',
        borderRadius: 2,
    },
    columnsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    columnLeft: {
        flex: 1,
    },
    columnRight: {
        alignItems: 'flex-end',
        marginRight: 6,
    },
    priceLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 2,
    },
    volumeLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    volumeText: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
    },
    placeBidBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B35', // Accent color place bid fill
        borderRadius: 10,
        paddingVertical: 8,
        marginTop: 8,
        gap: 4,
    },
    placeBidBtnText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    emptyContainer: {
        margin: 16,
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 16,
    },
    emptyCta: {
        backgroundColor: '#FF6B35',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginTop: 16,
    },
    emptyCtaText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 11,
    },
    loaderList: {
        padding: 16,
        gap: 16,
    },
    skeletonCard: {
        height: 160,
        borderRadius: 16,
        flexDirection: 'row',
        padding: 10,
    },
    skeletonImage: {
        width: 100,
        height: '100%',
        borderRadius: 12,
    },
    skeletonDetails: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    skeletonText: {
        height: 12,
        borderRadius: 6,
    }
});