import React, { FC } from 'react';
import styled from 'styled-components';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

const Container = styled.div``;

export const App: FC = () => {
  return (
    <Container>
      <Header />
      <Sidebar />
      {/** Current Channel Messages */}
    </Container>
  );
};
