import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Starter } from "./Starter";
import { Home } from "./Home";
import { CreateAccount } from "./CreateAccount";
import { Signin } from "./Signin";
import { Profile } from "./Profile";
import { Auctions } from "./Auctions";
const Stack = createNativeStackNavigator();

export function StackNavigation() {
    return (
        <Stack.Navigator initialRouteName="sign-in"
        screenOptions={{ headerShown:false }}>
            <Stack.Screen name="my-home" component={Home}/>
            <Stack.Screen name="starter" component={Starter}/>
            <Stack.Screen name="create-account" component={CreateAccount}/>
            <Stack.Screen name="sign-in" component={Signin}/>
            <Stack.Screen name="profile" component={Profile}/>
            <Stack.Screen name="auctions" component={Auctions}/>
        </Stack.Navigator>
    )
}