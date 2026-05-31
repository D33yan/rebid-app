import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../config/app-context";
import { useThemeToggle } from "../config/theme-context";
import { useToast } from "../utilities/ToastService";
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Animated,
    Dimensions
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { theme } from '../config/theme';
import { demoProducts } from '../assets/demo-products';
import { categories } from "../assets/categories";
import { CommaSepNum } from '../utilities/comma-sep-num';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Sell } from './Sell';
import { History } from './History';
import { Profile } from './Profile';
import { MyBids } from './MyBids';
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { api } from '../utilities/api';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function MyHome({ navigation }) {
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [skeletonOpacity] = useState(new Animated.Value(0.3));

    // Fetch auctions from Express API backed by Supabase
    const loadAuctions = async () => {
        try {
            setIsLoading(true);
            const data = await api.auctions.list(selectedCategory, searchQuery);
            setProducts(data);
        } catch (error) {
            console.warn("Failed to load live auctions, falling back to offline demo lots:", error.message);
            // Fallback to demo lots if the server is unreachable
            const offlineLots = demoProducts.filter(item => {
                const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
                const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesSearch;
            });
            setProducts(offlineLots);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAuctions();
    }, [selectedCategory, searchQuery]);

    // Blinking skeleton shimmer animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonOpacity, {
                    toValue: 1.0,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonOpacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    // Helper: Urgency color coding (green -> yellow -> red)
    const getUrgencyDetails = (endsInVal) => {
        const endsIn = String(endsInVal || '3d');
        if (endsIn.includes('d')) {
            return { color: '#00D97E', label: `Ends in ${endsIn}` }; // Green
        }
        if (endsIn.includes('h')) {
            return { color: '#F5C518', label: `Ends in ${endsIn}` }; // Yellow
        }
        return { color: '#FF4560', label: `EXPIRING` }; // Red urgency
    };

    // Skeleton loader card
    const renderSkeletonCard = () => (
        <Animated.View style={[styles.skeletonCard, { opacity: skeletonOpacity }]}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonDetails}>
                <View style={[styles.skeletonTextLine, { width: '80%' }]} />
                <View style={[styles.skeletonTextLine, { width: '50%', marginTop: 8 }]} />
                <View style={[styles.skeletonTextLine, { width: '95%', height: 36, marginTop: 12, borderRadius: 10 }]} />
            </View>
        </Animated.View>
    );

    // Featured product for full-width premium carousel top card
    const featuredLot = products[0] || demoProducts[0];

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Sticky Header: Greeting Left, Bell + Avatar Right */}
            <View style={styles.stickyHeader}>
                <View style={styles.headerLeftBlock}>
                    <Text style={styles.greetingText}>Good evening, Chidi 👋</Text>
                    {/* Elite Gold Badge Positioned Under Greeting */}
                    <View style={styles.eliteBadge}>
                        <Ionicons name="ribbon" size={10} color="#0A0F1E" />
                        <Text style={styles.eliteBadgeText}>ELITE</Text>
                    </View>
                </View>
                <View style={styles.headerRightBlock}>
                    <TouchableOpacity 
                        style={styles.notificationBtn}
                        activeOpacity={0.8}
                        onPress={() => showToast('success', 'LEVERAGE ALERT', 'Your active bid is currently leading!')}>
                        <Ionicons name="notifications-outline" size={20} color="#F1F5F9" />
                        <View style={styles.redDot} />
                    </TouchableOpacity>
                    <Image source={require('../assets/user.jpg')} style={styles.avatarImg} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    
                    {/* Frosted Search Input Panel */}
                    <View style={styles.searchBarWrapper}>
                        <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search high-end luxury lots..."
                            placeholderTextColor="#64748B"
                        />
                    </View>

                    {/* Category Scroll uses Pill Chips: Inactive = #1C2333, Active = #FF6B35 */}
                    <View style={styles.categoriesBlock}>
                        <Text style={styles.sectionTitle}>Browse Collections</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesScroll}>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.catCard, 
                                    selectedCategory === 'All' && styles.activeCatCard
                                ]}
                                onPress={() => setSelectedCategory('All')}>
                                <Text style={[
                                    styles.catLabel, 
                                    selectedCategory === 'All' ? styles.activeCatLabel : styles.inactiveCatLabel
                                ]}>All</Text>
                            </TouchableOpacity>

                            {categories.map(cat => {
                                const isActive = selectedCategory === cat.title;
                                return (
                                    <TouchableOpacity 
                                        key={cat.id}
                                        style={[
                                            styles.catCard, 
                                            isActive && styles.activeCatCard
                                        ]}
                                        onPress={() => setSelectedCategory(cat.title)}>
                                        <Text style={[
                                            styles.catLabel, 
                                            isActive ? styles.activeCatLabel : styles.inactiveCatLabel
                                        ]}>{cat.title}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Featured Carousel Block */}
                    {featuredLot && (
                        <View style={styles.featuredContainer}>
                            <Text style={styles.sectionTitle}>Featured Asset</Text>
                            <TouchableOpacity 
                                activeOpacity={0.9}
                                style={styles.featuredCard}
                                onPress={() => navigation.navigate('live-bidding', { product: featuredLot })}>
                                <Image source={{ uri: featuredLot.image_url || featuredLot.imageUr }} style={styles.featuredImage} />
                                
                                {/* Bottom Linear Overlay Mask */}
                                <View style={StyleSheet.absoluteFillObject}>
                                    <Svg height="100%" width="100%">
                                        <Defs>
                                            <LinearGradient id="featMask" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <Stop offset="0%" stopColor="#0A0F1E" stopOpacity="0" />
                                                <Stop offset="50%" stopColor="#0A0F1E" stopOpacity="0.3" />
                                                <Stop offset="100%" stopColor="#0A0F1E" stopOpacity="0.9" />
                                            </LinearGradient>
                                        </Defs>
                                        <Rect width="100%" height="100%" fill="url(#featMask)" />
                                    </Svg>
                                </View>

                                {/* Title + Timer absolute-positioned */}
                                <View style={styles.featuredOverlayContent}>
                                    <View style={styles.liveTimerPill}>
                                        <Ionicons name="time-outline" size={10} color="#FFFFFF" />
                                        <Text style={styles.liveTimerText}>LIVE AUCTION</Text>
                                    </View>
                                    <Text style={styles.featuredTitle}>{featuredLot.title}</Text>
                                    <Text style={styles.featuredPrice}>
                                        ₦{CommaSepNum(featuredLot.current_price || featuredLot.currentBid || featuredLot.initial_price)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* 2-Column Grid Auction Listings Block */}
                    <View style={styles.listingsBlock}>
                        <Text style={styles.sectionTitle}>Active Marketplace</Text>
                        
                        {isLoading ? (
                            <View style={styles.loaderContainer}>
                                {renderSkeletonCard()}
                                {renderSkeletonCard()}
                            </View>
                        ) : products.length > 0 ? (
                            <View style={styles.gridContainer}>
                                {products.map(item => {
                                    const formattedPrice = CommaSepNum(item.current_price || item.currentBid || item.initial_price || 0);
                                    const timeLabel = item.end_date ? new Date(item.end_date).toLocaleDateString() : (item.endsIn || 'Soon');
                                    const urgency = getUrgencyDetails(item.endsIn || '3d');
                                    const imageUrl = item.image_url || item.imageUr || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';

                                    return (
                                        <TouchableOpacity 
                                            key={item.id}
                                            activeOpacity={0.9}
                                            style={styles.auctionCard}
                                            onPress={() => navigation.navigate('live-bidding', { product: item })}>
                                            
                                            <View style={styles.cardImageWrapper}>
                                                <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                                                
                                                {/* Urgency Color Coded Timer Overlay */}
                                                <View style={[styles.urgencyTimer, { backgroundColor: urgency.color }]}>
                                                    <Ionicons name="time" size={10} color="#FFFFFF" />
                                                    <Text style={styles.timerText}>{timeLabel}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.cardDetails}>
                                                <Text style={styles.cardTitle} numberOfLines={1}>
                                                    {item.title}
                                                </Text>
                                                
                                                <View style={styles.bidRow}>
                                                    <View>
                                                        <Text style={styles.bidLabel}>CURRENT BID</Text>
                                                        <Text style={styles.bidPrice}>
                                                            ₦{formattedPrice}
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* CTA Bid button */}
                                                <TouchableOpacity 
                                                    style={styles.cardCta}
                                                    activeOpacity={0.8}
                                                    onPress={() => navigation.navigate('live-bidding', { product: item })}>
                                                    <Ionicons name="hammer" size={12} color="#FFFFFF" />
                                                    <Text style={styles.cardCtaText}>BID NOW</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            /* Designed Empty State */
                            <View style={styles.emptyContainer}>
                                <Svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                                    <Circle cx="50" cy="50" r="40" fill="rgba(255, 107, 53, 0.08)" />
                                    <Path d="M30 65 L45 50 L55 60 L70 45" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" />
                                    <Circle cx="70" cy="45" r="4" fill="#0D1B2A" />
                                </Svg>
                                <Text style={styles.emptyTitle}>No matching auctions found</Text>
                                <Text style={styles.emptySubtitle}>Start bidding on other active lots or list your item now.</Text>
                                <TouchableOpacity 
                                    style={styles.emptyCta}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                    }}>
                                    <Text style={styles.emptyCtaText}>Clear Filter</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export function Home() {
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                safeAreaInsets: { bottom: 0, top: 0, left: 0, right: 0 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Sell') {
                        iconName = focused ? 'pricetag' : 'pricetag-outline';
                    } else if (route.name === 'Bids') {
                        iconName = focused ? 'hammer' : 'hammer-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'receipt' : 'receipt-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    
                    return (
                        <View style={styles.tabIconWrapper}>
                            <Ionicons name={iconName} size={22} color={color} />
                            
                            {/* bottom indicators dots beneath focused active icons */}
                            {focused && (
                                <View style={styles.focusedActiveDot} />
                            )}
                        </View>
                    );
                },
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#FF7A45', // Primary Fintech Coral
                tabBarInactiveTintColor: '#8E96A8', // Secondary Slate Text
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 24 : 16,
                    left: 16,
                    right: 16,
                    backgroundColor: 'rgba(14, 22, 40, 0.95)', // Surface elevated glassmorphism
                    borderTopWidth: 0,
                    borderRadius: 24,
                    height: Platform.OS === 'ios' ? 76 : 72,
                    borderWidth: 0.5,
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    elevation: 10,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
                    paddingTop: 8,
                    zIndex: 100,
                },
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    marginTop: 2,
                }
            })}
        >
            <Tab.Screen name='Home' component={MyHome} options={{ headerShown: false }} />
            
            {/* Sell tab uses a raised coral circular FAB button style */}
            <Tab.Screen 
                name='Sell' 
                component={Sell} 
                options={{ 
                    headerShown: false,
                    tabBarButton: (props) => (
                        <TouchableOpacity 
                            {...props}
                            style={[props.style, styles.sellFabContainer]} 
                            activeOpacity={0.9}>
                            <View style={styles.sellFabCircle}>
                                <Ionicons name="pricetag" size={24} color="#FFFFFF" />
                            </View>
                            <Text style={[
                                styles.sellFabLabel,
                                props.accessibilityState?.selected && { color: '#FF6B35' }
                            ]}>Sell</Text>
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* Bids tab with activity badge counter */}
            <Tab.Screen 
                name='Bids' 
                component={MyBids} 
                options={{ 
                    headerShown: false,
                    tabBarBadge: 3, 
                    tabBarBadgeStyle: {
                        backgroundColor: '#FF6B35',
                        color: '#FFFFFF',
                        fontSize: 8,
                        fontWeight: '800',
                    }
                }} 
            />
            
            <Tab.Screen name='History' component={History} options={{ headerShown: false }} />
            <Tab.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#050B18', // Space Midnight Obsidian background
    },
    stickyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 80,
        paddingTop: Platform.OS === 'ios' ? 30 : 15,
        backgroundColor: '#050B18',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    headerLeftBlock: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    eliteBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D4AF37', // Premium Gold
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginTop: 4,
        gap: 3,
    },
    eliteBadgeText: {
        color: '#050B18',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerRightBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#0E1628', // Surface Elevated Navy
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    redDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF4560',
    },
    avatarImg: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: '#D4AF37', // Gold ring
    },
    scrollContent: {
        paddingBottom: 100, // Safe distance above absolute floating tabs
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0E1628', // Surface
        borderRadius: 12,
        height: 52,
        paddingHorizontal: 16,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
    },
    categoriesBlock: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 14,
        letterSpacing: -0.2,
    },
    categoriesScroll: {
        gap: 8,
    },
    catCard: {
        backgroundColor: '#0E1628',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    activeCatCard: {
        backgroundColor: '#FF7A45', // Primary Accent fintech orange/coral
        borderColor: '#FF7A45',
    },
    catLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeCatLabel: {
        color: '#FFFFFF',
    },
    inactiveCatLabel: {
        color: '#8E96A8',
    },
    featuredContainer: {
        marginBottom: 24,
    },
    featuredCard: {
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlayContent: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    liveTimerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FF7A45',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 4,
        marginBottom: 8,
    },
    liveTimerText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    featuredPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#16C784', // Success fintech green
        marginTop: 4,
    },
    listingsBlock: {
        marginBottom: 24,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    auctionCard: {
        width: (width - 44) / 2,
        backgroundColor: '#0E1628',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.06)',
        marginBottom: 8,
    },
    cardImageWrapper: {
        width: '100%',
        height: 140,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    urgencyTimer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '700',
    },
    cardDetails: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        marginBottom: 4,
    },
    bidRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        paddingBottom: 8,
    },
    bidLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#8E96A8',
        letterSpacing: 0.5,
    },
    bidPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#16C784',
        marginTop: 2,
    },
    cardCta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF7A45',
        borderRadius: 10,
        height: 38,
        marginTop: 4,
        gap: 6,
    },
    cardCtaText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    emptyContainer: {
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: '#0E1628',
    },
    emptyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 11,
        color: '#8E96A8',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 16,
    },
    emptyCta: {
        backgroundColor: '#FF7A45',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginTop: 16,
    },
    emptyCtaText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 11,
    },
    tabIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        width: 40,
        position: 'relative',
    },
    focusedActiveDot: {
        position: 'absolute',
        bottom: -6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF7A45',
    },
    sellFabContainer: {
        top: -16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: 60,
    },
    sellFabCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FF7A45',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF7A45',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    sellFabLabel: {
        color: '#8E96A8',
        fontSize: 9,
        fontWeight: '700',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    loaderContainer: {
        gap: 16,
    },
    skeletonCard: {
        height: 200,
        borderRadius: 16,
        backgroundColor: '#0E1628',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.06)',
        padding: 12,
    },
    skeletonImage: {
        width: '100%',
        height: 110,
        borderRadius: 12,
        backgroundColor: '#050B18',
    },
    skeletonDetails: {
        marginTop: 12,
        paddingHorizontal: 4,
    },
    skeletonTextLine: {
        height: 12,
        borderRadius: 6,
        backgroundColor: '#050B18',
    }
});
