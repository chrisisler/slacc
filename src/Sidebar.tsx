import React, { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  SvgIconComponent,
  Inbox,
  Drafts,
  BookmarkBorder,
  PeopleAlt,
  ExpandLess,
  Create,
  ExpandMore,
  Add,
  FiberManualRecord,
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { Color, Columns, Rows, Pad } from './style';
import { DataState, DataStateView } from './DataState';
import { Channel } from './interfaces';
import { db, DbPath } from './firebase';
import { useUser } from './useUser';

const SidebarContainer = styled(Columns)`
  color: #fff;
  background-color: ${Color.background};
  max-width: 260px;
  width: 30%;
  height: 100%;
  overflow-y: scroll;
`;

const SidebarHeader = styled(Rows)`
  padding: ${Pad.Small} ${Pad.Medium};
`;

const Divider = styled.hr`
  margin: ${Pad.Medium} 0 !important;
  border: 0;
  border-top: 1px solid ${Color.backgroundAccent};
`;

export const Sidebar: FC = () => {
  const [channels, setChannels] = useState<DataState<Channel[]>>(
    DataState.Loading
  );

  const [user] = useUser();
  const history = useHistory();

  const createChannel = useCallback(() => {
    const newChannel = prompt('What is the channel name?', 'coffee');
    if (newChannel && newChannel.length > 1) {
      const entry: Omit<Channel, 'id'> = {
        name: newChannel,
        messages: [],
      };
      db.collection(DbPath.Channels)
        .add(entry)
        .catch(() => {
          // TODO warn
        })
        .then(doc => {
          if (!doc) return; // TODO warn
          history.push(`/channel/${doc.id}`);
        });
    }
  }, [history]);

  const toggleChannelsView = useCallback(() => {
    // Unimplemented
  }, []);

  useEffect(() => {
    return db
      .collection(DbPath.Channels)
      .orderBy('name', 'asc')
      .onSnapshot(
        ({ docs }) => {
          setChannels(
            docs.map(doc => ({ ...doc.data(), id: doc.id } as Channel))
          );
        },
        error => setChannels(DataState.error(error.message))
      );
  }, []);

  if (!user) return null;

  return (
    <SidebarContainer>
      <Divider />
      <SidebarHeader between>
        <Columns>
          <h2>Slacc</h2>
          <Rows center pad={Pad.XSmall}>
            <FiberManualRecord style={{ color: 'green' }} />
            <h5>{user.displayName}</h5>
          </Rows>
        </Columns>
        <Create />
      </SidebarHeader>
      <Divider />
      <SidebarOption Icon={Inbox} title="Mentions & Reactions" />
      <SidebarOption Icon={Drafts} title="Saved" />
      <SidebarOption Icon={BookmarkBorder} title="Channel Browser" />
      <SidebarOption Icon={PeopleAlt} title="People" />
      <SidebarOption Icon={ExpandLess} title="Show Less" />
      <Divider />
      <Grid container>
        <Grid item xs={8}>
          <SidebarOption
            Icon={ExpandMore}
            title="Channels"
            onClick={toggleChannelsView}
          />
        </Grid>
        <Grid item xs={4}>
          <SidebarOption Icon={Add} title="New" onClick={createChannel} />
        </Grid>
      </Grid>
      <DataStateView
        data={channels}
        error={() => (
          <Columns center>
            <h4>Sorry! Could not load channels :(</h4>
          </Columns>
        )}
        loading={() => (
          <Columns center>
            <h4>Fetching channels...</h4>
          </Columns>
        )}
      >
        {channels => (
          <>
            {channels.map(channel => (
              <SidebarChannelOption
                key={channel.id}
                channelId={channel.id}
                title={channel.name}
              />
            ))}
          </>
        )}
      </DataStateView>
    </SidebarContainer>
  );
};

// SidebarOption

const SidebarOptionContainer = styled(Rows).attrs(() => ({
  pad: Pad.Small,
  center: true,
}))`
  font-size: 0.9em;
  padding: ${Pad.Small} ${Pad.Medium};
  cursor: pointer;

  &:hover {
    background-color: ${Color.backgroundDarker};
  }
`;

const SidebarHash = styled.span`
  padding: 0 0.175rem;
`;

const SidebarChannelOption: FC<{
  title: string;
  channelId: string;
}> = ({ title, channelId }) => {
  const history = useHistory();
  const joinChannel = () => {
    if (channelId) {
      history.push(`/channel/${channelId}`);
    } else {
      history.push(title);
    }
  };
  return (
    <SidebarOptionContainer onClick={joinChannel}>
      <SidebarHash>#</SidebarHash>
      <h4>{title}</h4>
    </SidebarOptionContainer>
  );
};

const SidebarOption: FC<{
  Icon: SvgIconComponent;
  title: string;
  onClick?: () => void;
}> = ({ Icon, title, onClick }) => {
  const history = useHistory();
  const joinChannel = useCallback(() => history.push(title), [history, title]);
  return (
    <SidebarOptionContainer onClick={onClick ?? joinChannel}>
      <Icon style={{ fontSize: '15px' }} />
      <h4>{title}</h4>
    </SidebarOptionContainer>
  );
};
