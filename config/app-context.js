import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { authentication } from "./firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AppContext = createContext();

function AppProvider({ children }) {
    const [UID, setUserUID] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Synchronize React State with Firebase Auth Changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authentication, async (user) => {
            setIsLoading(true);
            if (user) {
                // User is authenticated
                setUserUID(user.uid);
                setUserToken(user.uid);
                await AsyncStorage.setItem('userToken', user.uid);
            } else {
                // User is signed out
                setUserUID(null);
                setUserToken(null);
                await AsyncStorage.removeItem('userToken');
            }
            setIsLoading(false);
        });

        // Cleanup listener on unmount
        return unsubscribe;
    }, []);

    // Explicit login helper (if manual trigger is needed)
    const login = async (uid) => {
        setIsLoading(true);
        try {
            setUserUID(uid);
            setUserToken(uid);
            await AsyncStorage.setItem('userToken', uid);
        } catch (error) {
            console.error("Error storing session token:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Explicit logout helper to trigger Firebase Signout
    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut(authentication);
            setUserUID(null);
            setUserToken(null);
            await AsyncStorage.removeItem('userToken');
        } catch (error) {
            Alert.alert(
                'Logout Error',
                'Failed to securely log you out. Please try again.',
                [{ text: 'Dismiss' }]
            );
            console.error("Error signing out:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppContext.Provider value={{ UID, userToken, isLoading, login, logout }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };

