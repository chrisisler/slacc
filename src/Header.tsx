import React, { FC } from 'react';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import { AccessTime, Search, HelpOutline } from '@material-ui/icons';

import { Rows, slackColor, Pad } from './style';

const Container = styled(Rows).attrs(() => ({
  between: true,
  center: true,
}))`
  width: 100%;
  padding: ${Pad.Small} ${Pad.Medium};
  background-color: ${slackColor};
  color: white;
`;

const HeaderLeft = styled(Rows).attrs(() => ({
  center: true,
  pad: Pad.Large,
}))`
  flex: 0.3;
`;

const HeaderRight = styled(HeaderLeft)`
  justify-content: flex-end;
`;

const LeftAvatar = styled(Avatar)``;

const RightAvatar = styled(Avatar)``;

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
  return (
    <Container>
      <HeaderLeft>
        <LeftAvatar />
        <AccessTime />
      </HeaderLeft>
      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search Channel Name" />
      </SearchContainer>
      <HeaderRight>
        <HelpOutline />
        <RightAvatar />
      </HeaderRight>
    </Container>
  );
};
