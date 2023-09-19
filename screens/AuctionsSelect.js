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
import { getDocs,collection,query,where,orderBy } from 'firebase/firestore';
import {useState} from 'react'; 
import { CommaSepNum } from '../utilities/comma-sep-num';
import { getRemainingTime } from '../utilities/time-remaining';


export function AuctionSelect({route}) {
    const { itemId,
        itemTitle,
        itemPhoto,
        itemPrice,
        itemBidIncrement,
        itemEndDate,
        itemDesc,
} = route.params;
    const [myAuctions,setMyAuctions] = useState([]);
    const [bidPrice, setBidPrice] = useState(itemPrice);
    const [bidCount, setBidCount] = useState(itemPrice)

    function incrementBtn() {
        setBidPrice(bidPrice + itemBidIncrement);
        setBidCount(bidCount + itemBidIncrement);
        
    }
    function decrementBtn() {
        setBidPrice(bidPrice - itemBidIncrement);
        setBidCount(bidCount - itemBidIncrement);

    }
    
    
    
    return (    
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.photoUrl}>
                    <Image source={{uri:itemPhoto}}
                    style={styles.bg}/>
                    <Text>{itemTitle}</Text>
                            {/* <Text style={styles.auctionCategory}>Category</Text> */}
                            <Text style={styles.itemPrice}>₦{CommaSepNum(itemPrice)} </Text>
                            <Text  style={styles.itemEndDate}>{getRemainingTime(new Date(itemEndDate).getTime())}</Text>
                   
                </View>
                <Text style={styles.desc}>
                   {itemDesc}
                </Text>
                <View style={styles.orderSection}>
                    <Text style={styles.orderText}>
                      {bidCount}  
                    </Text>
                    <View style={styles.buttonControls}>
                        <IconButton
                        icon='minus-thick'
                        mode='contained'
                        size={20}
                        style={styles.incrementbtn}
                        onPress={decrementBtn}
                        />
                        <Text
                    style={styles.buttonText} >
                        {bidCount}
                    </Text>

                        <IconButton
                        icon='plus-thick'
                        mode='contained'
                        size={20}
                        color='black'
                        style={styles.incrementbtn}
                        onPress={incrementBtn}   
                        />
                    </View>
                </View>
                    <View style={styles.cartsection}>
                        <TouchableOpacity style={styles.heartIcon}>
                            <IconButton
                            icon='heart'/>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.cartBtn} >
                            <Text style={styles.cartText}>
                                Add to Cart
                            </Text>
                            <IconButton
                            icon='cart'
                            style={styles.cartIcon}
                            />
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
        flex:3, 
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
       fontSize:30,
       
    },
    
    
    orderSection:{
     flex:0.25,
     marginBottom:50,
    },
    orderText:{
        fontSize:25,
        opacity:0.5,
        position:'relative',
        top:50,
        left:20,
        width:100,
        height:40, 
        color:"black",
    },
    buttonControls:{
        flexDirection:'row',
        width:150,
        height:50,
        padding:5,
        backgroundColor:theme.colors.navy, 
        borderRadius:10,
        position:'relative',
        left:200,  
    },
    buttonText:{
        width:50,
        height:40,
        margin:3,
        borderRadius:10,
        backgroundColor:theme.colors.navy,
        color:'white',
        textAlign:'center',
        
        
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
        flex:0.5,
        marginBottom:10,
        marginTop:30,
        
    },
    heartIcon:{
        width:40,
        height:40,
        borderRadius:50,
        backgroundColor:theme.colors.dullRed0,
        color:'black',
        alignItems:'center',
        justifyContent:'center',
        color:theme.colors.navy,
        position:'relative',
        left:20,
    },
    cartBtn:{
       height:50,
        width:270,
        borderRadius:10,
        backgroundColor:theme.colors.navy,
        color:'black',
        position:'relative',
       bottom:40,
        left:80,
        
    },
    cartIcon:{
        width:30,
        height:30,
        borderRadius:50,
        backgroundColor:theme.colors.dullRed0,
        color:'black',
        alignItems:'center',
        justifyContent:'center',
        color:theme.colors.navy,
        position:'relative',
        left:170,
        bottom:35,
    },
    cartText:{
        fontSize:18,
        color:'white',
        marginLeft:50,
        marginTop:10,
    }
    
})