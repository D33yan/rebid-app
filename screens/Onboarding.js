import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    Dimensions, 
    Platform, 
    StatusBar,
    ImageBackground
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay
} from 'react-native-reanimated';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
import { AppContext } from '../config/app-context';

const slides = [
    {
        id: '1',
        title: 'Browse Premium Auctions',
        subtitle: 'Explore an exclusive catalog of luxury real estate, high-performance vehicles, and premium jewelry.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080'
    },
    {
        id: '2',
        title: 'Place Bids & Win',
        subtitle: 'Compete in high-stakes auctions under strict safety with real-time bidding feedback.',
        image: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=1080'
    },
    {
        id: '3',
        title: 'Sell Your Luxury Lots',
        subtitle: 'List your luxury item within 60 seconds and cash out securely to bank transfer.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1080'
    }
];

export function Onboarding({ route, navigation }) {
    const { login } = useContext(AppContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    // Reanimated Shared Values for dynamic slide entry transitions
    const translateY = useSharedValue(40);
    const opacity = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        // Trigger entrance animations when the slide index shifts
        translateY.value = 40;
        opacity.value = 0;
        
        translateY.value = withTiming(0, { duration: 600 });
        opacity.value = withTiming(1, { duration: 600 });

        if (activeIndex === 2) {
            buttonOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
        } else {
            buttonOpacity.value = 0;
        }
    }, [activeIndex]);

    const handleSkip = async () => {
        const userId = route.params?.userId || 'new_user';
        await login(userId);
    };

    const handleNext = async () => {
        if (activeIndex < 2) {
            flatListRef.current.scrollToIndex({ index: activeIndex + 1 });
            setActiveIndex(activeIndex + 1);
        } else {
            const userId = route.params?.userId || 'new_user';
            await login(userId);
        }
    };

    const onMomentumScrollEnd = (e) => {
        const contentOffset = e.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / width);
        setActiveIndex(index);
    };

    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            opacity: opacity.value,
        };
    });

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
        };
    });

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Swipeable Slides Paginator */}
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item }) => (
                    <ImageBackground source={{ uri: item.image }} style={styles.slideBg}>
                        {/* Absolute Bottom Linear Gradient Mask */}
                        <View style={StyleSheet.absoluteFillObject}>
                            <Svg height="100%" width="100%">
                                <Defs>
                                    <LinearGradient id="blackMask" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#0A0F1E" stopOpacity="0" />
                                        <Stop offset="40%" stopColor="#0A0F1E" stopOpacity="0.4" />
                                        <Stop offset="85%" stopColor="#0A0F1E" stopOpacity="1" />
                                    </LinearGradient>
                                </Defs>
                                <Rect width="100%" height="100%" fill="url(#blackMask)" />
                            </Svg>
                        </View>
                    </ImageBackground>
                )}
                keyExtractor={(item) => item.id}
            />

            {/* Top Right SKIP button */}
            <View style={styles.header}>
                <View />
                {activeIndex < 2 && (
                    <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                        <Text style={styles.skipText}>SKIP</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Slide Content Anchored Bottom */}
            <View style={styles.contentOverlay}>
                <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
                    <Text style={styles.title}>{slides[activeIndex].title}</Text>
                    <Text style={styles.subtitle}>{slides[activeIndex].subtitle}</Text>
                </Animated.View>
            </View>

            {/* Footer containing dots and CTAs */}
            <View style={styles.footer}>
                {/* Dot indicators: Inactive = #1C2333 circle, active = #FF6B35 24px pill */}
                <View style={styles.indicatorContainer}>
                    {slides.map((_, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <View 
                                key={index} 
                                style={[
                                    styles.dot, 
                                    isActive ? styles.activeDot : styles.inactiveDot
                                ]} 
                            />
                        );
                    })}
                </View>

                {activeIndex === 2 ? (
                    <Animated.View style={buttonAnimatedStyle}>
                        <TouchableOpacity 
                            style={styles.ctaBtn} 
                            activeOpacity={0.9} 
                            onPress={handleNext}>
                            <Svg height="52" width={160} style={StyleSheet.absoluteFillObject}>
                                <Defs>
                                    <LinearGradient id="coralBtn" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <Stop offset="0%" stopColor="#FF6B35" />
                                        <Stop offset="100%" stopColor="#FF4500" />
                                    </LinearGradient>
                                </Defs>
                                <Rect width="100%" height="100%" rx="14" fill="url(#coralBtn)" />
                            </Svg>
                            <Text style={styles.ctaText}>Get Started →</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <TouchableOpacity 
                        style={styles.nextBtn} 
                        activeOpacity={0.9} 
                        onPress={handleNext}>
                        <Text style={styles.nextBtnText}>Continue</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 100,
    },
    skipBtn: {
        minWidth: 48,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FF6B35',
        letterSpacing: 0.5,
    },
    slideBg: {
        width: width,
        height: height,
        justifyContent: 'flex-end',
    },
    contentOverlay: {
        position: 'absolute',
        bottom: 160,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        alignItems: 'center',
        zIndex: 50,
    },
    textContainer: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#F1F5F9',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#CBD5E1',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 24,
        paddingHorizontal: 8,
    },
    footer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 44 : 32,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
    },
    indicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    inactiveDot: {
        width: 8,
        backgroundColor: '#1C2333',
    },
    activeDot: {
        width: 24,
        backgroundColor: '#FF6B35',
    },
    nextBtn: {
        height: 52,
        backgroundColor: '#1C2333',
        borderRadius: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    nextBtnText: {
        color: '#F1F5F9',
        fontWeight: '700',
        fontSize: 14,
    },
    ctaBtn: {
        width: 160,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 6,
        position: 'relative',
    },
    ctaText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    }
});
