import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { firestore } from 'firebase/app';
import { formatDistance } from 'date-fns';
import { Avatar, Popper, IconButton } from '@material-ui/core';

import { Pad, Rows, Columns, UserImage } from './style';
import { Message, RouteParams } from './interfaces';
import { DeleteOutline } from '@material-ui/icons';
import { useUser } from './useUser';
import { db, DbPath } from './firebase';
import { useParams } from 'react-router-dom';

const MessageViewContainer = styled(Rows).attrs(() => ({
  pad: Pad.Medium,
  center: true,
}))`
  padding: ${Pad.Small} ${Pad.Medium};

  &:hover {
    background-color: #fefefe;
  }
`;

/** A circular icon with the first letter of the author name. */
const DefaultUserImage = styled(Avatar).attrs(() => ({
  src: '/static/images/avatar/1.jpg',
}))`
  height: 50px;
  width: 50px;
  object-fit: contain;
`;

const TimestampText = styled.span`
  color: gray;
  font-size: 0.8em;
`;

const ActionsContainer = styled(Rows)`
  padding: 0 ${Pad.Small};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: #fff;
  z-index: 100;
`;

/**
 * Presentational component.
 * Displays a user image, the message author name, time the message was posted,
 * and the message itself.
 */
export const MessageView: FC<{ message: Message }> = ({
  message: { id, userImage, content, timestamp, username },
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [user] = useUser();
  const { channelId } = useParams<RouteParams>();
  const ownedMessage = user?.displayName === username;

  const showActions = !!anchorEl;
  const popperId = showActions ? 'popper' : undefined;

  const deleteComment = useCallback(() => {
    if (!window.confirm(`Delete message ${content.slice(0, 60)}?`)) return;
    db.collection(DbPath.Channels)
      .doc(channelId)
      .collection(DbPath.Messages)
      .doc(id)
      .delete()
      .catch(() => {
        // TODO
      });
  }, [channelId, id]);

  if (!user?.displayName) return null;

  return (
    <MessageViewContainer
      aria-owns={popperId}
      aria-haspopup="true"
      onMouseEnter={event => setAnchorEl(event.currentTarget)}
      onMouseLeave={() => setAnchorEl(null)}
    >
      {userImage ? (
        <UserImage src={userImage} alt={username} />
      ) : (
        <DefaultUserImage alt={username[0]} />
      )}
      <Columns>
        <Rows pad={Pad.Small} center>
          <p>
            <strong>{username}</strong>
          </p>
          {timestamp && (
            <TimestampText>
              {formatDistance(
                (timestamp as firestore.Timestamp).toDate(),
                new Date(),
                { addSuffix: true }
              )}
            </TimestampText>
          )}
        </Rows>
        <p>{content}</p>
      </Columns>
      {ownedMessage && (
        <Popper
          placement="bottom"
          id={popperId}
          open={showActions}
          anchorEl={anchorEl}
        >
          <ActionsContainer>
            <IconButton onClick={deleteComment}>
              <DeleteOutline />
            </IconButton>
          </ActionsContainer>
        </Popper>
      )}
    </MessageViewContainer>
  );
};
