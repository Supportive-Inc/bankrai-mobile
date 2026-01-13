import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Plus, MessageSquare, X } from 'lucide-react-native';

interface ChatSidebarProps {
  visible: boolean;
  onClose: () => void;
}

// Mock data - replace with actual data from your backend
const mockChatHistory = [
  { id: 1, title: 'Budget planning for December', date: 'Today' },
  { id: 2, title: 'Coffee spending analysis', date: 'Today' },
  { id: 3, title: 'Monthly savings goals', date: 'Yesterday' },
  { id: 4, title: 'Subscription review', date: '2 days ago' },
  { id: 5, title: 'Grocery budget optimization', date: '1 week ago' },
];

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ visible, onClose }) => {
  const handleNewChat = () => {
    console.log('Starting new chat');
    onClose();
  };

  const handleSelectChat = (id: number, title: string) => {
    console.log(`Selected chat ${id}: ${title}`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sidebarContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Chats</Text>
              <Text style={styles.subtitle}>Your conversation history</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* New Chat Button */}
          <View style={styles.newChatContainer}>
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              <Plus size={20} color="#fff" />
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Chats */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionLabel}>Recent</Text>
            <ScrollView style={styles.chatList}>
              {mockChatHistory.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  style={styles.chatItem}
                  onPress={() => handleSelectChat(chat.id, chat.title)}>
                  <MessageSquare size={16} color="#666" />
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatTitle} numberOfLines={1}>
                      {chat.title}
                    </Text>
                    <Text style={styles.chatDate}>{chat.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  closeButton: {
    padding: 4,
  },
  newChatContainer: {
    padding: 16,
  },
  newChatButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  chatDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
