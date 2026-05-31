import { useState } from 'react';
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
    fName: yup.string().min(2, 'First name is too short').required('First name is required'),
    lName: yup.string().min(2, 'Last name is too short').required('Last name is required'),
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').max(32).required('Password is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required')
});

export function CreateAccount({ navigation }) {
    const [focusedField, setFocusedField] = useState(null);

    const handleCreateAccount = async (email, pass, fName, lName) => {
        try {
            const data = await api.auth.register(fName, lName, email, pass);
            await setAuthToken(data.token);
            Alert.alert(
                'Status Report',
                'Your Rebid account was created successfully!',
                [{
                    text: 'PROCEED',
                    onPress: () => navigation.navigate('verification', { email, userId: data.user.id })
                }]
            );
        } catch (e) {
            Alert.alert(
                'Status Report',
                e.message || 'Failed to create account. Please verify details or try another email.',
                [{ text: 'Dismiss' }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                
                {/* 1. Top 35% diagonal mask */}
                <View style={styles.diagonalSplitContainer}>
                    <Svg height="260" width={width} viewBox={`0 0 ${width} 260`} preserveAspectRatio="none">
                        <Path d={`M0 0 H${width} V180 L0 240 Z`} fill="#1C2333" />
                    </Svg>
                    
                    <View style={styles.brandWrapper}>
                        <Text style={styles.brandName}>REBID</Text>
                        <Text style={styles.tagline}>Nigeria's Premium Auction Marketplace</Text>
                    </View>
                </View>

                {/* 2. Form Area on #111827 Card */}
                <View style={styles.container}>
                    <View style={styles.formCard}>
                        <Text style={styles.formHeader}>Create Account</Text>
                        
                        <Formik
                            initialValues={{ fName: '', lName: '', email: '', password: '', passwordConfirmation: '' }}
                            onSubmit={values => handleCreateAccount(values.email, values.password, values.fName, values.lName)}
                            validationSchema={schema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                                <>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            value={values.fName}
                                            onChangeText={handleChange('fName')}
                                            onBlur={(e) => {
                                                handleBlur('fName')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('fName')}
                                            label='First Name'
                                            textColor="#F1F5F9"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'fName' ? '#FF6B35' : 'rgba(255, 255, 255, 0.1)'}
                                            style={[
                                                styles.textInput,
                                                focusedField === 'fName' && styles.focusedTextInput
                                            ]}
                                            theme={{ roundness: 12, colors: { surface: '#111827', onSurfaceVariant: '#64748B' } }}
                                        />
                                        {errors.fName && touched.fName ? (
                                            <View style={styles.errorRow}>
                                                <Ionicons name="warning-outline" size={14} color="#FF4560" />
                                                <Text style={styles.errorText}>{errors.fName}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            value={values.lName}
                                            onChangeText={handleChange('lName')}
                                            onBlur={(e) => {
                                                handleBlur('lName')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('lName')}
                                            label='Last Name'
                                            textColor="#F1F5F9"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'lName' ? '#FF6B35' : 'rgba(255, 255, 255, 0.1)'}
                                            style={[
                                                styles.textInput,
                                                focusedField === 'lName' && styles.focusedTextInput
                                            ]}
                                            theme={{ roundness: 12, colors: { surface: '#111827', onSurfaceVariant: '#64748B' } }}
                                        />
                                        {errors.lName && touched.lName ? (
                                            <View style={styles.errorRow}>
                                                <Ionicons name="warning-outline" size={14} color="#FF4560" />
                                                <Text style={styles.errorText}>{errors.lName}</Text>
                                            </View>
                                        ) : null}
                                    </View>

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
                                            label='Create Password'
                                            textColor="#F1F5F9"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'password' ? '#FF6B35' : 'rgba(255, 255, 255, 0.1)'}
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

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            secureTextEntry={true}
                                            autoCapitalize='none'
                                            value={values.passwordConfirmation}
                                            onChangeText={handleChange('passwordConfirmation')}
                                            onBlur={(e) => {
                                                handleBlur('passwordConfirmation')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('passwordConfirmation')}
                                            label='Confirm Password'
                                            textColor="#F1F5F9"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'passwordConfirmation' ? '#FF6B35' : 'rgba(255, 255, 255, 0.1)'}
                                            style={[
                                                styles.textInput,
                                                focusedField === 'passwordConfirmation' && styles.focusedTextInput
                                            ]}
                                            theme={{ roundness: 12, colors: { surface: '#111827', onSurfaceVariant: '#64748B' } }}
                                        />
                                        {errors.passwordConfirmation && touched.passwordConfirmation ? (
                                            <View style={styles.errorRow}>
                                                <Ionicons name="warning-outline" size={14} color="#FF4560" />
                                                <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <TouchableOpacity 
                                        style={styles.signUpButton} 
                                        activeOpacity={0.9}
                                        onPress={handleSubmit}>
                                        <Text style={styles.btnLabel}>Create Account</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Formik>
                    </View>

                    <View style={styles.existingUser}>
                        <Text style={styles.existingUserText}>Already have a Rebid account?</Text>
                        <TouchableOpacity 
                            style={styles.linkTouch}
                            onPress={() => navigation.navigate('sign-in')}>
                            <Text style={styles.signInLinkText}>Sign in</Text>
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
    signUpButton: {
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
    signInLinkText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FF6B35',
    }
});