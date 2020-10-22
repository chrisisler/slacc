import React, { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { StarBorderOutlined } from '@material-ui/icons';
import { firestore } from 'firebase/app';
import { CircularProgress, Button } from '@material-ui/core';

import { Pad, Rows, Color, Columns } from './style';
import { db, DbPath } from './firebase';
import { useDataState, DataStateView, DataState } from './DataState';
import { Channel, RouteParams, Message } from './interfaces';
import { MessageView } from './MessageView';

const ChannelViewContainer = styled(Columns)`
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
`;

const ChannelHeader = styled(Rows).attrs(() => ({
  center: true,
  between: true,
}))`
  padding: ${Pad.Medium};
  border-bottom: 1px solid ${Color.backgroundAccent};
`;

const ChannelTitle = styled.h4`
  text-transform: lowercase;
`;

const MessageInputContainer = styled(Rows)`
  margin-top: auto;
  width: 100%;
`;

const MessageInput = styled.input`
  font-size: 1em;
  padding: ${Pad.Medium};
  border: 2px solid lightgray;
  border-radius: 5px;
  width: 100%;
  margin: ${Pad.Medium};
`;

const ChannelMessagesContainer = styled(Columns).attrs(() => ({
  pad: Pad.Medium,
}))`
  overflow-y: scroll;
`;

/**
 * Displays a header, the channel messages, and a message input.
 * Allows users to read and send messages with other users in the channel.
 */
export const ChannelView: FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DataState<Message[]>>(
    DataState.Empty
  );

  const { channelId } = useParams<RouteParams>();
  const history = useHistory();

  const [channel] = useDataState(
    () =>
      db
        .collection(DbPath.Channels)
        .doc(channelId)
        .get()
        .then(doc => doc.data() as Channel | undefined),
    [channelId]
  );

  const sendMessage = useCallback(
    <E extends React.SyntheticEvent>(event: E) => {
      event.preventDefault();
      const entry: Omit<Message, 'id'> = {
        content: message,
        // TODO auth
        username: 'fake username',
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      db.collection(DbPath.Channels)
        .doc(channelId)
        .collection(DbPath.Messages)
        .add(entry)
        .catch(() => {
          // TODO
        })
        .then(() => {
          setMessage('');
        });
    },
    [channelId, message]
  );

  useEffect(() => {
    if (DataState.exists(channel) && !channel) history.push('/');
  }, [history, channel]);

  useEffect(() => {
    setMessages(DataState.Loading);
    return db
      .collection(DbPath.Channels)
      .doc(channelId)
      .collection(DbPath.Messages)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        ({ docs }) => {
          setMessages(
            docs.map(doc => ({ ...doc.data(), id: doc.id } as Message))
          );
        },
        error => setMessages(DataState.error(error.message))
      );
  }, [channelId]);

  if (!channel) return null;

  return (
    <ChannelViewContainer>
      <ChannelHeader>
        <Rows pad={Pad.Small} center>
          <DataStateView
            data={channel}
            loading={() => <ChannelTitle># ...</ChannelTitle>}
            error={() => <ChannelTitle># Something went wrong!</ChannelTitle>}
          >
            {channel => <ChannelTitle># {channel.name}</ChannelTitle>}
          </DataStateView>
          <StarBorderOutlined />
        </Rows>
        <div>Details</div>
        {/** Details: Num users in channel, channel description */}
      </ChannelHeader>
      <DataStateView
        data={messages}
        loading={() => (
          <Columns center>
            <CircularProgress title="Working on it..." />
          </Columns>
        )}
        error={() => (
          <Columns center>
            <CircularProgress title="Could not load messages!" />
          </Columns>
        )}
      >
        {messages => (
          <ChannelMessagesContainer>
            {messages.map(m => (
              <MessageView message={m} key={m.id} />
            ))}
          </ChannelMessagesContainer>
        )}
      </DataStateView>
      <MessageInputContainer as="form" onSubmit={sendMessage}>
        <MessageInput
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder={
            DataState.exists(channel) ? `Message #${channel.name}` : 'Message'
          }
        />
        {message.length > 0 && <Button onClick={sendMessage}>SEND</Button>}
      </MessageInputContainer>
    </ChannelViewContainer>
  );
};
