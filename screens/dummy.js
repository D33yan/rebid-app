import React, { Image, TextInput } from 'react-native';
import { fa0, faBackspace, faBackward, faMinus, faPager, faPlus, faPlusMinus, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button } from 'react-native-paper';
import { Text, View, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../config/theme';
import { useState } from 'react';
import { CommaSepNum } from '../utilities/comma-sep-num';
import { collection, getDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { getRemainingTime } from '../utilities/time-remaining';
function AuctionDetails({ route,navigation }) {
    const { itemId,
        itemTitle,
        itemPhoto,
        itemPrice,
        itemBidIncriment,
        itemEndDate,

    } = route.params;

    const [bidPrice, setBidPrice] = useState(1);
    const [bidCount, setBidCount] = useState(1)
    const [auctionDetails, setAuctionDetails] = useState([]);

    function increamentBid() {
        setBidPrice(bidPrice + 500);
        setBidCount(bidCount + 1)
    }
    function decrementBid() {
        setBidPrice(bidPrice - 500);
        setBidCount(bidCount - 1)

    }

    return (
        <>

            <SafeAreaView style={styles.wrapper}>
                <View style={styles.container}>

                    <View style={styles.auctionImageHolder}>
                        <Image style={styles.auctionPhoto} source={{ uri: itemPhoto }} />

                        <View style={styles.itemDetails}>
                            <Text style={styles.auctionTitle}>Auction Title Here</Text>
                            {/* <Text style={styles.auctionCategory}>Category</Text> */}
                            <Text style={styles.auctionCategory}>Item Price: ₦{CommaSepNum(JSON.stringify(itemPrice))}</Text>
                            <Text style={styles.auctionCategory}>{getRemainingTime(new Date(itemEndDate).getTime())}</Text>

                        </View>

                        <View style={styles.AuctionDescription}>
                            <Text style={styles.auctionTitle}>Description</Text>
                            <Text style={styles.descriptionText}>Hello world, we are now Reacting in Native,
                                and the world will know us soon, no play no jokes
                                Hello world, we are now Reacting in Native, and the world will know us soon, no play no jokes

                                <Text style={{ color: theme.colors.navy, fontWeight: '700', }} onPress={() => alert('more details')}> ...ReadMore</Text>
                            </Text>
                        </View>
                        <View style={styles.increaseBid}>
                            <Text style={styles.auctionTitle}> ₦{CommaSepNum(bidPrice)}</Text>
                            <View style={styles.plusMinusContainer}>

                                <TouchableOpacity onPress={decrementBid} style={styles.plusAndMinusSigns}
                                >
                                    <FontAwesomeIcon icon={faMinus} color={theme.colors.navy} size={30} />
                                </TouchableOpacity>
                                <TextInput style={styles.bidIncriment} value={`${bidCount}`} />
                                <TouchableOpacity
                                    onPress={increamentBid}
                                    style={styles.plusAndMinusSigns}>
                                    <FontAwesomeIcon icon={faPlus} color={theme.colors.navy} size={30} />
                                </TouchableOpacity>


                            </View>
                        </View>
                        <Button
                            mode='contained'
                            buttonColor={theme.colors.navy}
                            textColor={theme.colors.dullRed0}
                            style={{ paddingVertical: 8 }}
                            onPress={() => alert('Bid Placed')}>Place Bid</Button>
                    </View>

                </View>
            </SafeAreaView >
        </>
    );
}



export default AuctionDetails;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.navy,
    },

    auctionImageHolder: {
        width: '100%',
        height: 300,
        alignSelf: 'center',
        borderRadius: 10,
    },
    itemDetails: {
        marginTop: -60,
        padding: 15,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: "rgba(238,226,222,0.8)",
        borderRadius: 20,
        zIndex: 2,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.navy,
    },
    auctionTitle: {
        fontSize: 26,
        fontWeight: '400',
        color: theme.colors.navy,
    },
    auctionCategory: {
        fontSize: 17,
        fontWeight: '500',
        color: theme.colors.navy,
    },
    price: {
        fontSize: 20,
        fontWeight: '400',
        color: theme.colors.navy,
    },
    auctionPhoto: {
        borderRadius: 20,
        height: 300,
        width: '100%',
    },
    AuctionDescription: {
        marginTop: 30,
        borderColor: theme.colors.navy,
        borderBottomWidth: 0.03,
    },
    increaseBid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 30,
        borderCurve: 'circular',
        borderColor: theme.colors.navy,
        borderBottomWidth: 0.2,
        // borderTopWidth: 0.2,
        // borderLeftWidth: 0.2,
        borderRadius: 10,
    },
    plusMinusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: theme.colors.navy,
        height: 50,
        width: 120,
        padding: 4,
    },
    plusAndMinusSigns: {
        height: 40,
        backgroundColor: theme.colors.dullRed1,
        borderRadius: 10,
        width: 40,
        alignItems: 'center',
        paddingTop: 4,


    },
    bidIncriment: {
        fontSize: 30,
        fontWeight: '500',
        color: theme.colors.dullRed0,
    }


})