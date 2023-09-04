import {createContext,useState } from "react";

const AppContext = createContext()

function AppProvider({children}){
    const [UID,setUserUID] = useState('trigger');

    return (
        <AppContext.Provider value={{UID}}>
            {children}
        </AppContext.Provider>
    )

    
}
export {AppContext,AppProvider}
