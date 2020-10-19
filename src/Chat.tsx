import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { StarBorderOutlined } from '@material-ui/icons';

import { Pad, Rows, Color, Columns } from './style';
import { db, DbPath } from './firebase';
import { useDataState, DataStateView, DataState } from './DataState';
import { Channel, RouteParams } from './interfaces';
import { LinearProgress, CircularProgress } from '@material-ui/core';

const ChatContainer = styled.div`
  /** TODO Fix */
  width: 100%;
`;

const Header = styled(Rows)`
  padding: ${Pad.Medium};
  border-bottom: 1px solid ${Color.backgroundAccent};
`;

const ChannelTitle = styled.h4`
  text-transform: lowercase;
`;

export const Chat: FC = () => {
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

  // If the channel requested by the URL does not exist, go home
  useEffect(() => {
    if (DataState.isReady(channel) && !channel) {
      history.push('/');
    }
  }, [history, channel]);

  return (
    <ChatContainer>
      <Header center between>
        <Rows pad={Pad.Small} center>
          <DataStateView
            data={channel}
            loading={() => <ChannelTitle># ...</ChannelTitle>}
            error={() => <ChannelTitle># Something went wrong!</ChannelTitle>}
          >
            {channel => <ChannelTitle># {channel?.name}</ChannelTitle>}
          </DataStateView>
          <StarBorderOutlined />
        </Rows>
        <div>Details</div>
        {/** Details: Num users in channel, channel description */}
      </Header>
      <DataStateView
        data={channel}
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
        {channel => (
          <>
            {channel?.messages?.map(message => (
              <p>{message.content}</p>
            ))}
          </>
        )}
      </DataStateView>
    </ChatContainer>
  );
};
