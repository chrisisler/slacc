import React, { FC, useState, useEffect } from 'react';
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

import { Color, Columns, Rows, Pad } from './style';
import { DataState, DataStateView } from './DataState';
import { Channel } from './interfaces';
import { db } from './firebase';

const SidebarContainer = styled(Columns)`
  color: #fff;
  background-color: ${Color.background};
  max-width: 260px;
`;

const Header = styled(Rows)`
  padding: ${Pad.Small} ${Pad.Medium};
`;

const Divider = styled.hr`
  margin: ${Pad.Small} 0;
  border-top: 1px solid ${Color.backgroundAccent};
`;

export const Sidebar: FC = () => {
  /** The state of the chat rooms users may join, from Firebase. */
  const [channels, setChannels] = useState<DataState<Channel[]>>(
    DataState.Loading
  );

  // Get a snapshot of the app's main DB data and listen for updates
  useEffect(() => {
    return db.collection('channels').onSnapshot(
      ({ docs }) => {
        const state = docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setChannels(state);
      },
      error => setChannels(DataState.error(error.message))
    );
  }, []);

  return (
    <SidebarContainer pad={Pad.Medium}>
      <Divider />
      <Header between>
        <Columns>
          <h2>Channel Name</h2>
          <h5>Chris Isler</h5>
        </Columns>
        <Create />
      </Header>
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
      <SidebarOption Icon={ExpandMore} title="Channels" />
      <Divider />
      <SidebarOption Icon={Add} title="Add Channel" />
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
              <SidebarOption key={channel.name} title={channel.name} />
            ))}
          </>
        )}
      </DataStateView>
    </SidebarContainer>
  );
};

// SidebarOption

const SidebarOptionContainer = styled(Rows)`
  align-items: center;
  font-size: 0.9em;
  padding-left: ${Pad.Medium};
  cursor: pointer;

  &:hover {
    background-color: ${Color.backgroundDarker};
  }
`;

const SidebarHash = styled.span`
  padding: 0 0.175rem;
`;

const SidebarOption: FC<{ Icon?: SvgIconComponent; title: string }> = ({
  Icon,
  title,
}) => {
  return (
    <SidebarOptionContainer pad={Pad.Small}>
      {Icon && <Icon style={{ fontSize: '15px' }} />}
      {!Icon && <SidebarHash>#</SidebarHash>}
      <h4>{title}</h4>
    </SidebarOptionContainer>
  );
};
