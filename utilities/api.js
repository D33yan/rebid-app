/**
 * 🚀 REBID CLIENT-SIDE API GATEWAY SERVICE
 * -------------------------------------------------------------
 * Hey there, junior developer! This is your unified client API helper.
 * Mobile platforms (especially physical phones scanning Expo QR codes) 
 * cannot resolve "localhost" to your development computer. 
 * This service is designed to dynamically determine the correct API URL, 
 * inject secure JWT authorization headers automatically, and handle token storage.
 * -------------------------------------------------------------
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// --- SENIOR LESSON: LOCAL HOST RESOLUTION ---
// 💻 Emulators (Android/iOS) can access your local computer via localhost or 10.0.2.2.
// 📱 Physical devices scanning the Expo QR code need the explicit Local LAN IP of your computer
//    (e.g., http://192.168.1.50:5000). Replace the IP below with your computer's local IP!
const DEVELOPER_MACHINE_IP = '192.168.0.67'; // Auto-resolved by Antigravity

// --- SENIOR DEV BEST PRACTICE: UNIFIED LOCAL IP ---
// Simulators, emulators, and physical devices can all resolve the developer machine's 
// local LAN IP address when connected to the same Wi-Fi network. 
// Using this unified IP address avoids Platform.select failures on physical devices.
const BASE_URL = `http://${DEVELOPER_MACHINE_IP}:5000`;

console.log(`🌐 [Rebid API] Gateway initialized. Routing node calls to: ${BASE_URL}`);

/**
 * Helper to securely store JWT authorization tokens inside AsyncStorage.
 * @param {string} token 
 */
export async function setAuthToken(token) {
    try {
        if (token) {
            await AsyncStorage.setItem('rebid_jwt_token', token);
            console.log('✅ [Secure Session] JWT successfully stored in AsyncStorage.');
        } else {
            await AsyncStorage.removeItem('rebid_jwt_token');
            console.log('🗑️ [Secure Session] JWT successfully removed.');
        }
    } catch (err) {
        console.error('❌ Failed to manage auth token:', err.message);
    }
}

/**
 * Helper to retrieve stored JWT token for API authentications.
 */
export async function getAuthToken() {
    try {
        return await AsyncStorage.getItem('rebid_jwt_token');
    } catch (err) {
        console.error('❌ Failed to retrieve auth token:', err.message);
        return null;
    }
}

/**
 * Unified request handler with automatic token injection and error reporting.
 * @param {string} endpoint - API route (e.g. '/api/auctions')
 * @param {string} method - HTTP Verb (GET, POST, etc.)
 * @param {object} body - Payload body parameters
 */
async function request(endpoint, method = 'GET', body = null) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // --- SECURITY BEST PRACTICE: AUTOMATIC BEARER INJECTION ---
    // If a token exists in storage, we automatically append it as a Bearer token
    // to authenticate secure routes on the Express server.
    const token = await getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Throw custom error holding the server message if available
            throw new Error(data.error || `HTTP Error ${response.status}`);
        }

        return data;
    } catch (err) {
        console.warn(`🚨 [API Error] Route [${method}] ${endpoint} failed:`, err.message);
        throw err;
    }
}

// -------------------------------------------------------------
// 🔗 THE REST API ENDPOINTS EXPORT
// -------------------------------------------------------------
export const api = {
    // 🔐 Auth Gateway Routes
    auth: {
        register: (firstName, lastName, email, password) => 
            request('/api/auth/register', 'POST', { firstName, lastName, email, password }),
            
        login: (email, password) => 
            request('/api/auth/login', 'POST', { email, password }),
            
        verifyOtp: (code) => 
            request('/api/auth/verify-otp', 'POST', { code })
    },

    // 🏡 Auction Catalog Routes
    auctions: {
        list: (category = 'All', search = '') => 
            request(`/api/auctions?category=${category}&search=${search}`, 'GET'),
            
        create: (payload) => 
            request('/api/auctions', 'POST', payload)
    },

    // 🔨 Bid Transaction Routes
    bids: {
        place: (auctionId, amount) => 
            request('/api/bids/place', 'POST', { auctionId, amount }),
            
        active: () => 
            request('/api/bids/active', 'GET')
    },

    // 📊 Portfolio & Ledger History
    users: {
        profile: () => 
            request('/api/users/profile', 'GET'),
            
        history: () => 
            request('/api/ledger/history', 'GET')
    }
};
