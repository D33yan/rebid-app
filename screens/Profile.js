import { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    Image, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    StatusBar, 
    Platform, 
    Alert,
    ScrollView
} from 'react-native';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { AppContext } from '../config/app-context';
import { db } from '../config/firebase.config';
import { CommaSepNum } from '../utilities/comma-sep-num';
import { getDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

export function Profile({ navigation }) {
    const { UID, logout } = useContext(AppContext);
    const { colors, isDarkMode, toggleTheme } = useThemeToggle();
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const activeUID = UID || 'MqFcmcotWvRoTtHd1s91lR81yi13';

    const getUser = async () => {
        try {
            setLoading(true);
            const userDocRef = doc(db, 'users', activeUID);
            const onSnap = await getDoc(userDocRef);
            if (onSnap.exists()) {
                setUser(onSnap.data());
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

    const fullName = user 
        ? `${user.firstName || user.firstname || 'Julian'} ${user.lastName || user.lastname || 'Sterling'}`
        : 'Julian Sterling';

    return (
        <SafeAreaView style={[styles.wrapper, { backgroundColor: isDarkMode ? '#060D14' : '#F7F7F8' }]}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Specs: Full navy header extends behind status bar */}
                <View style={styles.navyHeaderBanner}>
                    <View style={styles.topControlRow}>
                        <TouchableOpacity 
                            style={styles.themeToggleBtn} 
                            onPress={() => {
                                toggleTheme();
                                showToast('success', 'Theme Updated', `Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode.`);
                            }}>
                            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Portfolio</Text>
                        <View style={{ width: 36 }} />
                    </View>

                    {/* Specs: Avatar centered with edit ring */}
                    <View style={styles.avatarCenteredBlock}>
                        <View style={styles.avatarWrapper}>
                            <Image 
                                style={styles.profileImg} 
                                source={require('../assets/user.jpg')} 
                            />
                            {/* Edit Ring */}
                            <TouchableOpacity style={styles.cameraIconContainer} activeOpacity={0.8}>
                                <Ionicons name="camera" size={12} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.usernameText}>{fullName}</Text>
                        <Text style={styles.emailText}>{user?.email || 'julian.sterling@rebid.com'}</Text>
                    </View>
                </View>

                <View style={styles.container}>
                    
                    {/* Specs: Stats row (Earned / Listed / Bids) in coral on white card */}
                    <View style={[styles.statsRowCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                        <View style={styles.statItem}>
                            <Text style={styles.statCoralLabel}>EARNED</Text>
                            <Text style={[styles.statValue, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                ₦{CommaSepNum(291991)}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statCoralLabel}>LISTED</Text>
                            <Text style={[styles.statValue, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                14 lots
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statCoralLabel}>BIDS</Text>
                            <Text style={[styles.statValue, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                48 active
                            </Text>
                        </View>
                    </View>

                    {/* Menu grid section */}
                    <View style={styles.menuGrid}>
                        <Text style={styles.sectionHeaderTitle}>ACCOUNT ACTIONS</Text>

                        {/* Specs: My Products and Active Bids as tappable cards with chevrons */}
                        <TouchableOpacity 
                            style={[styles.tappableMenuCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('auctions')}>
                            <View style={styles.tappableCardLeft}>
                                <View style={styles.iconCircleBg}>
                                    <Ionicons name="cube-outline" size={18} color="#FF6B35" />
                                </View>
                                <Text style={[styles.tappableCardTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                    My Products & Listings
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#FF6B35" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.tappableMenuCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('Home')}>
                            <View style={styles.tappableCardLeft}>
                                <View style={styles.iconCircleBg}>
                                    <Ionicons name="hammer-outline" size={18} color="#FF6B35" />
                                </View>
                                <Text style={[styles.tappableCardTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>
                                    Active Bids Portfolio
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#FF6B35" />
                        </TouchableOpacity>
                    </View>

                    {/* Stats details section */}
                    <View style={[styles.quickInfoCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>MEMBERSHIP TIER</Text>
                            <Text style={styles.infoValueActive}>PREMIUM COLLECTOR</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>REGISTERED BANK</Text>
                            <Text style={[styles.infoValue, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>GTBANK NIGERIA</Text>
                        </View>
                    </View>

                    {/* Specs: Logout button as a subtle red text link at the very bottom, not a full button */}
                    <View style={styles.logoutWrapper}>
                        <TouchableOpacity style={styles.subtleRedLink} onPress={logout}>
                            <Text style={styles.logoutLinkText}>Sign Out of Rebid</Text>
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
        paddingBottom: 40,
    },
    navyHeaderBanner: {
        backgroundColor: '#0D1B2A', // Specs: Deep navy background
        paddingTop: Platform.OS === 'ios' ? 60 : 32, // Extends behind status bar
        paddingBottom: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    avatarCenteredBlock: {
        alignItems: 'center',
        marginTop: 8,
    },
    avatarWrapper: {
        position: 'relative',
    },
    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FF6B35', // Specs: Avatar with edit ring (coral color outline)
        backgroundColor: '#FFFFFF',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6B35',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0D1B2A',
    },
    usernameText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        marginTop: 12,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    emailText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        marginTop: 2,
    },
    container: {
        paddingHorizontal: 16, // Specs: 16px horizontal padding
    },
    statsRowCard: {
        flexDirection: 'row',
        borderRadius: 16,
        paddingVertical: 16,
        marginTop: -20, // overlap card on top third splices
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 107, 53, 0.15)', // Coral tinted dividers
    },
    statCoralLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#FF6B35', // Specs: stats label in coral
        letterSpacing: 0.8,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 4,
    },
    menuGrid: {
        marginTop: 24, // Specs: 24px section spacing
        gap: 12,
    },
    sectionHeaderTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 1.0,
        marginBottom: 4,
    },
    tappableMenuCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
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
        backgroundColor: '#FFE6DD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tappableCardTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    quickInfoCard: {
        borderRadius: 16,
        padding: 16,
        marginTop: 24, // Specs: 24px section spacing
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.8,
    },
    infoValue: {
        fontSize: 12,
        fontWeight: '700',
    },
    infoValueActive: {
        color: '#FF6B35',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    logoutWrapper: {
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtleRedLink: {
        minWidth: 120,
        minHeight: 48, // Accessibility target touch size
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutLinkText: {
        color: '#E11D48', // Specs: logout button as subtle red text link
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.2,
    }
});
