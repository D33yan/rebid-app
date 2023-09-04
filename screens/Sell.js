/*
PARTS WITH CHANGES

1. All TextInput ===>> changed all onChange to onChangeText
2. {({ handleChange, handleBlur, handleSubmit, values, touched }) ===>> added errors
3. <Text style={styles.errorText}>error</Text> ===>> some logic
*/

import { 
    View,
    Text,
    Alert,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Platform,
} from 'react-native';
import { TextInput,Button } from 'react-native-paper';
import { theme } from '../config/theme';
import { authentication } from '../config/firebase.config';
import { db } from '../config/firebase.config';
import { Formik } from 'formik';
import * as yup from 'yup';
import { addDoc,collection,doc } from 'firebase/firestore';

const schema = yup.object().shape({
    title:yup.string().min(16).max(60).required(),
    description:yup.string().min(16).max(1200).required(),
    initialPrice:yup.string().min(1).required(),
    photoUrl:yup.string().min(1).required(),
    endDate:yup.string().required(),
    
});
const userUiD = 'I29AKoX2RYWSiTsbz6cDPQUHrQA2'; //REMEMBER TO UPDATE AND DELETE

const handleCreateAuction = async ( title,description,initialPrice,bidIncrement,photoUrl,endDate)=>{
    await addDoc(collection(db,'auctions'),{
        title:title,
        description:description,
        initialPrice:initialPrice,
        bidIncrement:bidIncrement,
        photoUrl:photoUrl,
        endDate:endDate,
        createdAt:new Date().getTime(),
    })
    .then(()=> Alert.alert(
        'Info',
        'Your auction was created',
        [{
            text:'Dismiss',
        }]))
    .catch((e)=> Alert.alert(
        'Status Report',
        'An error has ocuured!',
        [{
            text:'Dismiss',
            onPress:console.error(e)
        }]))
}

export function Sell({navigation}) {
    return (    
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
            <View style={styles.form}>
                    <Formik
                        initialValues={{
                        title:'',
                        description:'',
                        initialPrice:'',
                        bidIncrement:'',
                        photoUrl:'',
                        endDate:'' }}
                        onSubmit={values => {
                            handleCreateAuction(
                                values.title,
                                values.description,
                                values.initialPrice,
                                values.bidIncrement,
                                values.photoUrl,
                                values.endDate)
                        } }
                        validationSchema={schema}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, touched,errors }) => (
                            <>
                             <View>
                                <TextInput
                                mode='outlined'
                                value={values.title}
                                onChangeText={handleChange('title')}
                                onBlur={handleBlur('title')}
                                placeholder='Title'/>
                                {errors.title && touched.title 
                                ? <Text style={styles.errorText}>{errors.title}</Text> 
                                : null}
                            </View>
                             <View>
                                <TextInput
                                mode='outlined'
                                multiline={true}
                                value={values.description}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                placeholder='description'/>
                                {errors.description && touched.description 
                                ? <Text style={styles.errorText}>{errors.description}</Text> 
                                : null}
                            </View>
                             <View>
                                <TextInput
                                mode='outlined'
                                keyboardType='number-pad'
                                value={values.initialPrice}
                                onChangeText={handleChange('initialPrice')}
                                onBlur={handleBlur('initialPrice')}
                                placeholder='initialPrice'/>
                                {errors.initialPrice && touched.initialPrice 
                                ? <Text style={styles.errorText}>{errors.initialPrice}</Text> 
                                : null}
                            </View>
                             <View>
                                <TextInput
                                mode='outlined'
                                keyboardType='default'
                                value={values.bidIncrement}
                                onChangeText={handleChange('bidIncrement')}
                                onBlur={handleBlur('bidIncrement')}
                                placeholder='bidIncrement'/>
                                {errors.bidIncrement && touched.bidIncrement 
                                ? <Text style={styles.errorText}>{errors.bidIncrement}</Text> 
                                : null}
                            </View>
                             <View>
                                <TextInput
                                mode='outlined'
                                keyboardType='default'
                                value={values.photoUrl}
                                onChangeText={handleChange('photoUrl')}
                                onBlur={handleBlur('photoUrl')}
                                placeholder='link to your image'/>
                                {errors.photoUrl && touched.photoUrl 
                                ? <Text style={styles.errorText}>{errors.photoUrl}</Text> 
                                : null}
                            </View>
                             <View>
                                <TextInput
                                mode='outlined'
                                keyboardType='default'
                                value={values.endDate}
                                onChangeText={handleChange('endDate')}
                                onBlur={handleBlur('endDate')}
                                placeholder='26/01/2009'/>
                                {errors.endDate && touched.endDate 
                                ? <Text style={styles.errorText}>{errors.endDate}</Text> 
                                : null}
                            </View>
                             

                            <Button 
                            mode='contained'
                            buttonColor={theme.colors.navy}
                            textColor={theme.colors.dullRed0}
                            style={{paddingVertical:8}}
                            onPress={handleSubmit}>Create Auction</Button>
                            </>
                        )}
                    </Formik>
                </View>
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
    form:{
        flexDirection:'column',
        gap:8,
    },
    errorText:{
        fontSize:12,
        color:theme.colors.red,
    },
})