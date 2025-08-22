export interface ReqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message extends ReqMessage {
  req_id?: string;
  ref_id?: string;
  total_duration?: number;
}
