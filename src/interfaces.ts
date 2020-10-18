export interface Channel {
  /** The name of the channel what else could this be? */
  name: string;

  /** The automatically generated ID from Firebase. */
  id: string;
}

export interface Message {
  /** The content of the message. */
  message: string;

  /** The auther of the message. */
  username: string;

  /** The URL of the authors profile image.  */
  userImage: string;

  /** The time the message posted to the server. */
  timestamp: string;
}
