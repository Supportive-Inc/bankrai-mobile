import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ChatHistoryItem {
  role: 'user' | 'model';
  content: string;
}

interface DemoChatResponse {
  role: 'model';
  content: string;
  isDemo: boolean;
  timestamp: string;
}

class DemoChatService {
  async sendMessage(message: string, chatHistory: ChatHistoryItem[]): Promise<DemoChatResponse> {
    try {
      console.log('Sending to:', `${API_URL}/demo-chat`);
      console.log('Payload:', { message, chat_history: chatHistory });

      const response = await axios.post(`${API_URL}/demo-chat`, {
        message,
        chat_history: chatHistory
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Demo chat error:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      throw error;
    }
  }
}

export const demoChatService = new DemoChatService();