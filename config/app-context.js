import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const AppContext = createContext();

function AppProvider({ children }) {
    const [UID, setUserUID] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Synchronize React State with JWT Session
    useEffect(() => {
        const loadSession = async () => {
            setIsLoading(true);
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    setUserUID(token);
                    setUserToken(token);
                }
            } catch (error) {
                console.error("Failed to load session:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSession();
    }, []);

    // Explicit login helper
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

    // Explicit logout helper to clear session token
    const logout = async () => {
        setIsLoading(true);
        try {
            setUserUID(null);
            setUserToken(null);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('rebid_jwt_token');
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

