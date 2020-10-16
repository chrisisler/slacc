import React, { FC } from 'react';
import styled from 'styled-components';

import { Header } from './Header';

const Container = styled.div``;

export const App: FC = () => {
  return (
    <Container>
      <Header />
      <h1>Slacc</h1>
    </Container>
  );
};
