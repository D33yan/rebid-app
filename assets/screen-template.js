/*
PARTS WITH CHANGES

1. All TextInput ===>> changed all onChange to onChangeText
2. {({ handleChange, handleBlur, handleSubmit, values, touched }) ===>> added errors
3. <Text style={styles.errorText}>error</Text> ===>> some logic
*/

import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import { TextInput,Button } from 'react-native-paper';
import { theme } from '../config/theme';
import { authentication } from '../config/firebase.config';
import { db } from '../config/firebase.config';



export function Profile({navigation}) {
    return (    
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>

            </View>    
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        marginTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container:{
        flex:1,
        paddingHorizontal:8,
        flexDirection:'column',
        gap:16,
    },
    
})