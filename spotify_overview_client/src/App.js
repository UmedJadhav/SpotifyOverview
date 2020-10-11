import React, {Component} from 'react';
import './App.css';
import LoginPage from './components/Login/Login.component';

import styled from 'styled-components/macro';
import GlobalStyles from './styles/global_styles';

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

function App () {
  return (
    <AppContainer>
      <GlobalStyles/>
      <LoginPage/>
    </AppContainer>
  );
} 

export default App;