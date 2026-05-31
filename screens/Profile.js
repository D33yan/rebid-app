import { useState, useEffect, useContext, useRef } from 'react';
import { 
    View, 
    Text, 
    Image, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    StatusBar, 
    Platform, 
    ScrollView,
    Animated,
    Dimensions
} from 'react-native';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { AppContext } from '../config/app-context';
import { api } from '../utilities/api';
import { CommaSepNum } from '../utilities/comma-sep-num';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CHART_DATA = {
    '1M': {
        points: [{x: 10, y: 95}, {x: 75, y: 90}, {x: 140, y: 80}, {x: 205, y: 85}, {x: 270, y: 70}, {x: 310, y: 60}],
        path: "M 10 95 C 45 95, 40 90, 75 90 C 110 90, 105 80, 140 80 C 175 80, 170 85, 205 85 C 240 85, 235 70, 270 70 C 290 70, 295 60, 310 60",
        areaPath: "M 10 95 C 45 95, 40 90, 75 90 C 110 90, 105 80, 140 80 C 175 80, 170 85, 205 85 C 240 85, 235 70, 270 70 C 290 70, 295 60, 310 60 L 310 120 L 10 120 Z",
        growth: '+1.2% this month',
        value: '₦183.7M',
        subtext: 'Value change in last 30 days',
        months: ['May 1', 'May 8', 'May 15', 'May 22', 'May 31']
    },
    '3M': {
        points: [{x: 10, y: 98}, {x: 75, y: 85}, {x: 140, y: 70}, {x: 205, y: 75}, {x: 270, y: 45}, {x: 310, y: 35}],
        path: "M 10 98 C 45 98, 40 85, 75 85 C 110 85, 105 70, 140 70 C 175 70, 170 75, 205 75 C 240 75, 235 45, 270 45 C 290 45, 295 35, 310 35",
        areaPath: "M 10 98 C 45 98, 40 85, 75 85 C 110 85, 105 70, 140 70 C 175 70, 170 75, 205 75 C 240 75, 235 45, 270 45 C 290 45, 295 35, 310 35 L 310 120 L 10 120 Z",
        growth: '+8.4% last 3 months',
        value: '₦183.7M',
        subtext: 'Value change in last 90 days',
        months: ['Mar', 'Apr', 'May']
    },
    '6M': {
        points: [{x: 10, y: 100}, {x: 75, y: 85}, {x: 140, y: 75}, {x: 205, y: 45}, {x: 270, y: 25}, {x: 310, y: 15}],
        path: "M 10 100 C 45 100, 40 85, 75 85 C 110 85, 105 75, 140 75 C 175 75, 170 45, 205 45 C 240 45, 235 25, 270 25 C 290 25, 295 15, 310 15",
        areaPath: "M 10 100 C 45 100, 40 85, 75 85 C 110 85, 105 75, 140 75 C 175 75, 170 45, 205 45 C 240 45, 235 25, 270 25 C 290 25, 295 15, 310 15 L 310 120 L 10 120 Z",
        growth: '+18.4% last 6 months',
        value: '₦183.7M',
        subtext: 'Value change in last 180 days',
        months: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    '1Y': {
        points: [{x: 10, y: 105}, {x: 75, y: 95}, {x: 140, y: 60}, {x: 205, y: 55}, {x: 270, y: 30}, {x: 310, y: 10}],
        path: "M 10 105 C 45 105, 40 95, 75 95 C 110 95, 105 60, 140 60 C 175 60, 170 55, 205 55 C 240 55, 235 30, 270 30 C 290 30, 295 10, 310 10",
        areaPath: "M 10 105 C 45 105, 40 95, 75 95 C 110 95, 105 60, 140 60 C 175 60, 170 55, 205 55 C 240 55, 235 30, 270 30 C 290 30, 295 10, 310 10 L 310 120 L 10 120 Z",
        growth: '+34.2% this year',
        value: '₦183.7M',
        subtext: 'Value change in last 365 days',
        months: ['Q3 25', 'Q4 25', 'Q1 26', 'Q2 26']
    },
    'ALL': {
        points: [{x: 10, y: 110}, {x: 75, y: 90}, {x: 140, y: 75}, {x: 205, y: 50}, {x: 270, y: 20}, {x: 310, y: 5}],
        path: "M 10 110 C 45 110, 40 90, 75 90 C 110 90, 105 75, 140 75 C 175 75, 170 50, 205 50 C 240 50, 235 20, 270 20 C 290 20, 295 5, 310 5",
        areaPath: "M 10 110 C 45 110, 40 90, 75 90 C 110 90, 105 75, 140 75 C 175 75, 170 50, 205 50 C 240 50, 235 20, 270 20 C 290 20, 295 5, 310 5 L 310 120 L 10 120 Z",
        growth: '+120.5% all time',
        value: '₦183.7M',
        subtext: 'Cumulative historical growth',
        months: ['2023', '2024', '2025', '2026']
    }
};

export function Profile({ navigation }) {
    const { UID, logout } = useContext(AppContext);
    const { colors, isDarkMode, toggleTheme } = useThemeToggle();
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState('6M');

    // Segmented range control sizing
    const ranges = ['1M', '3M', '6M', '1Y', 'ALL'];
    const containerWidth = width - 32 - 28; // width minus screen margins (16 * 2) and card padding (14 * 2)
    const itemWidth = containerWidth / 5;

    const slideAnim = useRef(new Animated.Value(2)).current; // Index 2 is '6M' by default
    const translateX = slideAnim.interpolate({
        inputRange: [0, 1, 2, 3, 4],
        outputRange: [2, itemWidth + 2, itemWidth * 2 + 2, itemWidth * 3 + 2, itemWidth * 4 + 2]
    });

    const activeUID = UID || 'MqFcmcotWvRoTtHd1s91lR81yi13';

    const getUser = async () => {
        try {
            setLoading(true);
            const data = await api.users.profile();
            if (data && data.profile) {
                setUser({
                    firstName: data.profile.firstName,
                    lastName: data.profile.lastName,
                    email: data.profile.email,
                    bankName: data.profile.bankName,
                    accountNumber: data.profile.accountNumber,
                });
            } else {
                setUser({
                    firstName: 'Julian',
                    lastName: 'Sterling',
                    email: 'julian.sterling@rebid.com',
                });
            }
        } catch (error) {
            console.error("Failed to load user profile:", error);
            setUser({
                firstName: 'Julian',
                lastName: 'Sterling',
                email: 'julian.sterling@rebid.com',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, [activeUID]);

    const handleRangeSelect = (range, index) => {
        setSelectedRange(range);
        Animated.spring(slideAnim, {
            toValue: index,
            useNativeDriver: true,
            tension: 70,
            friction: 9
        }).start();
    };

    const fullName = user 
        ? `${user.firstName || user.firstname || 'Julian'} ${user.lastName || user.lastname || 'Sterling'}`
        : 'Julian Sterling';

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: '#050B18' }]}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Space-Dark Premium Header Banner */}
                <View style={styles.navyHeaderBanner}>
                    <View style={styles.topControlRow}>
                        <TouchableOpacity 
                            style={styles.themeToggleBtn} 
                            onPress={() => {
                                toggleTheme();
                                showToast('success', 'Theme Updated', `Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode.`);
                            }}>
                            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color="#FF7A45" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Collector Portfolio</Text>
                        <TouchableOpacity 
                            style={styles.settingsBtn}
                            onPress={() => {
                                showToast('info', 'Settings Opened', 'Secure portfolio configurations.');
                            }}>
                            <Ionicons name="cog-outline" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Centered Avatar and Level */}
                    <View style={styles.avatarCenteredBlock}>
                        {/* 72px avatar wrapped in dual luxury gold and glowing white rings */}
                        <View style={styles.avatarOuterRing}>
                            <View style={styles.avatarInnerRing}>
                                <Image 
                                    style={styles.profileImg} 
                                    source={require('../assets/user.jpg')} 
                                />
                            </View>
                            <TouchableOpacity style={styles.verifiedIconContainer} activeOpacity={0.8}>
                                <Ionicons name="shield-checkmark" size={11} color="#050B18" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.usernameRow}>
                            <Text style={styles.usernameText}>{fullName}</Text>
                        </View>
                        <Text style={styles.emailText}>{user?.email || 'julian.sterling@rebid.com'}</Text>
                        
                        {/* Gold Elite Ribbon Badge */}
                        <View style={styles.eliteBadgeContainer}>
                            <Ionicons name="ribbon" size={12} color="#D4AF37" />
                            <Text style={styles.eliteBadgeText}>ELITE COLLECTOR</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.container}>
                    
                    {/* Wealthfront-style Hero Portfolio Card */}
                    <View style={styles.heroPortfolioCard}>
                        {/* Subtle Premium Gold Top Accent */}
                        <View style={styles.heroGoldAccent} />
                        
                        <View style={styles.heroCardHeader}>
                            <View>
                                <Text style={styles.heroLabel}>TOTAL PORTFOLIO VALUE</Text>
                                <Text style={styles.heroValue}>₦183,700,000</Text>
                            </View>
                            <View style={styles.heroGrowthBadge}>
                                <Ionicons name="trending-up" size={12} color="#16C784" />
                                <Text style={styles.heroGrowthText}>+18.4%</Text>
                            </View>
                        </View>
                        
                        <View style={styles.heroCardDivider} />
                        
                        <View style={styles.heroCardFooter}>
                            <View style={styles.heroFooterItem}>
                                <Text style={styles.heroFooterLabel}>COLLECTOR TIER</Text>
                                <View style={styles.tierTag}>
                                    <Ionicons name="crown" size={10} color="#D4AF37" />
                                    <Text style={styles.tierTagText}>BLACK GOLD</Text>
                                </View>
                            </View>
                            <View style={styles.heroFooterItem}>
                                <Text style={styles.heroFooterLabel}>VERIFIED LIQUIDITY</Text>
                                <Text style={styles.heroFooterValue}>₦500.0M Cap</Text>
                            </View>
                        </View>
                    </View>

                    {/* Performance Line Chart Widget */}
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeaderRow}>
                            <View>
                                <Text style={styles.chartTitle}>Portfolio Growth</Text>
                                <Text style={styles.chartSubtitle}>{CHART_DATA[selectedRange].subtext}</Text>
                            </View>
                            <View style={styles.chartGrowthTextContainer}>
                                <Text style={styles.chartPeakVal}>{CHART_DATA[selectedRange].value}</Text>
                                <Text style={styles.chartRangeGrowth}>{CHART_DATA[selectedRange].growth}</Text>
                            </View>
                        </View>

                        {/* Interactive SVG Area Chart */}
                        <View style={styles.svgContainer}>
                            <Svg width="100%" height="120" viewBox="0 0 320 120">
                                <Defs>
                                    <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="#FF7A45" stopOpacity="0.25" />
                                        <Stop offset="100%" stopColor="#FF7A45" stopOpacity="0.0" />
                                    </LinearGradient>
                                </Defs>
                                
                                {/* Grid Lines */}
                                <Path d="M 0 35 L 320 35" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                <Path d="M 0 70 L 320 70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                <Path d="M 0 105 L 320 105" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                
                                {/* Gradient Underneath Area */}
                                <Path 
                                    d={CHART_DATA[selectedRange].areaPath} 
                                    fill="url(#chartGradient)" 
                                />

                                {/* Glowing Line Chart Path */}
                                <Path 
                                    d={CHART_DATA[selectedRange].path} 
                                    fill="none" 
                                    stroke="#FF7A45" 
                                    strokeWidth="3" 
                                />

                                {/* Glowing Peak Dot */}
                                <Circle 
                                    cx={CHART_DATA[selectedRange].points[CHART_DATA[selectedRange].points.length - 1].x} 
                                    cy={CHART_DATA[selectedRange].points[CHART_DATA[selectedRange].points.length - 1].y} 
                                    r="5.5" 
                                    fill="#FF7A45" 
                                    stroke="#FFFFFF" 
                                    strokeWidth="2" 
                                />
                            </Svg>
                            
                            <View style={styles.chartMonthsRow}>
                                {CHART_DATA[selectedRange].months.map((m, idx) => (
                                    <Text key={idx} style={styles.monthText}>{m}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Interactive sliding Segmented Range Controls */}
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
                            {ranges.map((range, index) => {
                                const isActive = selectedRange === range;
                                return (
                                    <TouchableOpacity
                                        key={range}
                                        style={styles.segmentedTab}
                                        onPress={() => handleRangeSelect(range, index)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.segmentedTabText,
                                            isActive && styles.segmentedTabTextActive
                                        ]}>
                                            {range}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Metric Cards Grid - 2 Column Layout */}
                    <View style={styles.metricCardsGrid}>
                        <View style={styles.metricCard}>
                            <View style={styles.metricIconCircle}>
                                <Ionicons name="hammer" size={16} color="#FF7A45" />
                            </View>
                            <Text style={styles.metricLabel}>ACTIVE BIDS</Text>
                            <Text style={styles.metricValue}>3 Lots</Text>
                            <Text style={styles.metricSubtext}>2 leading bid status</Text>
                        </View>
                        
                        <View style={styles.metricCard}>
                            <View style={[styles.metricIconCircle, { backgroundColor: 'rgba(22, 199, 132, 0.1)' }]}>
                                <Ionicons name="trophy" size={16} color="#16C784" />
                            </View>
                            <Text style={styles.metricLabel}>WIN RATE</Text>
                            <Text style={styles.metricValue}>88%</Text>
                            <Text style={[styles.metricSubtext, { color: '#16C784' }]}>22 successful lots</Text>
                        </View>
                    </View>

                    {/* Premium Metal Membership Card */}
                    <View style={styles.metalMemberCard}>
                        <View style={styles.metalCardHeader}>
                            <View>
                                <Text style={styles.metalTierText}>PREMIUM BLACK MEMBERSHIP</Text>
                                <Text style={styles.metalCardSub}>Verified Nigerian Settlement Tier</Text>
                            </View>
                            <Ionicons name="hardware-chip-outline" size={24} color="#D4AF37" />
                        </View>
                        
                        <View style={styles.metalCardBankInfo}>
                            <View>
                                <Text style={styles.metalLabel}>SETTLEMENT ACCOUNT</Text>
                                <Text style={styles.metalValue}>GTBANK NIGERIA **** 9104</Text>
                            </View>
                            <View style={styles.statusVerifiedBadge}>
                                <View style={styles.statusDotVerified} />
                                <Text style={styles.statusTextVerified}>VERIFIED</Text>
                            </View>
                        </View>
                    </View>

                    {/* Account Settings Menu Grid */}
                    <View style={styles.menuGrid}>
                        <Text style={styles.sectionHeaderTitle}>SECURE PORTFOLIO GATEWAY</Text>

                        <TouchableOpacity 
                            style={styles.tappableMenuCard}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('auctions')}>
                            <View style={styles.tappableCardLeft}>
                                <View style={[styles.iconCircleBg, { backgroundColor: 'rgba(255, 122, 69, 0.1)' }]}>
                                    <Ionicons name="cube-outline" size={16} color="#FF7A45" />
                                </View>
                                <View>
                                    <Text style={styles.tappableCardTitle}>My Listings & Collections</Text>
                                    <Text style={styles.tappableCardSub}>Track real estate, luxury art & cars</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#FF7A45" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.tappableMenuCard}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('History')}>
                            <View style={styles.tappableCardLeft}>
                                <View style={[styles.iconCircleBg, { backgroundColor: 'rgba(22, 199, 132, 0.1)' }]}>
                                    <Ionicons name="receipt-outline" size={16} color="#16C784" />
                                </View>
                                <View>
                                    <Text style={styles.tappableCardTitle}>Financial Ledger History</Text>
                                    <Text style={styles.tappableCardSub}>Review deposits, invoices & completed escrows</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#FF7A45" />
                        </TouchableOpacity>
                    </View>

                    {/* Redundant Red logout */}
                    <View style={styles.logoutWrapper}>
                        <TouchableOpacity style={styles.subtleRedLink} onPress={logout}>
                            <Text style={styles.logoutLinkText}>Securely Sign Out of Rebid</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 110, // Added padding to clear floating absolute bottom tab navigator
    },
    navyHeaderBanner: {
        backgroundColor: '#050B18', // Space Midnight Obsidian background
        paddingTop: Platform.OS === 'ios' ? 54 : 24,
        paddingBottom: 28,
        alignItems: 'center',
    },
    topControlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    themeToggleBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0E1628',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    settingsBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0E1628',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    headerTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1.0,
        textTransform: 'uppercase',
    },
    avatarCenteredBlock: {
        alignItems: 'center',
        marginTop: 8,
    },
    avatarOuterRing: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 1.5,
        borderColor: '#D4AF37', // Dual premium gold outer ring
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    avatarInnerRing: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1.5,
        borderColor: '#FFFFFF', // Glowing white inner ring
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0E1628',
    },
    profileImg: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#0E1628',
    },
    verifiedIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#D4AF37', // Verified Gold Indicator
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#050B18',
    },
    usernameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    usernameText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif-medium',
        letterSpacing: -0.5,
    },
    eliteBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 10,
        gap: 4,
    },
    eliteBadgeText: {
        color: '#D4AF37',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1.0,
    },
    emailText: {
        fontSize: 12,
        color: '#8E96A8',
        fontWeight: '600',
        marginTop: 2,
    },
    container: {
        paddingHorizontal: 16,
    },
    heroPortfolioCard: {
        backgroundColor: '#0E1628', // Surface Elevated Navy
        borderRadius: 20,
        padding: 20,
        marginTop: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
    },
    heroGoldAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#D4AF37', // Gold Accent top border
    },
    heroCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#8E96A8',
        letterSpacing: 0.5,
    },
    heroValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 6,
        letterSpacing: -0.5,
    },
    heroGrowthBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(22, 199, 132, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 4,
    },
    heroGrowthText: {
        color: '#16C784',
        fontSize: 12,
        fontWeight: '700',
    },
    heroCardDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginVertical: 16,
    },
    heroCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heroFooterItem: {
        flexDirection: 'column',
    },
    heroFooterLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#8E96A8',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    tierTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        gap: 4,
    },
    tierTagText: {
        color: '#D4AF37',
        fontSize: 9,
        fontWeight: '800',
    },
    heroFooterValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 2,
    },
    chartCard: {
        backgroundColor: '#0E1628',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 14,
        marginBottom: 20,
    },
    chartHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
        paddingBottom: 10,
        marginBottom: 10,
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    chartSubtitle: {
        fontSize: 9,
        color: '#8E96A8',
        marginTop: 2,
    },
    chartGrowthTextContainer: {
        alignItems: 'flex-end',
    },
    chartPeakVal: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    chartRangeGrowth: {
        fontSize: 9,
        fontWeight: '700',
        color: '#16C784',
        marginTop: 2,
    },
    svgContainer: {
        alignItems: 'center',
        marginTop: 6,
    },
    chartMonthsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 8,
        marginTop: 6,
        marginBottom: 14,
    },
    monthText: {
        fontSize: 9,
        color: '#8E96A8',
        fontWeight: 'bold',
    },
    segmentedControlWrapper: {
        flexDirection: 'row',
        backgroundColor: '#050B18',
        borderRadius: 12,
        height: 38,
        padding: 2,
        position: 'relative',
    },
    slidingPill: {
        position: 'absolute',
        top: 2,
        bottom: 2,
        backgroundColor: '#FF7A45', // Primary Fintech Coral
        borderRadius: 10,
        shadowColor: '#FF7A45',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    segmentedTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    segmentedTabText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#8E96A8',
    },
    segmentedTabTextActive: {
        color: '#FFFFFF',
    },
    metricCardsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#0E1628',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    metricIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 122, 69, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    metricLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#8E96A8',
        letterSpacing: 0.5,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 2,
    },
    metricSubtext: {
        fontSize: 9,
        color: '#8E96A8',
        marginTop: 4,
    },
    metalMemberCard: {
        backgroundColor: '#0E1628', 
        borderRadius: 20,
        padding: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)', // Premium gold subtle border
        position: 'relative',
        overflow: 'hidden',
    },
    metalCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metalTierText: {
        color: '#D4AF37', // Gold Tier Header
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 0.8,
    },
    metalCardSub: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginTop: 4,
    },
    metalCardBankInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 22,
    },
    metalLabel: {
        fontSize: 7,
        color: '#8E96A8',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    metalValue: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginTop: 3,
        letterSpacing: 0.2,
    },
    statusVerifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(22, 199, 132, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(22, 199, 132, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    statusDotVerified: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#16C784',
    },
    statusTextVerified: {
        color: '#16C784',
        fontSize: 7,
        fontWeight: 'bold',
    },
    menuGrid: {
        marginBottom: 24,
        gap: 12,
    },
    sectionHeaderTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#8E96A8',
        letterSpacing: 1.0,
        marginBottom: 4,
    },
    tappableMenuCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#0E1628',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    tappableCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircleBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tappableCardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    tappableCardSub: {
        fontSize: 10,
        color: '#8E96A8',
        marginTop: 2,
    },
    logoutWrapper: {
        marginTop: 16,
        alignItems: 'center',
    },
    subtleRedLink: {
        minWidth: 150,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutLinkText: {
        color: '#FF4560', 
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    }
});
