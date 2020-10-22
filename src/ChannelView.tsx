import React, { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import {
  StarBorderOutlined,
  InfoOutlined,
  DeleteOutlined,
} from '@material-ui/icons';
import { firestore } from 'firebase/app';
import { CircularProgress, Button, IconButton } from '@material-ui/core';

import { Pad, Rows, Columns } from './style';
import { db, DbPath } from './firebase';
import { useDataState, DataStateView, DataState } from './DataState';
import { Channel, RouteParams, Message } from './interfaces';
import { MessageView } from './MessageView';
import { useUser } from './useUser';

const ChannelViewContainer = styled(Columns)`
  height: 100%;
  width: 100%;
`;

const ChannelHeader = styled(Rows).attrs(() => ({
  center: true,
  between: true,
}))`
  padding: ${Pad.Medium};
  border-bottom: 1px solid lightgray;
`;

const ChannelTitle = styled.h4`
  text-transform: lowercase;
`;

const MessageInputContainer = styled(Rows)`
  margin-top: auto;
  width: 100%;
  padding: ${Pad.Medium};
`;

const MessageInput = styled.input`
  font-size: 1em;
  padding: ${Pad.Medium};
  border: 1px solid lightgray;
  border-radius: 0 5px 5px 0;
  width: 100%;
`;

const MessageSendButton = styled(Button)`
  border: 1px solid lightgray !important;
  border-radius: 5px 0 0 5px !important;
  border-right: 0 !important;
  font-size: 1.2em !important;
`;

const ChannelMessagesContainer = styled(Columns)`
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

  const [user] = useUser();
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
      if (!user?.displayName) return;
      const entry: Omit<Message, 'id'> = {
        content: message,
        username: user.displayName,
        userImage: user.photoURL,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      db.collection(DbPath.Channels)
        .doc(channelId)
        .collection(DbPath.Messages)
        .add(entry)
        .catch(() => {
          setMessage('Something went wrong.');
        })
        .then(() => {
          setMessage('');
        });
    },
    [channelId, message, user]
  );

  const deleteChannel = useCallback(() => {
    if (!DataState.exists(channel) || !channel) return;
    if (!window.confirm(`Delete channel #${channel.name}?`)) return;
    db.collection(DbPath.Channels)
      .doc(channelId)
      .delete()
      .catch(() => {
        // TODO
      })
      .then(() => {
        history.push('/');
      });
  }, [channelId, channel, history]);

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

  if (!user || !channel) return null;

  return (
    <ChannelViewContainer pad={Pad.Medium}>
      <ChannelHeader>
        <Rows pad={Pad.Small} center>
          <DataStateView
            data={channel}
            loading={() => <ChannelTitle># ...</ChannelTitle>}
            error={() => <ChannelTitle># Something went wrong!</ChannelTitle>}
          >
            {channel => <ChannelTitle>#{channel.name}</ChannelTitle>}
          </DataStateView>
          <StarBorderOutlined />
        </Rows>
        <Rows pad={Pad.Small} center>
          <InfoOutlined />
          <IconButton aria-label="delete" onClick={deleteChannel} size="small">
            <DeleteOutlined />
          </IconButton>
        </Rows>
      </ChannelHeader>
      <DataStateView
        data={messages}
        loading={() => null}
        error={() => (
          <Columns center>
            <CircularProgress title="Could not load messages!" />
          </Columns>
        )}
      >
        {messages => (
          <ChannelMessagesContainer pad={Pad.XSmall}>
            {messages.map(m => (
              <MessageView message={m} key={m.id} />
            ))}
          </ChannelMessagesContainer>
        )}
      </DataStateView>
      <MessageInputContainer as="form" onSubmit={sendMessage}>
        <MessageSendButton
          onClick={sendMessage}
          disabled={message.length === 0}
        >
          +
        </MessageSendButton>
        <MessageInput
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder={
            DataState.exists(channel)
              ? `Message #${channel.name?.toLowerCase()}`
              : 'Message'
          }
        />
      </MessageInputContainer>
    </ChannelViewContainer>
  );
};
