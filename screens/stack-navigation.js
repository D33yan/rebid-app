import { useContext } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppContext } from "../config/app-context";
import { Starter } from "./Starter";
import { Home } from "./Home";
import { CreateAccount } from "./CreateAccount";
import { Signin } from "./Signin";
import { Profile } from "./Profile";
import { Auctions } from "./Auctions";
import { Chat } from "./Chat";
import { LiveBidding } from "./LiveBidding";
import { Onboarding } from "./Onboarding";

const Stack = createNativeStackNavigator();

export function StackNavigation() {
    const { userToken } = useContext(AppContext);

    return (
        // <Stack.Navigator 
        //     screenOptions={{ headerShown:false }}
        //     initialRouteName={userToken ? "my-home" : "sign-in"}
        // >
        //     {userToken ? (
        //         // Authenticated Stack
        //         <>
        //             <Stack.Screen name="my-home" component={Home}/>
        //             <Stack.Screen name="starter" component={Starter}/>
        //             <Stack.Screen name="auctions" component={Auctions}/>
        //             <Stack.Screen name="chat" component={Chat}/>
        //             <Stack.Screen name="profile" component={Profile}/>
        //         </>
        //     ) : (
        //         // Unauthenticated Stack
        //         <>
        //             <Stack.Screen name="sign-in" component={Signin}/>
        //             <Stack.Screen name="create-account" component={CreateAccount}/>
        //         </>
        //     )}
        // </Stack.Navigator>
        <Stack.Navigator 
            screenOptions={{ headerShown:false }}
            initialRouteName="my-home"
        >
            <Stack.Screen name="my-home" component={Home}/>
            <Stack.Screen name="starter" component={Starter}/>
            <Stack.Screen name="auctions" component={Auctions}/>
            <Stack.Screen name="chat" component={Chat}/>
            <Stack.Screen name="profile" component={Profile}/>
            <Stack.Screen name="live-bidding" component={LiveBidding}/>
            <Stack.Screen name="onboarding" component={Onboarding}/>
        </Stack.Navigator>
    )
}
