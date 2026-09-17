export type MessageStatus = 'pending' | 'sending' | 'failed';

export type SendErrorCode = 'NETWORK_UNAVAILABLE' | 'RESPONSE_LOST' | 'MESSAGE_TOO_LONG' | 'NOT_SUBSCRIBED';

export type SendError = {
  code: SendErrorCode;
  recoverable: boolean;
};

// clientId is assigned at compose time and stays stable across retries and
// app restarts — that's what makes the backend's dedupe work.
export type Outgoing = {
  clientId: string;
  text: string;
  createdAt: number;
  status: MessageStatus;
  error?: SendError;
  attempts: number;
};

// What MessageList actually renders: either a confirmed server message (has a
// seq) or a still-outgoing one (no seq yet). Keeping them as a tagged union
// instead of merging fields avoids a message ever looking "confirmed" by
// accident.
export type ThreadRow =
  | { kind: 'confirmed'; clientId: string; seq: number; author: 'me' | 'them'; text: string; createdAt: number }
  | { kind: 'outgoing'; clientId: string; text: string; createdAt: number; status: MessageStatus; error?: SendError }
  | { kind: 'separator'; clientId: string; label: string };
