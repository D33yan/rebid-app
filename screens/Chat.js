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
    StatusBar 
} from 'react-native';
import { theme } from '../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { CommaSepNum } from '../utilities/comma-sep-num';

export function Chat({ navigation }) {
    // Demo Conversations list representing bidders and item owners
    const [conversations, setConversations] = useState([
        {
            id: '1',
            userName: 'Adebayo Johnson',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            itemTitle: '2 Bedrooms Apartment in Ayobo',
            itemImage: 'https://pictures-nigeria.jijistatic.com/128842763_ODk5LTIwNDgtYjE5MWUxZTZiMQ.webp',
            lastMessage: 'Is your bid final at ₦5,600,000?',
            time: '12:42 PM',
            unread: true,
            currentBid: 5600000,
            role: 'Owner'
        },
        {
            id: '2',
            userName: 'Chinedu Obi',
            userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            itemTitle: 'Flower Decor With Pimples Pot',
            itemImage: 'https://pictures-nigeria.jijistatic.com/107850170_MTUwMC0xMTI1LTdiY2MxMTU5OWQ.webp',
            lastMessage: 'I can increase my bid increment by ₦500.',
            time: 'Yesterday',
            unread: false,
            currentBid: 9500,
            role: 'Bidder'
        },
        {
            id: '3',
            userName: 'Sarah Williams',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            itemTitle: 'Quality WC Seats',
            itemImage: 'https://pictures-nigeria.jijistatic.com/110614223_NzU2LTEwMDgtMzNkNzE5MDdkZQ.webp',
            lastMessage: 'When is the auction window closing?',
            time: '2 days ago',
            unread: false,
            currentBid: 23000,
            role: 'Owner'
        }
    ]);

    const [activeConv, setActiveConv] = useState(conversations[0]);
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hi Sarah, I am interested in the Ayobo apartment auction.', sender: 'me', time: '11:15 AM' },
        { id: '2', text: 'Hello! Thanks for your bid. The auction is highly active right now.', sender: 'them', time: '11:20 AM' },
        { id: '3', text: 'Yes, I noticed. Is your bid final at ₦5,600,000?', sender: 'them', time: '11:22 AM' }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;
        const newMsg = {
            id: (messages.length + 1).toString(),
            text: inputText,
            sender: 'me',
            time: 'Just now'
        };
        setMessages([...messages, newMsg]);
        setInputText('');
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.keyboardContainer}>
                
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{activeConv.userName}</Text>
                        <Text style={styles.headerSubtitle}>{activeConv.role} of bidded item</Text>
                    </View>
                    <Image source={{ uri: activeConv.userAvatar }} style={styles.headerAvatar} />
                </View>

                {/* Collapsible Glass Item Info Bar */}
                <View style={styles.itemContextBar}>
                    <Image source={{ uri: activeConv.itemImage }} style={styles.contextImage} />
                    <View style={styles.contextDetails}>
                        <Text style={styles.contextTitle} numberOfLines={1}>{activeConv.itemTitle}</Text>
                        <Text style={styles.contextPrice}>Active Bid: ₦{CommaSepNum(activeConv.currentBid)}</Text>
                    </View>
                    <View style={styles.gavelBadge}>
                        <Ionicons name="hammer" size={14} color="#FFFFFF" />
                    </View>
                </View>

                {/* Main Chat Flow */}
                <FlatList
                    data={messages}
                    contentContainerStyle={styles.messagesList}
                    renderItem={({ item }) => {
                        const isMe = item.sender === 'me';
                        return (
                            <View style={[styles.messageBubbleContainer, isMe ? styles.myBubbleAlign : styles.theirBubbleAlign]}>
                                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
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

                {/* Conversation Selector (Horizontal Glass Slider) */}
                <View style={styles.selectorWrapper}>
                    <Text style={styles.selectorHeader}>Active Bid Chats</Text>
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
                                        // Reset sample messages based on conversation
                                        setMessages([
                                            { id: '1', text: `Hi! Let's discuss the lot: ${item.itemTitle}`, sender: 'me', time: '10:00 AM' },
                                            { id: '2', text: item.lastMessage, sender: 'them', time: item.time }
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

                {/* Input Bar */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type message here..."
                        placeholderTextColor={theme.colors.outline}
                    />
                    <TouchableOpacity 
                        style={styles.sendButton} 
                        activeOpacity={0.8}
                        onPress={handleSendMessage}>
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
        backgroundColor: theme.colors.dullRed0, // Soft Ice-Blue canvas
    },
    keyboardContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: theme.roundness.full,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerLow,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 2,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: theme.roundness.full,
        backgroundColor: theme.colors.surfaceContainer,
    },
    itemContextBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Glassmorphic context bar
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.sm,
        padding: theme.spacing.sm,
        borderRadius: theme.roundness.lg, // 16px corner radius
        ...theme.shadows.glass,
    },
    contextImage: {
        width: 40,
        height: 40,
        borderRadius: theme.roundness.sm,
        backgroundColor: theme.colors.surfaceContainer,
    },
    contextDetails: {
        flex: 1,
        marginLeft: theme.spacing.sm,
    },
    contextTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    contextPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.dullRed1,
        marginTop: 2,
    },
    gavelBadge: {
        width: 28,
        height: 28,
        borderRadius: theme.roundness.full,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesList: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },
    messageBubbleContainer: {
        marginBottom: theme.spacing.md,
        maxWidth: '80%',
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
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.roundness.lg,
    },
    myBubble: {
        backgroundColor: theme.colors.dullRed1, // Outgoing is Electric Coral
        borderBottomRightRadius: 4,
        ...theme.shadows.button,
    },
    theirBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Incoming is Glass white
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderBottomLeftRadius: 4,
        ...theme.shadows.glass,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    theirMessageText: {
        color: theme.colors.primary,
        fontWeight: '500',
    },
    messageTime: {
        fontSize: 10,
        color: theme.colors.outline,
        marginTop: 4,
        marginHorizontal: 6,
    },
    selectorWrapper: {
        backgroundColor: 'rgba(252, 248, 250, 0.8)',
        paddingVertical: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.4)',
    },
    selectorHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    selectorList: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    selectorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: theme.roundness.xl, // 28px rounded-xl
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 10,
        ...theme.shadows.glass,
    },
    activeSelectorItem: {
        backgroundColor: theme.colors.navy,
        borderColor: theme.colors.dullRed1,
        ...theme.shadows.button,
    },
    selectorAvatar: {
        width: 36,
        height: 36,
        borderRadius: theme.roundness.full,
        backgroundColor: theme.colors.surfaceContainerLow,
    },
    selectorTextBlk: {
        justifyContent: 'center',
    },
    selectorName: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
        width: 75,
    },
    activeSelectorText: {
        color: '#FFFFFF',
    },
    selectorRole: {
        fontSize: 9,
        color: theme.colors.outline,
        marginTop: 1,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.4)',
    },
    textInput: {
        flex: 1,
        height: 44,
        backgroundColor: theme.colors.dullRed0,
        borderRadius: theme.roundness.md,
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.primary,
        fontSize: 14,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: theme.roundness.full,
        backgroundColor: theme.colors.dullRed1, // Electric Coral CTA button
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
        ...theme.shadows.button,
    }
});
