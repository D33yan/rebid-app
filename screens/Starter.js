import { View,Text,ImageBackground,StyleSheet,Platform } from "react-native";
import { theme } from "../config/theme";
import { Button } from "react-native-paper";

export function Starter({navigation}) {
    return (
        <ImageBackground
        source={require('../assets/rebid_intro_bg.jpg')}
        style={styles.bg}>
            <View style={styles.container}>
                {/* Glassmorphic Container Card with 24px (xl) radius and 1px white border */}
                <View style={styles.contentCard}>
                    <Text style={styles.brandName}>Rebid</Text>
                    <Text style={styles.subTitle}>
                        Exclusively curated premium auctions. Elevate your collection on the go.
                    </Text>
                    
                    <Button 
                    mode="contained"
                    buttonColor={theme.colors.dullRed1}
                    textColor="#FFFFFF"
                    style={styles.continueBtn}
                    labelStyle={styles.btnLabel}
                    onPress={() => navigation.navigate('my-home')}>
                        Enter Gallery
                    </Button>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    bg:{
        flex:1,
    },
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-end',
        alignItems:'center',
        backgroundColor:"rgba(1, 1, 17, 0.4)" // Midnight primary backdrop tint
    },
    contentCard: {
        width: '90%',
        backgroundColor: 'rgba(252, 248, 250, 0.75)', // Glassmorphic surface dim
        borderRadius: theme.roundness.xl, // 24px XL rounded corners
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)', // 1px white border at 40% opacity for inner glow
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.glass, // Diffused shadow from midnight navy
    },
    brandName:{
        fontSize:44,
        color:theme.colors.primary, // Elite Primary deep color
        fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif',
        fontWeight:'800',
        textAlign:'center',
        letterSpacing: -0.5,
    },
    subTitle:{
        fontSize:16,
        color:theme.colors.outline, // outline gray text
        fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
        textAlign:'center',
        marginTop: theme.spacing.md,
        lineHeight: 24,
        fontWeight: '400',
    },
    continueBtn: {
        marginTop: theme.spacing.xl,
        width: '100%',
        borderRadius: theme.roundness.md, // Compact rounded buttons
        paddingVertical: 6,
        ...theme.shadows.button, // Electric Coral drop shadow at 30% opacity
    },
    btnLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    }
})