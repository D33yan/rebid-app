import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    Dimensions, 
    Platform, 
    StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export function Onboarding({ navigation }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    const slides = [
        {
            id: '1',
            title: 'Browse Premium Auctions',
            subtitle: 'Explore an exclusive catalog of luxury cars, jewelries, gadgets, and rare designer goods.',
            illustration: (
                <Svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                    {/* Abstract circular backdrop */}
                    <Circle cx="50" cy="50" r="40" fill="#FFE6DD" />
                    {/* Gavel illustration */}
                    <Rect x="42" y="20" width="16" height="30" rx="3" fill="#0D1B2A" transform="rotate(45 50 35)" />
                    <Rect x="20" y="55" width="60" height="8" rx="2" fill="#0D1B2A" />
                    <Circle cx="50" cy="80" r="10" fill="#FF6B35" />
                </Svg>
            )
        },
        {
            id: '2',
            title: 'Place Bids & Win',
            subtitle: 'Compete in real-time high-octane bidding wars with urgent urgency timers and absolute safety.',
            illustration: (
                <Svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                    {/* Backdrop */}
                    <Circle cx="50" cy="50" r="40" fill="#FFE6DD" />
                    {/* Trophy illustration */}
                    <Path d="M30 30 H70 V55 C70 65, 60 75, 50 75 C40 75, 30 65, 30 55 Z" fill="#0D1B2A" />
                    <Path d="M22 35 H30 V45 H22 Z" fill="#FF6B35" />
                    <Path d="M70 35 H78 V45 H70 Z" fill="#FF6B35" />
                    <Rect x="46" y="75" width="8" height="12" fill="#0D1B2A" />
                    <Rect x="35" y="87" width="30" height="5" rx="1.5" fill="#0D1B2A" />
                </Svg>
            )
        },
        {
            id: '3',
            title: 'Sell Your Items',
            subtitle: 'List your assets seamlessly in under 60 seconds and cash out securely to direct bank transfer.',
            illustration: (
                <Svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                    {/* Backdrop */}
                    <Circle cx="50" cy="50" r="40" fill="#FFE6DD" />
                    {/* Dashboard charts illustration */}
                    <Rect x="25" y="25" width="50" height="40" rx="4" fill="#0D1B2A" />
                    <Rect x="30" y="70" width="40" height="8" rx="2" fill="#FF6B35" />
                    {/* Graph lines */}
                    <Path d="M32 50 L42 42 L52 48 L68 35" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <Circle cx="68" cy="35" r="3" fill="#FF6B35" />
                </Svg>
            )
        }
    ];

    const handleSkip = () => {
        navigation.navigate('my-home');
    };

    const handleNext = () => {
        if (activeIndex < 2) {
            flatListRef.current.scrollToIndex({ index: activeIndex + 1 });
            setActiveIndex(prev => prev + 1);
        } else {
            navigation.navigate('my-home');
        }
    };

    const onMomentumScrollEnd = (e) => {
        const contentOffset = e.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / width);
        setActiveIndex(index);
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header with SKIP button */}
            <View style={styles.header}>
                <View />
                <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                    <Text style={styles.skipText}>SKIP</Text>
                </TouchableOpacity>
            </View>

            {/* Slider carousel */}
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.illustrationWrapper}>
                            {item.illustration}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            {/* Footer with indicators and CTA */}
            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {slides.map((_, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <View 
                                key={index} 
                                style={[styles.dot, isActive && styles.activeDot]} 
                            />
                        );
                    })}
                </View>

                <TouchableOpacity 
                    style={styles.ctaBtn} 
                    activeOpacity={0.9} 
                    onPress={handleNext}>
                    <Text style={styles.ctaText}>
                        {activeIndex === 2 ? 'GET STARTED' : 'NEXT'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F7F7F8', // Specs: Clean Off-White canvas
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        height: 48,
    },
    skipBtn: {
        minWidth: 48,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FF6B35', // Specs: Coral skipping trigger
        letterSpacing: 0.5,
    },
    slide: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    illustrationWrapper: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0D1B2A', // Specs: Deep navy H1 section titles
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B', // slate caption text
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1', // soft gray inactive pagination
    },
    activeDot: {
        width: 20, // expanded active pill indicator
        backgroundColor: '#FF6B35', // Specs: warm coral highlight active dot
    },
    ctaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B35', // Specs: warm coral active full fill CTA
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 120,
        height: 48, // Accessibility: 48px touch boundary
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.5,
    }
});
