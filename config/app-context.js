import {createContext,useState } from "react";

const AppContext = createContext()

function AppProvider({children}){
    const [UID,setUserUID] = useState('trigger');
    const [userToken,setUserToken] = useState(null)
    const [isLoading,setIsLoading] = useState(false);

    const login = () =>{
        setIsLoading(true);
        setUserToken('Trigger');
        setIsLoading(false)
    }

    const logout = () =>{
        setIsLoading(true);
        setUserToken('null');
        setIsLoading(false)
    }

    const isLoggedIn = () =>{}

    return (
        <AppContext.Provider value={{UID,userToken,isLoading,login,logout}}>
            {children}
        </AppContext.Provider>
    )

    
}
export {AppContext,AppProvider}
