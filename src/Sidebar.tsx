import React, { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  InsertComment,
  SvgIconComponent,
  Inbox,
  Drafts,
  BookmarkBorder,
  PeopleAlt,
  Apps,
  FileCopy,
  ExpandLess,
  Create,
  ExpandMore,
  Add,
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { Color, Columns, Rows, Pad } from './style';
import { DataState, DataStateView } from './DataState';
import { Channel } from './interfaces';
import { db, DbPath, DbWrite } from './firebase';

const SidebarContainer = styled(Columns)`
  color: #fff;
  background-color: ${Color.background};
  max-width: 260px;
  width: 30%;
  height: 100vh;
  overflow-y: scroll;
`;

const SidebarHeader = styled(Rows)`
  padding: ${Pad.Small} ${Pad.Medium};
`;

const Divider = styled.hr`
  margin: ${Pad.Small} 0;
  border: 0;
  border-top: 2px solid ${Color.backgroundAccent};
`;

export const Sidebar: FC = () => {
  const [channels, setChannels] = useState<DataState<Channel[]>>(
    DataState.Loading
  );

  const history = useHistory();

  const createChannel = useCallback(() => {
    const newChannel = prompt('What is the channel name?', 'coffee');
    if (newChannel && newChannel.length > 1) {
      DbWrite.channels({
        name: newChannel,
        messages: [],
      })
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

  return (
    <SidebarContainer>
      <Divider />
      <SidebarHeader between>
        <Columns>
          <h2>Channel Name</h2>
          <h5>Chris Isler</h5>
        </Columns>
        <Create />
      </SidebarHeader>
      <Divider />
      <SidebarOption Icon={InsertComment} title="Insert Comment" />
      <SidebarOption Icon={Inbox} title="Mentions & Reactions" />
      <SidebarOption Icon={Drafts} title="Saved" />
      <SidebarOption Icon={BookmarkBorder} title="Channel Browser" />
      <SidebarOption Icon={PeopleAlt} title="People" />
      <SidebarOption Icon={Apps} title="Apps" />
      <SidebarOption Icon={FileCopy} title="File Browser" />
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
              <SidebarOption
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

const SidebarOptionContainer = styled(Rows)`
  font-size: 0.9em;
  padding: ${Pad.Medium} ${Pad.Medium};
  cursor: pointer;

  &:hover {
    background-color: ${Color.backgroundDarker};
  }
`;

const SidebarHash = styled.span`
  padding: 0 0.175rem;
`;

// TODO Keyboard accessibility
const SidebarOption: FC<{
  // TODO Separate SidebarOption from SidebarChannelOption (also less vertical
  // padding for channels). This will make Icon? and channelId? non-void.
  Icon?: SvgIconComponent;
  title: string;
  channelId?: string;
  onClick?: () => void;
}> = ({ Icon, title, channelId, onClick }) => {
  const history = useHistory();
  const joinChannel = () => {
    if (channelId) {
      history.push(`/channel/${channelId}`);
    } else {
      history.push(title);
    }
  };
  return (
    <SidebarOptionContainer
      pad={Pad.Small}
      center
      onClick={onClick ?? joinChannel}
    >
      {Icon ? (
        <Icon style={{ fontSize: '15px' }} />
      ) : (
        <SidebarHash>#</SidebarHash>
      )}
      <h4>{title}</h4>
    </SidebarOptionContainer>
  );
};
