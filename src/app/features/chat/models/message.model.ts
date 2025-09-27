export interface ReqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message extends ReqMessage {
  req_id?: string;
  ref_id?: string;
  total_duration?: number;
}

export interface SystemMessage extends ReqMessage {
  sys_msg_id: string;
  role: 'system';
  content: string;
  active: boolean;
  folder: string;
}
