import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import styled from 'styled-components';
import theme from '../../styles/theme';
import media from '../../styles/media';

import Nav from '../Nav/Nav.component';

const SiteWrapper = styled.div`
`;

const Profile = () => (
    <Router>
        <Nav/>
    </Router>
);

export default Profile;