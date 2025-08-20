export interface ReqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message extends ReqMessage {
  duration?: number;
}
