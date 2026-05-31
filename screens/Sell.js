import React, { useState } from 'react';
import { 
    View,
    Text,
    Alert,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { theme } from '../config/theme';
import { useThemeToggle } from '../config/theme-context';
import { useToast } from '../utilities/ToastService';
import { Formik } from 'formik';
import * as yup from 'yup';
import { api } from '../utilities/api';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../assets/categories';

const { width } = Dimensions.get('window');

const schema = yup.object().shape({
    title: yup.string().min(8, 'Title is too short').max(60).required('Title is required'),
    description: yup.string().min(16, 'Description is too short').max(1200).required('Description is required'),
    initialPrice: yup.number().positive().required('Initial price is required'),
    bidIncrement: yup.number().positive().required('Bid increment is required'),
    photoUrl: yup.string().url('Must be a valid URL link').required('Photo URL link is required'),
    endDate: yup.string().required('Expiration date is required')
});

export function Sell({ navigation }) {
    const { colors, isDarkMode } = useThemeToggle();
    const { showToast } = useToast();
    
    // Specs: Step-indicator at top (1 -> 2 -> 3)
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].title);

    const handleCreateAuction = async (values, resetForm) => {
        try {
            await api.auctions.create({
                title: values.title,
                description: values.description,
                initialPrice: Number(values.initialPrice),
                bidIncrement: Number(values.bidIncrement),
                photoUrl: values.photoUrl,
                endDate: values.endDate,
                category: selectedCategory,
            });

            showToast('success', 'Auction Created Successfully!', 'Your luxury lot has been registered in the catalog.');
            resetForm();
            setCurrentStep(1);
            navigation.navigate('my-home'); // Rebid main screen is my-home in stack navigation
        } catch (e) {
            console.error(e);
            showToast('outbid', 'System Error', e.message || 'Failed to save auction lot onto Supabase database.');
        }
    };

    return (    
        <SafeAreaView style={[styles.wrapper, { backgroundColor: isDarkMode ? '#060D14' : '#F7F7F8' }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            
            {/* Specs: Clean white form screen — NO background image */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>List New Item</Text>
                    <Text style={styles.headerSubtitle}>Complete details to post to Nigerian buyers.</Text>
                </View>

                {/* Specs: Step-indicator at top (1 -> 2 -> 3) */}
                <View style={styles.stepContainer}>
                    <View style={styles.stepRow}>
                        <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStepCircle]}>
                            <Text style={[styles.stepNum, currentStep >= 1 && styles.activeStepText]}>1</Text>
                        </View>
                        <View style={[styles.stepLine, currentStep >= 2 && styles.activeStepLine]} />
                        <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStepCircle]}>
                            <Text style={[styles.stepNum, currentStep >= 2 && styles.activeStepText]}>2</Text>
                        </View>
                        <View style={[styles.stepLine, currentStep >= 3 && styles.activeStepLine]} />
                        <View style={[styles.stepCircle, currentStep >= 3 && styles.activeStepCircle]}>
                            <Text style={[styles.stepNum, currentStep >= 3 && styles.activeStepText]}>3</Text>
                        </View>
                    </View>
                    <View style={styles.stepLabelsRow}>
                        <Text style={[styles.stepLabel, currentStep === 1 && styles.activeStepLabel]}>LOT DETAILS</Text>
                        <Text style={[styles.stepLabel, currentStep === 2 && styles.activeStepLabel]}>MEDIA ZONE</Text>
                        <Text style={[styles.stepLabel, currentStep === 3 && styles.activeStepLabel]}>BIDDING DETAILS</Text>
                    </View>
                </View>

                <Formik
                    initialValues={{ title: '', description: '', initialPrice: '', bidIncrement: '', photoUrl: '', endDate: '' }}
                    validationSchema={schema}
                    onSubmit={(values, { resetForm }) => handleCreateAuction(values, resetForm)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, resetForm }) => (
                        <View style={[styles.formCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#FFFFFF' }]}>
                            
                            {/* STEP 1: Basic Lot Details */}
                            {currentStep === 1 && (
                                <View style={styles.stepView}>
                                    {/* Specs: Category selection uses horizontal pill scroll, not a grid dump */}
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>SELECT LOT CATEGORY</Text>
                                        <ScrollView 
                                            horizontal 
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.categoryPillsScroll}>
                                            {categories.map(cat => {
                                                const isActive = selectedCategory === cat.title;
                                                return (
                                                    <TouchableOpacity 
                                                        key={cat.id}
                                                        style={[
                                                            styles.categoryPill, 
                                                            isActive && styles.activeCategoryPill,
                                                            { backgroundColor: isDarkMode ? '#1E2D3B' : '#F7F7F8' }
                                                        ]}
                                                        onPress={() => setSelectedCategory(cat.title)}>
                                                        <Text style={[
                                                            styles.categoryPillText, 
                                                            isActive && styles.activeCategoryPillText,
                                                            { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }
                                                        ]}>
                                                            {cat.title}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </ScrollView>
                                    </View>

                                    {/* Specs: Each input is clearly labeled above the field */}
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>ITEM TITLE</Text>
                                        <TextInput
                                            mode='outlined'
                                            value={values.title}
                                            onChangeText={handleChange('title')}
                                            onBlur={handleBlur('title')}
                                            textColor={isDarkMode ? '#F0F0F0' : '#0D1B2A'}
                                            activeOutlineColor="#FF6B35"
                                            placeholder='e.g., Audemars Piguet Chronograph'
                                            theme={{ roundness: 12 }}
                                            style={styles.textInput}
                                        />
                                        {errors.title && touched.title ? (
                                            <Text style={styles.errorText}>{errors.title}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>LOT DESCRIPTION</Text>
                                        <TextInput
                                            mode='outlined'
                                            multiline={true}
                                            numberOfLines={4}
                                            value={values.description}
                                            onChangeText={handleChange('description')}
                                            onBlur={handleBlur('description')}
                                            textColor={isDarkMode ? '#F0F0F0' : '#0D1B2A'}
                                            activeOutlineColor="#FF6B35"
                                            placeholder='Provide rich specifications and condition details...'
                                            theme={{ roundness: 12 }}
                                            style={styles.textInputMultiline}
                                        />
                                        {errors.description && touched.description ? (
                                            <Text style={styles.errorText}>{errors.description}</Text>
                                        ) : null}
                                    </View>

                                    <Button 
                                        mode='contained'
                                        buttonColor="#FF6B35"
                                        textColor="#FFFFFF"
                                        style={styles.actionBtn}
                                        labelStyle={styles.btnLabel}
                                        onPress={() => {
                                            if (values.title && values.description && !errors.title && !errors.description) {
                                                setCurrentStep(2);
                                            } else {
                                                Alert.alert("Missing Details", "Please verify item title and description inputs.");
                                            }
                                        }}>
                                        Continue
                                    </Button>
                                </View>
                            )}

                            {/* STEP 2: Media Zones */}
                            {currentStep === 2 && (
                                <View style={styles.stepView}>
                                    <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>UPLOAD LOT MEDIA</Text>
                                    
                                    {/* Specs: Image upload zone is a dashed bordered box with camera icon */}
                                    <TouchableOpacity 
                                        style={[
                                            styles.dashedUploadZone, 
                                            { borderColor: '#FF6B35', backgroundColor: isDarkMode ? '#1E2D3B' : '#FAF8F9' }
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => Alert.alert("Media Uploads", "Launching Native Camera roll selection...")}>
                                        <Ionicons name="camera-outline" size={32} color="#FF6B35" />
                                        <Text style={styles.dashedText}>TAP TO SELECT IMAGES</Text>
                                        <Text style={styles.dashedSubtitle}>Supports high-resolution PNG, JPG, or WEBP up to 8MB</Text>
                                    </TouchableOpacity>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>DIRECT IMAGE WEB LINK</Text>
                                        <TextInput
                                            mode='outlined'
                                            value={values.photoUrl}
                                            onChangeText={handleChange('photoUrl')}
                                            onBlur={handleBlur('photoUrl')}
                                            textColor={isDarkMode ? '#F0F0F0' : '#0D1B2A'}
                                            activeOutlineColor="#FF6B35"
                                            placeholder='e.g., https://images.unsplash.com/photo-...'
                                            theme={{ roundness: 12 }}
                                            style={styles.textInput}
                                        />
                                        {errors.photoUrl && touched.photoUrl ? (
                                            <Text style={styles.errorText}>{errors.photoUrl}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.backStepBtn} onPress={() => setCurrentStep(1)}>
                                            <Text style={styles.backStepText}>Back</Text>
                                        </TouchableOpacity>
                                        
                                        <Button 
                                            mode='contained'
                                            buttonColor="#FF6B35"
                                            textColor="#FFFFFF"
                                            style={[styles.actionBtn, { flex: 2 }]}
                                            labelStyle={styles.btnLabel}
                                            onPress={() => {
                                                if (values.photoUrl && !errors.photoUrl) {
                                                    setCurrentStep(3);
                                                } else {
                                                    Alert.alert("Missing Media", "Please provide a valid web image link.");
                                                }
                                            }}>
                                            Continue
                                        </Button>
                                    </View>
                                </View>
                            )}

                            {/* STEP 3: Pricing & Expiration */}
                            {currentStep === 3 && (
                                <View style={styles.stepView}>
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>STARTING BID (₦)</Text>
                                        <TextInput
                                            mode='outlined'
                                            keyboardType='number-pad'
                                            value={values.initialPrice}
                                            onChangeText={handleChange('initialPrice')}
                                            onBlur={handleBlur('initialPrice')}
                                            textColor={isDarkMode ? '#F0F0F0' : '#0D1B2A'}
                                            activeOutlineColor="#FF6B35"
                                            placeholder='e.g., 2500000'
                                            theme={{ roundness: 12 }}
                                            style={styles.textInput}
                                        />
                                        {errors.initialPrice && touched.initialPrice ? (
                                            <Text style={styles.errorText}>{errors.initialPrice}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>MINIMUM BID INCREMENT (₦)</Text>
                                        <TextInput
                                            mode='outlined'
                                            keyboardType='number-pad'
                                            value={values.bidIncrement}
                                            onChangeText={handleChange('bidIncrement')}
                                            onBlur={handleBlur('bidIncrement')}
                                            textColor={isDarkMode ? '#F0F0F0' : '#0D1B2A'}
                                            activeOutlineColor="#FF6B35"
                                            placeholder='e.g., 10000'
                                            theme={{ roundness: 12 }}
                                            style={styles.textInput}
                                        />
                                        {errors.bidIncrement && touched.bidIncrement ? (
                                            <Text style={styles.errorText}>{errors.bidIncrement}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: isDarkMode ? '#F0F0F0' : '#0D1B2A' }]}>LOT CLOSING DATE / TIME</Text>
                                        <TextInput
                                            mode='outlined'
                                            value={values.endDate}
                                            onChangeText={handleChange('endDate')}
                                            onBlur={handleBlur('endDate')}
                                            textColor={isDarkMode ? '#F0F0F0' : '#0D1B2A'}
                                            activeOutlineColor="#FF6B35"
                                            placeholder='e.g., 02:45:07 or 1d 8h'
                                            theme={{ roundness: 12 }}
                                            style={styles.textInput}
                                        />
                                        {errors.endDate && touched.endDate ? (
                                            <Text style={styles.errorText}>{errors.endDate}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.backStepBtn} onPress={() => setCurrentStep(2)}>
                                            <Text style={styles.backStepText}>Back</Text>
                                        </TouchableOpacity>
                                        
                                        <Button 
                                            mode='contained'
                                            buttonColor="#FF6B35" // specs Warm Coral Accent
                                            textColor="#FFFFFF"
                                            style={[styles.actionBtn, { flex: 2 }]}
                                            labelStyle={styles.btnLabel}
                                            onPress={handleSubmit}>
                                            Create Auction
                                        </Button>
                                    </View>
                                </View>
                            )}

                        </View>
                    )}
                </Formik>
            </ScrollView>    
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 4,
    },
    stepContainer: {
        paddingHorizontal: 20,
        marginVertical: 16,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStepCircle: {
        backgroundColor: '#FF6B35', // Highlight Active step indicators
    },
    stepNum: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '800',
    },
    activeStepText: {
        color: '#FFFFFF',
    },
    stepLine: {
        flex: 1,
        height: 3,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 8,
    },
    activeStepLine: {
        backgroundColor: '#FF6B35',
    },
    stepLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 4,
    },
    stepLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    activeStepLabel: {
        color: '#FF6B35',
    },
    formCard: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.04)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    stepView: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    categoryPillsScroll: {
        paddingVertical: 4,
        gap: 8,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    activeCategoryPill: {
        borderColor: '#FF6B35', // Warm Coral outline category highlight
    },
    categoryPillText: {
        fontSize: 11,
        fontWeight: '700',
    },
    activeCategoryPillText: {
        color: '#FF6B35',
        fontWeight: '800',
    },
    textInput: {
        backgroundColor: 'transparent',
        fontSize: 14,
    },
    textInputMultiline: {
        backgroundColor: 'transparent',
        fontSize: 14,
        height: 100,
    },
    errorText: {
        fontSize: 11,
        color: '#E11D48',
        marginTop: 2,
        marginLeft: 4,
        fontWeight: '600',
    },
    dashedUploadZone: {
        height: 140,
        borderWidth: 1.5,
        borderStyle: 'dashed', // Specs: Dashed upload zone
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 4,
    },
    dashedText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FF6B35',
        letterSpacing: 0.5,
    },
    dashedSubtitle: {
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    backStepBtn: {
        flex: 1,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#0D1B2A',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backStepText: {
        color: '#0D1B2A',
        fontSize: 13,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    actionBtn: {
        borderRadius: 12,
        paddingVertical: 8,
        height: 48,
        justifyContent: 'center',
    },
    btnLabel: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    }
});