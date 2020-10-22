import React, { FC } from 'react';
import styled from 'styled-components';
import {
  AccessTime,
  Search,
  HelpOutline,
  HighlightOff,
} from '@material-ui/icons';

import { Rows, Color, Pad, UserImage } from './style';
import { useUser } from './useUser';
import { IconButton } from '@material-ui/core';
import { auth } from './firebase';

const Container = styled(Rows).attrs(() => ({
  between: true,
  center: true,
}))`
  width: 100%;
  padding: ${Pad.Small} ${Pad.Medium};
  background-color: ${Color.background};
  color: white;
`;

const LeftSection = styled(Rows).attrs(() => ({
  center: true,
  pad: Pad.Large,
}))`
  flex: 0.3;
`;

const RightSide = styled(LeftSection)`
  justify-content: flex-end;
`;

const SearchContainer = styled(Rows)`
  flex: 0.4;
  text-align: center;
  padding: 0 ${Pad.XLarge};
  color: grey;
  border: 1px grey solid;
  border-radius: ${Pad.XSmall};
`;

const SearchInput = styled.input.attrs(() => ({
  type: 'text',
}))`
  border: none;
  color: inherit;
  min-width: 35vw;
  text-align: center;
  background-color: transparent;
`;

export const Header: FC = () => {
  const [user] = useUser();

  if (!user) return null;

  return (
    <Container>
      <LeftSection>
        <UserImage
          size={35}
          src={user.photoURL ?? undefined}
          alt={user.displayName ?? undefined}
        />
      </LeftSection>
      <Rows pad={Pad.Medium}>
        <AccessTime />
        <SearchContainer>
          <Search />
          <SearchInput placeholder="Search Channels" />
        </SearchContainer>
      </Rows>
      <RightSide>
        <Rows pad={Pad.Small} center>
          <HelpOutline />
          <IconButton onClick={() => auth.signOut()}>
            <HighlightOff style={{ color: 'white' }} />
          </IconButton>
        </Rows>
      </RightSide>
    </Container>
  );
};
