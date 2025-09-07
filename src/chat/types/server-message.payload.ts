import { ClientMessagePayload } from 'shared/types/message';

export interface ServerMessagePayload extends ClientMessagePayload {
	user_id: number;
}
