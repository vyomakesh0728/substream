export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Substream {
  id: string;
  name: string;
  messages: Message[];
}