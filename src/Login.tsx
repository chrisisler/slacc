import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { Columns, Pad } from './style';
import { auth, provider } from './firebase';

const LoginContainer = styled(Columns)`
  height: 100vh;
  background-color: #f8f8f8;
  display: grid;
  place-items: center;
`;

const LoginCard = styled(Columns)`
  border-radius: 8px;
  text-align: center;
  padding: 7rem;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
`;

const LogoImage = styled.img.attrs(() => ({
  src:
    'https://www.pngfind.com/pngs/m/281-2810396_slack-slack-new-logo-png-transparent-png.png',
  alt: '',
}))`
  border-radius: 50%;
  object-fit: contain;
  height: 100px;
`;

const StyledButton = styled(Button)`
  text-transform: uppercase;
  background-color: #0a8d48 !important;
  color: #fff !important;
`;

export const Login: FC = () => {
  const signIn = useCallback(() => {
    auth.signInWithPopup(provider).catch(error => {
      alert(error.message);
    });
  }, []);

  return (
    <LoginContainer center>
      <LoginCard pad={Pad.Large}>
        <LogoImage />
        <h1>Sign in to Slacc</h1>
        <StyledButton onClick={signIn}>Sign in with Google</StyledButton>
      </LoginCard>
    </LoginContainer>
  );
};
