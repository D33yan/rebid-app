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
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { api, setAuthToken } from '../utilities/api';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export function Signin({ navigation }) {
    const { login } = useContext(AppContext);
    const [focusedField, setFocusedField] = useState(null);

    const handleSignin = async (email, pass) => {
        try {
            const data = await api.auth.login(email, pass);
            await setAuthToken(data.token);
            await login(data.user.id);
            navigation.navigate('my-home');
        } catch (e) {
            Alert.alert(
                'Status Report',
                e.message || 'Failed to sign in. Please verify your email and password.',
                [{ text: 'Dismiss' }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                
                {/* 1. Top 35% of screen: diagonal SVG mask in #1C2333 */}
                <View style={styles.diagonalSplitContainer}>
                    <Svg height="260" width={width} viewBox={`0 0 ${width} 260`} preserveAspectRatio="none">
                        <Path d={`M0 0 H${width} V180 L0 240 Z`} fill="#1C2333" />
                    </Svg>
                    
                    {/* Centered Logo and Screen Title */}
                    <View style={styles.brandWrapper}>
                        <Text style={styles.brandName}>REBID</Text>
                        <Text style={styles.tagline}>Nigeria's Premium Auction Marketplace</Text>
                    </View>
                </View>

                {/* 2. Form Area sits on #111827 card with 24px top border-radius */}
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
                                    {/* TextInputs with 12px corners, active borders, and coral glow tints */}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            onBlur={(e) => {
                                                handleBlur('email')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('email')}
                                            label='Email Address'
                                            textColor="#F1F5F9"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'email' ? '#FF6B35' : 'rgba(255, 255, 255, 0.1)'}
                                            placeholderTextColor="#64748B"
                                            style={[
                                                styles.textInput,
                                                focusedField === 'email' && styles.focusedTextInput
                                            ]}
                                            theme={{ roundness: 12, colors: { surface: '#111827', onSurfaceVariant: '#64748B' } }}
                                        />
                                        {errors.email && touched.email ? (
                                            <View style={styles.errorRow}>
                                                <Ionicons name="warning-outline" size={14} color="#FF4560" />
                                                <Text style={styles.errorText}>{errors.email}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            secureTextEntry={true}
                                            autoCapitalize='none'
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            onBlur={(e) => {
                                                handleBlur('password')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('password')}
                                            label='Password'
                                            textColor="#F1F5F9"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'password' ? '#FF6B35' : 'rgba(255, 255, 255, 0.1)'}
                                            placeholderTextColor="#64748B"
                                            style={[
                                                styles.textInput,
                                                focusedField === 'password' && styles.focusedTextInput
                                            ]}
                                            theme={{ roundness: 12, colors: { surface: '#111827', onSurfaceVariant: '#64748B' } }}
                                        />
                                        {errors.password && touched.password ? (
                                            <View style={styles.errorRow}>
                                                <Ionicons name="warning-outline" size={14} color="#FF4560" />
                                                <Text style={styles.errorText}>{errors.password}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                     
                                    {/* Primary Button: 52px height, 14px radius, active coral glow */}
                                    <TouchableOpacity 
                                        style={styles.signInButton} 
                                        activeOpacity={0.9}
                                        onPress={handleSubmit}>
                                        <Text style={styles.btnLabel}>Sign In</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Formik>
                        
                        {/* Social Divider Row */}
                        <View style={styles.socialDividerRow}>
                            <View style={styles.line} />
                            <Text style={styles.socialDividerText}>OR CONNECT WITH</Text>
                            <View style={styles.line} />
                        </View>

                        {/* Google Button: White background, #1C1C1E border, Google logo vector, Continue with Google */}
                        <TouchableOpacity 
                            style={styles.googleBtn} 
                            activeOpacity={0.8}
                            onPress={() => Alert.alert("Google Authentication", "Initializing Google secure single sign-on...")}>
                            <Svg width="18" height="18" viewBox="0 0 18 18" style={styles.googleIcon}>
                                <Path fill="#EA4335" d="M9 3.6c1.6 0 3 .6 4.1 1.7l3-3C14.3.9 11.9 0 9 0 5.5 0 2.4 2 1 5l3.2 2.5c.7-2.3 2.9-3.9 4.8-3.9z" />
                                <Path fill="#4285F4" d="M17.6 9.2c0-.6 0-1.2-.1-1.7H9v3.3h4.8c-.2 1.1-.8 2-1.8 2.6l3.2 2.5c1.8-1.7 2.4-4.2 2.4-6.7z" />
                                <Path fill="#FBBC05" d="M4.2 10.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L1 4.7C.3 6 .0 7.4.0 9s.3 3 .9 4.3l3.3-2.5z" />
                                <Path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-3.2-2.5c-.8.5-1.8.8-2.8.8-2.9 0-5.3-2-6.2-4.7L.6 11.9C2.1 15.5 5.3 18 9 18z" />
                            </Svg>
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
        backgroundColor: '#0A0F1E',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    diagonalSplitContainer: {
        position: 'relative',
        height: 240,
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
        fontSize: 36,
        fontWeight: '800',
        color: '#F1F5F9',
        letterSpacing: 6,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 6,
        textAlign: 'center',
        letterSpacing: 1,
    },
    container: {
        paddingHorizontal: 16,
        marginTop: -30,
    },
    formCard: {
        backgroundColor: '#111827',
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        padding: 20,
        shadowColor: '#0A0F1E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
    },
    formHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F1F5F9',
        marginBottom: 20,
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
    },
    inputContainer: {
        marginBottom: 16,
    },
    textInput: {
        backgroundColor: '#111827',
        fontSize: 14,
        height: 54,
    },
    focusedTextInput: {
        backgroundColor: 'rgba(255, 107, 53, 0.03)',
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        paddingLeft: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#FF4560',
        fontWeight: '600',
    },
    signInButton: {
        marginTop: 8,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#FF6B35',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 6,
    },
    btnLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    socialDividerText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 0.8,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#1C1C1E',
        borderRadius: 14,
        height: 52,
        gap: 10,
    },
    googleIcon: {
        marginRight: 2,
    },
    googleBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111111',
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
        fontWeight: '700',
        color: '#FF6B35',
    }
});