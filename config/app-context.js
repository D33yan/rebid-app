import {createContext,useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert } from "react-native";

const AppContext = createContext()

function AppProvider({children}){
    const [UID,setUserUID] = useState('trigger');
    const [userToken,setUserToken] = useState(null)
    const [isLoading,setIsLoading] = useState(false);

    const login = () =>{
        setIsLoading(true);
        setUserToken('Trigger');
        AsyncStorage.setItem('userToken',userToken);
        setIsLoading(false)
    }

    const logout = () =>{
        setIsLoading(true);
        setUserToken('null');
        AsyncStorage.removeItem('userToken',userToken);
        setIsLoading(false)
    }

    const isLoggedIn = async() =>{
        try {
            setIsLoading(true)
            let userToken = AsyncStorage.getItem('userToken',userToken);
            setUserToken(userToken);
            setIsLoading(false);
        } catch (error) {
            Alert.alert(
                'Error Handling',
                'An error has occured!',
                [{
                    text:'Dismiss',
                    onPress:console.error(error)
                }]
            )  
        }
    }

    useEffect(()=>{
        isLoggedIn()
    })

    return (
        <AppContext.Provider value={{UID,userToken,isLoading,login,logout}}>
            {children}
        </AppContext.Provider>
    )

    
}
export {AppContext,AppProvider}
