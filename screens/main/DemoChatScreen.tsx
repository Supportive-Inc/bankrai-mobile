import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ added
import { demoChatService } from '../../services/demo_chat';

type Props = NativeStackScreenProps<AuthStackParamList, 'DemoChat'>;

interface DemoMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const DEMO_CHAT_KEY = 'demo_chat_messages';
const DEMO_MODAL_KEY = 'demo_modal_seen';

export const DemoChatScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false); // 👈 initially false
  const scrollViewRef = useRef<ScrollView>(null);
  const sidebarAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;


  // Load saved messages + modal state
  useEffect(() => {
    (async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(DEMO_CHAT_KEY);
        const modalSeen = await AsyncStorage.getItem(DEMO_MODAL_KEY);

        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
        if (!modalSeen) {
          setShowDemoModal(true);
        }
      } catch (error) {
        console.error('Error loading saved demo chat data:', error);
      }
    })();
  }, []);

  // Save messages persistently when they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(DEMO_CHAT_KEY, JSON.stringify(messages)).catch(console.error);
    }
  }, [messages]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: isSidebarOpen ? 0 : -300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: isSidebarOpen ? 0.5 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [isSidebarOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: DemoMessage = {
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const messageContent = newMessage.trim();
    setNewMessage('');
    setMessages(prev => [...prev, userMessage]);

    try {
      setIsSendingMessage(true);

      const loadingMessage: DemoMessage = {
        role: 'model',
        content: '...',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, loadingMessage]);

      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await demoChatService.sendMessage(messageContent, chatHistory);

      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.content !== '...');
        return [...withoutLoading, {
          role: response.role,
          content: response.content,
          timestamp: response.timestamp
        }];
      });
    } catch (error) {
      console.error('Demo chat error:', error);
      setMessages(prev => prev.filter(msg => msg.content !== '...'));
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCloseDemoModal = async () => {
    try {
      await AsyncStorage.setItem(DEMO_MODAL_KEY, 'true'); // ✅ mark as seen
    } catch (error) {
      console.error('Error saving demo modal state:', error);
    }
    setShowDemoModal(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background dark:bg-dark-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Demo Mode Modal */}
      <Modal
        visible={showDemoModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDemoModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50 p-6">
          <View className="bg-white dark:bg-dark-surface rounded-lg p-6 w-full max-w-md">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center mb-4">
                <Ionicons name="information-circle" size={32} color="#007AFF" />
              </View>
              <Text className="text-xl font-bold text-primary dark:text-dark-primary mb-3 text-center">
                Demo Mode
              </Text>
              <Text className="text-secondary dark:text-dark-secondary text-center">
                You're entering Demo Mode. The data you'll see is mock financial data for exploration only. No account or permissions are required.
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary dark:bg-dark-primary rounded-lg py-3"
              onPress={handleCloseDemoModal}
            >
              <Text className="text-white dark:text-black text-center font-semibold">
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View
        className="px-4 flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity
          className="p-2"
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Ionicons name={isSidebarOpen ? "close" : "menu"} size={24} color="#007AFF" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-primary dark:text-dark-primary">
            Bankr AI
          </Text>
          <View className="ml-2 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
            <Text className="text-xs text-primary dark:text-dark-primary font-semibold">DEMO</Text>
          </View>
        </View>
        <View className="w-10" />
      </View>

      {/* Sidebar */}
      <Animated.View
        className="absolute top-0 left-0 h-full w-72 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700 z-20"
        style={{ transform: [{ translateX: sidebarAnim }] }}
      >
        <View className="flex-1" style={{ paddingTop: insets.top }}>
          <View className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between">
            <Text className="text-primary dark:text-dark-primary text-lg font-bold">Demo Mode</Text>
            <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View className="p-4 gap-y-3">
            <TouchableOpacity
              className="bg-primary dark:bg-dark-primary rounded-lg p-3"
              onPress={() => {
                setIsSidebarOpen(false);
                navigation.navigate('Register');
              }}
            >
              <Text className="text-white dark:text-black text-center font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-primary dark:border-dark-primary rounded-lg p-3"
              onPress={() => {
                setIsSidebarOpen(false);
                navigation.navigate('Login');
              }}
            >
              <Text className="text-primary dark:text-dark-primary text-center font-semibold">
                Log In
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1" />

          <View className="p-4 border-t border-gray-200 dark:border-gray-700">
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <Text className="text-sm text-secondary dark:text-dark-secondary text-center">
                Sign up to connect your real financial accounts
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Overlay */}
      {isSidebarOpen && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50 z-10"
          style={{ opacity: overlayAnim }}
          onPress={() => setIsSidebarOpen(false)}
          activeOpacity={1}
        />
      )}

      {/* Chat Area */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <View
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <View
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'max-w-[80%] bg-primary dark:bg-dark-primary'
                      : 'w-[90%] bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {message.role === 'user' ? (
                    <Text className="text-white dark:text-black">{message.content}</Text>
                  ) : message.content === '...' ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : (
                    <Markdown>{message.content}</Markdown>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-4xl font-bold text-primary dark:text-dark-primary mb-4">
                Bankr AI Demo
              </Text>
              <Text className="text-lg text-gray-600 dark:text-gray-400 text-center px-8">
                Try asking about your balance, recent transactions, or spending insights!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-background"
          style={{ paddingBottom: insets.bottom }}
        >
          <View className="p-4 flex-row items-end">
            <View className="flex-1 mr-2">
              <TextInput
                className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-primary dark:text-dark-primary bg-white dark:bg-dark-surface"
                placeholder="Type your message..."
                placeholderTextColor="#666666"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={1000}
                style={{ minHeight: 44, maxHeight: 120, textAlignVertical: 'top', paddingTop: 12, paddingBottom: 12 }}
                editable={!isSendingMessage}
              />
            </View>
            <TouchableOpacity
              className={`w-11 h-11 rounded-xl items-center justify-center ${
                isSendingMessage || !newMessage.trim()
                  ? 'bg-gray-300 dark:bg-gray-600'
                  : 'bg-primary dark:bg-dark-primary'
              }`}
              onPress={handleSendMessage}
              disabled={isSendingMessage || !newMessage.trim()}
            >
              {isSendingMessage ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialIcons name="send" size={20} color={!newMessage.trim() ? "#999" : "white"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};