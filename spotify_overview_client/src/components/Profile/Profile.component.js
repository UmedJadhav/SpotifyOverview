import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import styled from 'styled-components';
import theme from '../../styles/theme';
import media from '../../styles/media';

import Nav from '../Nav/Nav.component';
import User from '../User/User.component';
import ScrolltoTop from '../ScrollToTop/ScrollToTop.component';
import RecentlyPlayed from '../Recently_Played/Recently_Played.components';

const SiteWrapper = styled.div`
`;

const Profile = () => (
    <Router >
        <ScrolltoTop >
            <Nav/>
            <Route exact path='/' component={User}/>
            <Route exact path='/recent' component={RecentlyPlayed}/>
        </ScrolltoTop>
    </Router>
);

export default Profile;