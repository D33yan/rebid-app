import { View,SafeAreaView,StyleSheet,ActivityIndicator,Platform,StatusBar,Text } from "react-native"
import { theme } from "../config/theme"
export function ScreenLoaderIndicator(){
    return(
        <SafeAreaView style={styles.wrapper}>
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <View><Text>Loading......</Text></View>
        </View>
    </SafeAreaView>
        )
}

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        backgroundColor:theme.colors.dullRed0,
        marginTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
})