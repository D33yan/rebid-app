import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    Image
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';
import { TextInput,Button,IconButton } from 'react-native-paper';
import { theme } from '../config/theme';
import { authentication } from '../config/firebase.config';
import { db } from '../config/firebase.config';
import { getDocs,collection } from 'firebase/firestore';
import {useState} from 'react'; 


export function AuctionSelect({navigation}) {

    const getAuctions = async () => {
        const onSnap = await getDocs(collection(db,'auctions'))
        setAuctions(onSnap.docs.map(doc => {
            return {
                id:doc.id,
                data:{
                    ...doc.data()
                }
            }
        }))
    }
    getAuctions();
    const [orderButton,setOrderButton] = useState()
    
    
    return (    
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.photoUrl}>
                    <Image source={require('../assets/auction.jpg')}
                    style={styles.bg}>
                    </Image>
                </View>
                <Text style={styles.desc}>
                    hello people of nigeria 
                </Text>
                <View style={styles.orderSection}>
                    <TextInput style={styles.orderText}
                    >
                        
                    </TextInput>
                    <View style={styles.buttonControls}>
                        <IconButton
                        icon='minus-thick'
                        mode='contained'
                        size={20}
                        style={styles.incrementbtn}
                        
                        />
                        <TextInput 
                    style={styles.buttonText} >

                        </TextInput>
                        <IconButton
                        icon='plus-thick'
                        mode='contained'
                        size={20}
                        color='black'
                        style={styles.incrementbtn}
                        
                            
                        />
                    </View>
                </View>
                    <View style={styles.cartsection}>
                        <TouchableOpacity>

                        </TouchableOpacity>
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
    photoUrl:{
        flex:4,
        marginTop:40,
        marginLeft:10,
        marginRight:10,
        
        
    },
    bg:{
        flex:1,
        borderRadius:20,
        height:500,
        width:350,
    },
    desc:{
       flex:1.5,
       backgroundColor:theme.colors.dullRed0,
    },
    
    
    orderSection:{
     flex:0.2,
     marginBottom:50,
    },
    orderText:{
        fontSize:25,
        opacity:0.5,
        position:'relative',
        top:50,
        width:100,
        backgroundColor:'white',
    },
    buttonControls:{
        flexDirection:'row',
        width:140,
        height:50,
        padding:2,
        backgroundColor:theme.colors.navy, 
        borderRadius:10,
        position:'relative',
        left:200,  
    },
    buttonText:{
        width:40,
        height:40,
        margin:3,
        borderRadius:10,
        backgroundColor:theme.colors.navy,
        color:'white',
        
    },
    incrementbtn:{
        width:40,
        height:40,
        borderRadius:10,
        backgroundColor:'white',
        color:'black',
        margin:2,
    },
    cartsection:{
        flex:0.3,
        backgroundColor:theme.colors.dullRed1,
        marginBottom:10,
        marginTop:30,
    },

    
})