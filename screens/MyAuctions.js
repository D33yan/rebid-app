import { useState,useContext } from "react";
import { View,StyleSheet,TouchableOpacity,Text,StatusBar,Platform,SafeAreaView,FlatList,Image} from "react-native";
import { db } from "../config/firebase.config";
import { getDocs,collection,query,where,orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash,faPen } from "@fortawesome/free-solid-svg-icons";
import { theme } from "../config/theme";
import { CommaSepNum } from "../utilities/comma-sep-num";
import { getRemainingTime } from "../utilities/time-remaining";
import { AppContext } from "../config/app-context";

export function MyAuctions() {
    const [myAuctions,setMyAuctions] = useState([]);
    const {user} = useContext(AppContext)

    const getMyAuctions = async () => {
        const q = query(collection(db,'auctions'),where('createdBy','==',JSON.parse(user).user_uid));
        const onSnap = await getDocs(q);
        setMyAuctions(onSnap.docs.map(doc => {
            return {
                id:doc.id,
                data:{
                    ...doc.data()
                }
            }
        }))
    }
    getMyAuctions()

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.heading}>Auctions I created</Text>

                <View style={styles.myAuctionsBlock}>
                   <FlatList
                   data={myAuctions}
                   renderItem={({item}) => (
                    <View style={styles.auctionItem}>
                        <View style={styles.auctionSection}>
                            <TouchableOpacity style={styles.actionCircle}>
                                <FontAwesomeIcon
                                icon={faPen}
                                size={24}
                                color={theme.colors.navy}/>
                            </TouchableOpacity>
                        </View>
                    <View  style={styles.auctionDetails}>
                        <Image
                        style={styles.productImg}
                        source={{uri:item.data.photoUrl}}/>
                        <View>
                        <Text style={{fontSize:12,color:theme.colors.dullRed0}}>{getRemainingTime(item.data.endDate)}</Text>
                            <Text style={{fontSize:16,color:theme.colors.dullRed1}}>{item.data.title.length > 24 ? item.data.title.slice(0,24)+'...' : item.data.title}</Text>
                            <Text style={{fontSize:20,fontWeight:'600',color:theme.colors.dullRed1}}>₦{CommaSepNum(item.data.initialPrice)}</Text>

                        </View>
                    </View>
                    <View style={styles.auctionSection}>
                            <TouchableOpacity style={styles.actionCircle}>
                                <FontAwesomeIcon
                                icon={faTrash}
                                size={24}
                                color={theme.colors.navy}/>
                            </TouchableOpacity>
                        </View>
                </View> 
                   )}
                   key={({item}) => item.id}>
                   
                   </FlatList>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
    },
    heading:{
        fontSize:22
    },
    auctionItem:{
        flex:1,
        backgroundColor:'white',
        borderRadius:8,
        flexDirection:"row",
        alignItems:"center",
        padding:6,
        marginBottom:6,

    },
    auctionSection:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    auctionDetails:{
        flexDirection:"column",
        justifyContent:"space-between",
        alignItems:"center",
        gap:4,
        

    },
    productImg:{
        width:80,
        height:100,
        borderRadius:8,
    },
    actionCircle:{
        width:52,
        height:52,
        borderRadius:10,
        backgroundColor:theme.colors.dullRed0,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50,
    },


})