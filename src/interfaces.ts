import { firestore } from 'firebase/app';

export interface RouteParams {
  channelId: string;
}

/**
 * Represents a place, marked by its `name`, where users
 * share messages.
 */
export interface Channel {
  /** The name of the channel what else could this be? */
  name: string;

  /** The automatically generated ID from Firebase. */
  id: string;

  /** The messages sent in this channel. All of them. */
  messages: Message[];

  // TODO
  // timestamp: firestore.FieldValue;
}

/**
 * Represents a single text sent from a user in a channel.
 */
export interface Message {
  /** The message text itself. */
  content: string;

  /** The author of the message. */
  username: string;

  /**
   * The URL of the authors profile image, if provided during account creation.
   */
  userImage?: string;

  /** The time the message posted to the server. */
  timestamp: firestore.FieldValue;

  /** The automatically generated ID from Firebase. */
  id: string;
}
