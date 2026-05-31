import { useContext, useState } from 'react';
import { AppContext } from '../config/app-context';
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    Alert,
    ScrollView,
    Dimensions
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import { theme } from '../config/theme';
import * as yup from 'yup';
import { authentication } from '../config/firebase.config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').min(8).max(60).required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').max(32).required('Password is required'),
});

export function Signin({ navigation }) {
    const { login } = useContext(AppContext);
    const [focusedField, setFocusedField] = useState(null);

    const handleSignin = async (email, pass) => {
        await signInWithEmailAndPassword(authentication, email, pass)
            .then(() => {
                onAuthStateChanged(authentication, (user) => {
                    console.log("Logged in user:", user);
                });
                navigation.navigate('starter');
            })
            .catch((e) => Alert.alert(
                'Status Report',
                'Failed to sign in. Please verify your email and password.',
                [{ text: 'Dismiss', onPress: () => console.error(e) }]
            ));
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                
                {/* Specs: Subtle diagonal split or gradient at the top third */}
                <View style={styles.diagonalSplitContainer}>
                    <Svg height="220" width={width} viewBox={`0 0 ${width} 220`} preserveAspectRatio="none">
                        <Defs>
                            <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
                                <Stop offset="0%" stopColor="#0D1B2A" />
                                <Stop offset="100%" stopColor="#1B2D42" />
                            </LinearGradient>
                        </Defs>
                        {/* Diagonal Splice */}
                        <Path d={`M0 0 H${width} V160 L0 220 Z`} fill="url(#headerGrad)" />
                        {/* Coral secondary slice */}
                        <Path d={`M0 160 L${width} 120 V150 Z`} fill="#FF6B35" opacity="0.3" />
                    </Svg>
                    
                    {/* Centered Logo and Tagline */}
                    <View style={styles.brandWrapper}>
                        <Text style={styles.brandName}>Rebid</Text>
                        <Text style={styles.tagline}>Nigeria's Premium Mobile Auction Marketplace</Text>
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.formCard}>
                        <Text style={styles.formHeader}>Sign In</Text>
                        
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            onSubmit={values => handleSignin(values.email, values.password)}
                            validationSchema={schema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                                <>
                                    {/* Outlined input with 12px corners and custom focus outline */}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            keyboardType='email-address'
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            onBlur={(e) => {
                                                handleBlur('email')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('email')}
                                            label='Email Address'
                                            textColor="#0D1B2A"
                                            activeOutlineColor="#FF6B35" // Specs: Visible focus state
                                            outlineColor={focusedField === 'email' ? '#FF6B35' : 'rgba(13, 27, 42, 0.15)'}
                                            style={styles.textInput}
                                            theme={{ roundness: 12 }} // Specs: 12px rounded corner inputs
                                        />
                                        {errors.email && touched.email ? (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            secureTextEntry={true}
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            onBlur={(e) => {
                                                handleBlur('password')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('password')}
                                            label='Password'
                                            textColor="#0D1B2A"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'password' ? '#FF6B35' : 'rgba(13, 27, 42, 0.15)'}
                                            style={styles.textInput}
                                            theme={{ roundness: 12 }}
                                        />
                                        {errors.password && touched.password ? (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        ) : null}
                                    </View>
                                     
                                    {/* Full-width coral fill button */}
                                    <Button 
                                        mode='contained'
                                        buttonColor="#FF6B35" // Specs: Warm coral accent fill
                                        textColor="#FFFFFF"
                                        style={styles.signInButton}
                                        labelStyle={styles.btnLabel}
                                        onPress={handleSubmit}>
                                        Sign In
                                    </Button>
                                </>
                            )}
                        </Formik>
                        
                        {/* Specs: Social sign-in options (Google) */}
                        <View style={styles.socialDividerRow}>
                            <View style={styles.line} />
                            <Text style={styles.socialDividerText}>OR CONNECT WITH</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity 
                            style={styles.googleBtn} 
                            activeOpacity={0.8}
                            onPress={() => Alert.alert("Google Authentication", "Initializing Google secure single sign-on...")}>
                            <Ionicons name="logo-google" size={16} color="#0D1B2A" />
                            <Text style={styles.googleBtnText}>Continue with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.existingUser}>
                        <Text style={styles.existingUserText}>Don't have a Rebid account?</Text>
                        <TouchableOpacity 
                            style={styles.linkTouch}
                            onPress={() => navigation.navigate('create-account')}>
                            <Text style={styles.signUpLinkText}>Sign up now</Text>
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
        backgroundColor: '#F7F7F8', // Specs: Clean Off-White canvas
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    diagonalSplitContainer: {
        position: 'relative',
        height: 230,
    },
    brandWrapper: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    brandName: {
        fontSize: 38,
        fontWeight: '900',
        color: '#FFFFFF', // Contrast white on navy diagonal split
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 6,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    container: {
        paddingHorizontal: 16, // Specs: 16px horizontal padding
        marginTop: -30, // overlap onto split gradient card
    },
    formCard: {
        backgroundColor: '#FFFFFF', // solid white container
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 27, 42, 0.05)',
        padding: 20,
        ...theme.shadows.glass,
    },
    formHeader: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0D1B2A',
        marginBottom: 20,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    inputContainer: {
        marginBottom: 16,
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        fontSize: 14,
    },
    errorText: {
        fontSize: 11,
        color: '#E11D48',
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '600',
    },
    signInButton: {
        marginTop: 8,
        borderRadius: 12, // 12px corners matching inputs
        paddingVertical: 8,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
        height: 48, // Accessibility target height
        justifyContent: 'center',
    },
    btnLabel: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    socialDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(13, 27, 42, 0.08)',
    },
    socialDividerText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.8,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#0D1B2A', // Navy border
        borderRadius: 12,
        paddingVertical: 12,
        gap: 8,
        height: 48,
    },
    googleBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0D1B2A',
    },
    existingUser: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 6,
    },
    existingUserText: {
        fontSize: 13,
        color: '#64748B',
    },
    linkTouch: {
        minWidth: 48,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpLinkText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FF6B35', // Coral redirection link text
    }
});