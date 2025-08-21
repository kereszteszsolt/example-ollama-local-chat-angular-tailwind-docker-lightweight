export interface ReqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message extends ReqMessage {
  total_duration?: number;
}
