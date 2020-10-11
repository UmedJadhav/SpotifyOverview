import React, {Component} from 'react';

import LoginPage from './components/Login/Login.component';
import ProfilePage from './components/Profile/Profile.component';

import { token } from './utils/spotify_utils';

import styled from 'styled-components/macro';
import GlobalStyle from './styles/global_styles';

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

class App extends Component{
  state = {
    token: ''
  };

  componentDidMount(){
    this.setState({ token });
  }

  render(){
    const { token } = this.state;

    return (
      <AppContainer>
        <GlobalStyle/>
        { token ? <ProfilePage/> : <LoginPage/> }
      </AppContainer>
    )
  }
}

export default App;