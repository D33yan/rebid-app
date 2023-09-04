import {createContext,useState } from "react";

const AppContext = createContext()

function AppProvider({children}){
    const [UID,setUserUID] = useState('trigger');
    const [userToken,setUserToken] = useState(null)
    const [isLoading,setUserLoading] = useState(false);

    const login = () =>{
        
    }

    const logout = () =>{}

    const isLoggedIn = () =>{}

    return (
        <AppContext.Provider value={{UID,userToken,isLoading,login,logout}}>
            {children}
        </AppContext.Provider>
    )

    
}
export {AppContext,AppProvider}
