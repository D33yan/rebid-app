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
    FlatList,
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
import Svg, { Path, Circle } from "react-native-svg";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function MyHome({ navigation }) {
    const { logout } = useContext(AppContext);
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [skeletonOpacity] = useState(new Animated.Value(0.3));

    // Simulate network skeleton loader delay on mount
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
            showToast('info', 'Welcome Back, Julian!', 'Browse the latest premium auction bids.');
        }, 1500);

        // Blinking skeleton animation
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

        return () => clearTimeout(timer);
    }, []);

    // Helper: Urgency color coding (green -> yellow -> red)
    const getUrgencyDetails = (endsIn) => {
        if (!endsIn) return { color: '#10B981', label: 'Ends: Soon' }; // Green default

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
        // Less than 1 hour or digital clock split
        return { color: '#E11D48', label: `EXPIRING: ${endsIn}` }; // Red urgency
    };

    // Filter categories & search
    const filteredProducts = demoProducts.filter(item => {
        const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    // Skeleton loader component
    const renderSkeletonCard = () => (
        <Animated.View style={[styles.skeletonCard, { opacity: skeletonOpacity, backgroundColor: isDarkMode ? '#2C3E50' : '#E2E8F0' }]}>
            <View style={[styles.skeletonImage, { backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
            <View style={styles.skeletonDetails}>
                <View style={[styles.skeletonTextLine, { width: '80%', backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
                <View style={[styles.skeletonTextLine, { width: '50%', marginTop: 8, backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
                <View style={[styles.skeletonTextLine, { width: '90%', height: 32, marginTop: 12, borderRadius: 8, backgroundColor: isDarkMode ? '#1E2D3B' : '#CBD5E1' }]} />
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: colors.primary }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            
            {/* Sticky Header with Search Bar + Notification Bell */}
            <View style={[styles.stickyHeader, { backgroundColor: isDarkMode ? '#060D14' : '#FFFFFF' }]}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={16} color="#64748B" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search Nigerian lots..."
                        placeholderTextColor="#94A3B8"
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.notificationBtn, { backgroundColor: isDarkMode ? '#1A2A3A' : '#F7F7F8' }]}
                    activeOpacity={0.8}
                    onPress={() => showToast('outbid', 'YOU\'VE BEEN OUTBID!', 'Your bid on Audemars Piguet was outbid by ₦100,000!')}>
                    <Ionicons name="notifications-outline" size={20} color={isDarkMode ? '#F0F0F0' : '#0D1B2A'} />
                    <View style={styles.redDot} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    
                    {/* Visual Diagonal Brand Banner */}
                    <View style={styles.introBlock}>
                        <Text style={[styles.brandTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>Discover High-End Lots</Text>
                        <Text style={styles.introSubtitle}>Cowrywise standard safety with Jumia active energy.</Text>
                    </View>

                    {/* Category Scroll uses Icon Cards with active outline tints */}
                    <View style={styles.categoriesBlock}>
                        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>Browse Categories</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesScroll}>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.catCard, 
                                    selectedCategory === 'All' && styles.activeCatCard,
                                    { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }
                                ]}
                                onPress={() => setSelectedCategory('All')}>
                                <View style={[styles.catIconCircle, selectedCategory === 'All' && styles.activeCatCircle]}>
                                    <Ionicons name="grid-outline" size={16} color={selectedCategory === 'All' ? '#FFFFFF' : '#0D1B2A'} />
                                </View>
                                <Text style={[styles.catLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>All</Text>
                            </TouchableOpacity>

                            {categories.map(cat => {
                                const isActive = selectedCategory === cat.title;
                                return (
                                    <TouchableOpacity 
                                        key={cat.id}
                                        style={[
                                            styles.catCard, 
                                            isActive && styles.activeCatCard,
                                            { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }
                                        ]}
                                        onPress={() => setSelectedCategory(cat.title)}>
                                        <View style={[styles.catIconCircle, isActive && styles.activeCatCircle]}>
                                            <FontAwesomeIcon icon={cat.icon} size={14} color={isActive ? '#FFFFFF' : '#0D1B2A'} />
                                        </View>
                                        <Text style={[styles.catLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>{cat.title}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Auction Listings Block */}
                    <View style={styles.listingsBlock}>
                        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>Active Auctions</Text>
                        
                        {isLoading ? (
                            <View style={styles.loaderContainer}>
                                {renderSkeletonCard()}
                                {renderSkeletonCard()}
                            </View>
                        ) : filteredProducts.length > 0 ? (
                            <View style={styles.gridContainer}>
                                {filteredProducts.map(item => {
                                    const urgency = getUrgencyDetails(item.endsIn);
                                    return (
                                        <TouchableOpacity 
                                            key={item.id}
                                            activeOpacity={0.9}
                                            style={[styles.auctionCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}
                                            onPress={() => navigation.navigate('live-bidding', { product: item })}>
                                            
                                            <View style={styles.cardImageWrapper}>
                                                <Image source={{ uri: item.imageUr }} style={styles.cardImage} />
                                                
                                                {/* Urgency Color Coded Timer Overlay */}
                                                <View style={[styles.urgencyTimer, { backgroundColor: urgency.color }]}>
                                                    <Ionicons name="time" size={10} color="#FFFFFF" />
                                                    <Text style={styles.timerText}>{urgency.label}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.cardDetails}>
                                                <Text style={[styles.cardCategory, { color: '#FF6B35' }]}>
                                                    {item.category.toUpperCase()}
                                                </Text>
                                                <Text style={[styles.cardTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]} numberOfLines={1}>
                                                    {item.title}
                                                </Text>
                                                
                                                <View style={styles.bidRow}>
                                                    <View>
                                                        <Text style={styles.bidLabel}>CURRENT HIGHEST BID</Text>
                                                        <Text style={[styles.bidPrice, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                                            ₦{CommaSepNum(item.currentBid)}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.bidCountBadge}>
                                                        <Text style={styles.bidCountText}>{item.numberOfBids} bids</Text>
                                                    </View>
                                                </View>

                                                {/* CTA Bid button */}
                                                <TouchableOpacity 
                                                    style={styles.cardCta}
                                                    activeOpacity={0.8}
                                                    onPress={() => navigation.navigate('live-bidding', { product: item })}>
                                                    <Ionicons name="hammer-outline" size={12} color="#FFFFFF" />
                                                    <Text style={styles.cardCtaText}>PLACE A BID</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            /* Specs: Designed Empty State (illustration + short copy + CTA button) */
                            <View style={[styles.emptyContainer, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                                <Svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                                    <Circle cx="50" cy="50" r="40" fill="rgba(255, 107, 53, 0.08)" />
                                    <Path d="M30 65 L45 50 L55 60 L70 45" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" />
                                    <Circle cx="70" cy="45" r="4" fill="#0D1B2A" />
                                </Svg>
                                <Text style={[styles.emptyTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>No matching auctions found</Text>
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
    const { isDarkMode } = useThemeToggle();
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Sell') {
                        iconName = focused ? 'card' : 'card-outline';
                    } else if (route.name === 'Bids') {
                        iconName = focused ? 'hammer' : 'hammer-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    
                    return (
                        <View style={styles.tabIconWrapper}>
                            <Ionicons name={iconName} size={20} color={color} />
                            
                            {/* Specs: bottom indicators dots beneath focused active icons */}
                            {focused && (
                                <View style={styles.focusedActiveDot} />
                            )}
                        </View>
                    );
                },
                // Tab labels always visible
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#FF6B35', // Warm Coral-Orange Active indicator
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: '#0D1B2A', // Specs: bottom navigation uses navy background
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 90 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
                    paddingTop: 8,
                    elevation: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }
            })}
        >
            <Tab.Screen name='Home' component={MyHome} options={{ headerShown: false }} />
            
            {/* Specs: Sell tab uses a raised coral circular FAB button style */}
            <Tab.Screen 
                name='Sell' 
                component={Sell} 
                options={{ 
                    headerShown: false,
                    tabBarButton: (props) => (
                        <TouchableOpacity 
                            style={styles.sellFabContainer} 
                            activeOpacity={0.9} 
                            onPress={props.onPress}>
                            <View style={styles.sellFabCircle}>
                                <Ionicons name="add" size={28} color="#FFFFFF" />
                            </View>
                            <Text style={styles.sellFabLabel}>Sell</Text>
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* Specs: Bids tab with activity badge counter */}
            <Tab.Screen 
                name='Bids' 
                component={MyBids} 
                options={{ 
                    headerShown: false,
                    tabBarBadge: 3, // Specs: activity badge counter
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
    },
    stickyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 64,
        zIndex: 99,
        gap: 12,
        shadowColor: '#0D1B2A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F8',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.05)',
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        paddingVertical: 0,
        fontWeight: '600',
    },
    notificationBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    redDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E11D48',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    contentContainer: {
        paddingHorizontal: 16, // Specs: 16px horizontal padding
    },
    introBlock: {
        marginTop: 24, // Specs: 24px section spacing
    },
    brandTitle: {
        fontSize: 22,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    introSubtitle: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 4,
    },
    categoriesBlock: {
        marginTop: 24, // Specs: 24px section spacing
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoriesScroll: {
        paddingVertical: 4,
        gap: 10,
    },
    catCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        gap: 8,
    },
    activeCatCard: {
        borderColor: '#FF6B35', // Specs: warm coral outline active icon card
    },
    catIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFE6DD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCatCircle: {
        backgroundColor: '#FF6B35',
    },
    catLabel: {
        fontSize: 11,
        fontWeight: '700',
    },
    listingsBlock: {
        marginTop: 24, // Specs: 24px section spacing
    },
    gridContainer: {
        flexDirection: 'column',
        gap: 16,
    },
    auctionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    cardImageWrapper: {
        width: '100%',
        height: 180,
        position: 'relative',
        backgroundColor: '#E2E8F0',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Lock aspect ratio
    },
    urgencyTimer: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    cardDetails: {
        padding: 16,
    },
    cardCategory: {
        fontSize: 8,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    bidRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(13, 27, 42, 0.05)',
        paddingTop: 12,
    },
    bidLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    bidPrice: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
    },
    bidCountBadge: {
        backgroundColor: 'rgba(255, 107, 53, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    bidCountText: {
        color: '#FF6B35',
        fontSize: 9,
        fontWeight: '800',
    },
    cardCta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B35',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 14,
        gap: 6,
    },
    cardCtaText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    loaderContainer: {
        gap: 16,
    },
    skeletonCard: {
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        padding: 12,
    },
    skeletonImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
    },
    skeletonDetails: {
        marginTop: 12,
        paddingHorizontal: 4,
    },
    skeletonTextLine: {
        height: 12,
        borderRadius: 6,
    },
    emptyContainer: {
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
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
    tabIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        position: 'relative',
    },
    focusedActiveDot: {
        position: 'absolute',
        bottom: -6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF6B35', // Specs: coral active dot indicator dot beneath icon
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
        backgroundColor: '#FF6B35', // Specs: raised coral circular FAB
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    sellFabLabel: {
        color: '#94A3B8',
        fontSize: 9,
        fontWeight: '700',
        marginTop: 4,
        textTransform: 'uppercase',
    }
});
