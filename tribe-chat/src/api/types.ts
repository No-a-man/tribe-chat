export interface TMessageJSON {
  uuid: string;
  text: string;
  sender: string; // 'you' or participant UUID
  sentAt: string;
  edited?: boolean;
  reactions?: TReaction[];
  replyToMessage?: string;
  attachment?: {
    url: string;
    type: 'image' | 'video';
  };
}

export interface TReaction {
  emoji: string;
  participant: string;
  timestamp: string;
}

export interface TParticipant {
  uuid: string;
  name: string;
  avatar?: string;
  lastSeen?: string;
}