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
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import { theme } from '../config/theme';
import * as yup from 'yup';
import { authentication } from '../config/firebase.config';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { db } from '../config/firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const schema = yup.object().shape({
    fName: yup.string().min(2, 'First name is too short').required('First name is required'),
    lName: yup.string().min(2, 'Last name is too short').required('Last name is required'),
    email: yup.string().email('Please enter a valid email').min(8).max(60).required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').max(32).required('Password is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required')
});

export function CreateAccount({ navigation }) {
    const [focusedField, setFocusedField] = useState(null);

    const handleCreateAccount = async (email, pass, fName, lName) => {
        await createUserWithEmailAndPassword(authentication, email, pass)
            .then(() => {
                Alert.alert(
                    'Status Report',
                    'Your Rebid account was created successfully!',
                    [{
                        text: 'PROCEED',
                        onPress: () => navigation.navigate('onboarding')
                    }]
                );

                onAuthStateChanged(authentication, (user) => {
                    if (user) {
                        const uid = user.uid;
                        setDoc(doc(db, 'users', uid), {
                            firstName: fName,
                            lastName: lName,
                            email: email,
                            createdAt: new Date().getTime(),
                        });
                    }
                });
            })
            .catch((e) => Alert.alert(
                'Status Report',
                'Failed to create account. Please verify details or try another email.',
                [{ text: 'Dismiss', onPress: () => console.error(e) }]
            ));
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                
                {/* Diagonal Splice gradient at the top third */}
                <View style={styles.diagonalSplitContainer}>
                    <Svg height="220" width={width} viewBox={`0 0 ${width} 220`} preserveAspectRatio="none">
                        <Defs>
                            <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
                                <Stop offset="0%" stopColor="#0D1B2A" />
                                <Stop offset="100%" stopColor="#1B2D42" />
                            </LinearGradient>
                        </Defs>
                        <Path d={`M0 0 H${width} V160 L0 220 Z`} fill="url(#headerGrad)" />
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
                                            textColor="#0D1B2A"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'fName' ? '#FF6B35' : 'rgba(13, 27, 42, 0.15)'}
                                            style={styles.textInput}
                                            theme={{ roundness: 12 }}
                                        />
                                        {errors.fName && touched.fName ? (
                                            <Text style={styles.errorText}>{errors.fName}</Text>
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
                                            textColor="#0D1B2A"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'lName' ? '#FF6B35' : 'rgba(13, 27, 42, 0.15)'}
                                            style={styles.textInput}
                                            theme={{ roundness: 12 }}
                                        />
                                        {errors.lName && touched.lName ? (
                                            <Text style={styles.errorText}>{errors.lName}</Text>
                                        ) : null}
                                    </View>

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
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'email' ? '#FF6B35' : 'rgba(13, 27, 42, 0.15)'}
                                            style={styles.textInput}
                                            theme={{ roundness: 12 }}
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
                                            label='Create Password'
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

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            mode='outlined'
                                            secureTextEntry={true}
                                            value={values.passwordConfirmation}
                                            onChangeText={handleChange('passwordConfirmation')}
                                            onBlur={(e) => {
                                                handleBlur('passwordConfirmation')(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('passwordConfirmation')}
                                            label='Confirm Password'
                                            textColor="#0D1B2A"
                                            activeOutlineColor="#FF6B35"
                                            outlineColor={focusedField === 'passwordConfirmation' ? '#FF6B35' : 'rgba(13, 27, 42, 0.15)'}
                                            style={styles.textInput}
                                            theme={{ roundness: 12 }}
                                        />
                                        {errors.passwordConfirmation && touched.passwordConfirmation ? (
                                            <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
                                        ) : null}
                                    </View>

                                    <Button 
                                        mode='contained'
                                        buttonColor="#FF6B35" // specs warm coral Accent
                                        textColor="#FFFFFF"
                                        style={styles.signUpButton}
                                        labelStyle={styles.btnLabel}
                                        onPress={handleSubmit}>
                                        Create Account
                                    </Button>
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
        backgroundColor: '#F7F7F8', // Off-White Specs background
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
        color: '#FFFFFF',
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
        paddingHorizontal: 16,
        marginTop: -30,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
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
    signUpButton: {
        marginTop: 8,
        borderRadius: 12,
        paddingVertical: 8,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
        height: 48,
        justifyContent: 'center',
    },
    btnLabel: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
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
        fontWeight: '800',
        color: '#FF6B35',
    }
});