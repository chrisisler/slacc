import React, { FC } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Chat } from './Chat';
import { Rows } from './style';

const Body = styled(Rows)`
  height: 100%;
`;

export const App: FC = () => {
  return (
    <>
      <Header />
      <Router>
        <Body>
          <Sidebar />
          <Switch>
            <Route path="/channel/:channelId">
              <Chat />
            </Route>
            <Route path="/">
              <h1>Dummy route</h1>
            </Route>
          </Switch>
        </Body>
      </Router>
    </>
  );
};
