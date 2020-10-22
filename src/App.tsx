import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChannelView } from './ChannelView';
import { Rows } from './style';
import { Login } from './Login';

const Body = styled(Rows)`
  height: 100%;
`;

export const App: FC = () => {
  const [user, setUser] = useState(null);
  return (
    <>
      <Router>
        {!user ? (
          <Login />
        ) : (
          <>
            <Header />
            <Body>
              <Sidebar />
              <Switch>
                <Route path="/channel/:channelId">
                  <ChannelView />
                </Route>
                <Route path="/">
                  <h1>Dummy route</h1>
                </Route>
              </Switch>
            </Body>
          </>
        )}
      </Router>
    </>
  );
};
