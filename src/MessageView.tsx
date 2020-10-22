import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { firestore } from 'firebase/app';
import { formatDistance } from 'date-fns';
import { Avatar } from '@material-ui/core';

import { Pad, Rows, Columns } from './style';
import { Message } from './interfaces';

const MessageViewContainer = styled(Rows).attrs(() => ({
  pad: Pad.Medium,
  center: true,
}))`
  padding-left: ${Pad.Medium};
`;

const imageCss = css`
  height: 50px;
  width: 50px;
  object-fit: contain;
`;

const UserImage = styled.img.attrs(() => ({
  alt: '',
}))`
  ${imageCss}
`;

/** A circular icon with the first letter of the author name. */
const DefaultUserImage = styled(Avatar).attrs(() => ({
  src: '/static/images/avatar/1.jpg',
}))`
  ${imageCss}
`;

const TimestampText = styled.span`
  color: gray;
  font-size: 0.8em;
`;

/**
 * Presentational component.
 * Displays a user image, the message author name, time the message was posted,
 * and the message itself.
 */
export const MessageView: FC<{ message: Message }> = ({
  message: { userImage, content, timestamp, username },
}) => (
  <MessageViewContainer>
    {userImage ? (
      <UserImage src={userImage} />
    ) : (
      <DefaultUserImage alt={username[0]} />
    )}
    <Columns>
      <Rows pad={Pad.Small} center>
        <p>
          <strong>{username}</strong>
        </p>
        <TimestampText>
          {formatDistance(
            (timestamp as firestore.Timestamp).toDate(),
            new Date(),
            { addSuffix: true }
          )}
        </TimestampText>
      </Rows>
      <p>{content}</p>
    </Columns>
  </MessageViewContainer>
);
