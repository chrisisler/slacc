import React, { FC } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChannelView } from './ChannelView';
import { Rows } from './style';
import { Login } from './Login';
import { useUser } from './useUser';

const AppContainer = styled.div`
  height: 100%;
`;

const Body = styled(Rows)`
  height: calc(100% - 64px);
`;

const SelectChannel = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
`;

export const App: FC = () => {
  const [user] = useUser();
  return (
    <>
      <Router>
        {!user ? (
          <Login />
        ) : (
          <AppContainer>
            <Header />
            <Body>
              <Sidebar />
              <Switch>
                <Route path="/channel/:channelId">
                  <ChannelView />
                </Route>
                <Route path="/">
                  <SelectChannel>
                    <h3>Join a channel to chat!</h3>
                  </SelectChannel>
                </Route>
              </Switch>
            </Body>
          </AppContainer>
        )}
      </Router>
    </>
  );
};
