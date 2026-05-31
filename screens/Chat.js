import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    TextInput, 
    Image, 
    KeyboardAvoidingView, 
    Platform,
    StatusBar,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export function Chat({ navigation }) {
    // Demo Conversations list representing active bidders
    const [conversations, setConversations] = useState([
        {
            id: '1',
            userName: 'Garba Audu',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            itemTitle: 'Lagos Modern Mansionette',
            itemImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150',
            lastMessage: 'Is your bid final at ₦145,000,000?',
            time: '12:42 PM',
            unread: true,
            currentBid: 145000000,
            role: 'Seller'
        },
        {
            id: '2',
            userName: 'Chinedu Obi',
            userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            itemTitle: 'Mercedes Benz G63 AMG 2025',
            itemImage: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=150',
            lastMessage: 'I will increase my bid increment by ₦5,000,000.',
            time: 'Yesterday',
            unread: false,
            currentBid: 92000000,
            role: 'Bidder'
        },
        {
            id: '3',
            userName: 'Sarah Williams',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            itemTitle: 'Premium Sapphire Pendant',
            itemImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150',
            lastMessage: 'When is the auction window closing?',
            time: '2 days ago',
            unread: false,
            currentBid: 4200000,
            role: 'Seller'
        }
    ]);

    const [activeConv, setActiveConv] = useState(conversations[0]);
    const [messages, setMessages] = useState([
        { id: '1', type: 'message', text: 'Hi Garba, I am interested in the Lekki mansionette lot.', sender: 'me', time: '11:15 AM' },
        { id: '2', type: 'message', text: 'Hello! Thanks for your bid. The auction is highly active right now.', sender: 'them', time: '11:20 AM' },
        { id: '3', type: 'event', text: '🔥 Garba Audu placed ₦145M on Lagos Mansionette', sender: 'system', time: '11:21 AM' },
        { id: '4', type: 'message', text: 'Yes, I noticed. Is your bid final at ₦145,000,000?', sender: 'them', time: '11:22 AM' }
    ]);
    const [inputText, setInputText] = useState('');
    const [focusedInput, setFocusedInput] = useState(false);

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;
        const newMsg = {
            id: (messages.length + 1).toString(),
            type: 'message',
            text: inputText,
            sender: 'me',
            time: 'Just now'
        };
        setMessages([...messages, newMsg]);
        setInputText('');
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.keyboardContainer}>
                
                {/* Header: Locked Shield + Encrypted Channel */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color="#F1F5F9" />
                    </TouchableOpacity>
                    
                    <View style={styles.headerTitleContainer}>
                        <View style={styles.secureHeaderRow}>
                            <Ionicons name="shield-checkmark" size={14} color="#00D97E" />
                            <Text style={styles.secureLabel}>SECURE ENCRYPTED CHANNEL</Text>
                        </View>
                        <Text style={styles.headerTitle}>{activeConv.userName}</Text>
                    </View>
                    
                    <Image source={{ uri: activeConv.userAvatar }} style={styles.headerAvatar} />
                </View>

                {/* Frosted Context Bar */}
                <View style={styles.itemContextBar}>
                    <Image source={{ uri: activeConv.itemImage }} style={styles.contextImage} />
                    <View style={styles.contextDetails}>
                        <Text style={styles.contextTitle} numberOfLines={1}>{activeConv.itemTitle}</Text>
                        <Text style={styles.contextPrice}>Active Bid: ₦{CommaSepNum(activeConv.currentBid)}</Text>
                    </View>
                    <View style={styles.gavelBadge}>
                        <Ionicons name="hammer" size={12} color="#0A0F1E" />
                    </View>
                </View>

                {/* Main Chat Feed */}
                <FlatList
                    data={messages}
                    contentContainerStyle={styles.messagesList}
                    renderItem={({ item }) => {
                        if (item.type === 'event') {
                            return (
                                <View style={styles.eventPillContainer}>
                                    <View style={styles.eventPill}>
                                        <Text style={styles.eventText}>{item.text}</Text>
                                    </View>
                                </View>
                            );
                        }

                        const isMe = item.sender === 'me';
                        return (
                            <View style={[styles.messageBubbleContainer, isMe ? styles.myBubbleAlign : styles.theirBubbleAlign]}>
                                <View style={[
                                    styles.bubble, 
                                    isMe ? styles.myBubble : styles.theirBubble
                                ]}>
                                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                                        {item.text}
                                    </Text>
                                </View>
                                <Text style={styles.messageTime}>{item.time}</Text>
                            </View>
                        );
                    }}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />

                {/* Conversation Selector Slider at Bottom */}
                <View style={styles.selectorWrapper}>
                    <Text style={styles.selectorHeader}>Active Lot Bid Channels</Text>
                    <FlatList
                        data={conversations}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.selectorList}
                        renderItem={({ item }) => {
                            const isActive = item.id === activeConv.id;
                            return (
                                <TouchableOpacity 
                                    activeOpacity={0.9}
                                    style={[styles.selectorItem, isActive && styles.activeSelectorItem]}
                                    onPress={() => {
                                        setActiveConv(item);
                                        setMessages([
                                            { id: '1', type: 'message', text: `Hi! Let's discuss the lot: ${item.itemTitle}`, sender: 'me', time: '10:00 AM' },
                                            { id: '2', type: 'message', text: item.lastMessage, sender: 'them', time: item.time }
                                        ]);
                                    }}>
                                    <Image source={{ uri: item.userAvatar }} style={styles.selectorAvatar} />
                                    <View style={styles.selectorTextBlk}>
                                        <Text style={[styles.selectorName, isActive && styles.activeSelectorText]} numberOfLines={1}>
                                            {item.userName.split(' ')[0]}
                                        </Text>
                                        <Text style={styles.selectorRole}>{item.role}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item) => item.id}
                    />
                </View>

                {/* Input Bar: #111827 bg, TextInput active coral outline */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={[
                            styles.textInput,
                            focusedInput && styles.focusedTextInput
                        ]}
                        value={inputText}
                        onChangeText={setInputText}
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                        placeholder="Type message..."
                        placeholderTextColor="#64748B"
                        selectionColor="#FF6B35"
                    />
                    <TouchableOpacity 
                        style={styles.sendButton} 
                        activeOpacity={0.8}
                        onPress={handleSendMessage}>
                        <Svg height="44" width="44" style={StyleSheet.absoluteFillObject}>
                            <Defs>
                                <LinearGradient id="coralSend" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#FF6B35" />
                                    <Stop offset="100%" stopColor="#FF4500" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" rx="22" fill="url(#coralSend)" />
                        </Svg>
                        <Ionicons name="send" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    keyboardContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 44 : 20,
        paddingBottom: 12,
        backgroundColor: '#111827',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C2333',
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 12,
    },
    secureHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    secureLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#00D97E',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F1F5F9',
        marginTop: 2,
    },
    headerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: '#F5C518',
    },
    itemContextBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 10,
        borderRadius: 16,
    },
    contextImage: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    contextDetails: {
        flex: 1,
        marginLeft: 10,
    },
    contextTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#F1F5F9',
    },
    contextPrice: {
        fontSize: 11,
        color: '#00D97E',
        marginTop: 2,
        fontWeight: '600',
    },
    gavelBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F5C518',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 16,
    },
    messageBubbleContainer: {
        maxWidth: '80%',
        marginBottom: 2,
    },
    myBubbleAlign: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    theirBubbleAlign: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: '#FF6B35',
        borderBottomRightRadius: 2,
    },
    theirBubble: {
        backgroundColor: '#1C2333',
        borderBottomLeftRadius: 2,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    theirMessageText: {
        color: '#CBD5E1',
        fontWeight: '500',
    },
    messageTime: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 4,
        paddingHorizontal: 4,
    },
    eventPillContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    eventPill: {
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    eventText: {
        color: '#64748B',
        fontSize: 11,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    selectorWrapper: {
        backgroundColor: '#111827',
        paddingVertical: 12,
        borderTopWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    selectorHeader: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 16,
        marginBottom: 8,
    },
    selectorList: {
        paddingHorizontal: 16,
        gap: 8,
    },
    selectorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C2333',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 8,
    },
    activeSelectorItem: {
        borderColor: '#FF6B35',
        backgroundColor: '#0A0F1E',
    },
    selectorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    selectorTextBlk: {
        justifyContent: 'center',
    },
    selectorName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#CBD5E1',
        width: 60,
    },
    activeSelectorText: {
        color: '#FFFFFF',
    },
    selectorRole: {
        fontSize: 8,
        color: '#64748B',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#111827',
        borderTopWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    textInput: {
        flex: 1,
        height: 44,
        backgroundColor: '#0A0F1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        color: '#F1F5F9',
        fontSize: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    focusedTextInput: {
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255, 107, 53, 0.03)',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        position: 'relative',
    }
});
