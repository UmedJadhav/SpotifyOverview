import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import styled from 'styled-components';
import theme from '../../styles/theme';
import media from '../../styles/media';

import Nav from '../Nav/Nav.component';
import User from '../User/User.component';
import ScrolltoTop from '../ScrollToTop/ScrollToTop.component';
import RecentlyPlayed from '../Recently_Played/Recently_Played.components';
import TopArtists from '../TopArtist/TopArtist.component';
import Playlists from '../Playlists/Playlists.components';
import Playlist from '../Playlist/Playlist.components';


const SiteWrapper = styled.div`
`;

const Profile = () => (
    <Router >
        <ScrolltoTop >
            <Nav/>
            <Route exact path='/' component={User}/>
            <Route exact path='/recent' component={RecentlyPlayed}/>
            <Route exact path='/artists' component={TopArtists}/>
            <Route exact path='/playlists/' component={Playlists}/>
            <Route exact path='/playlists/:playListId' component={Playlist}/>
        </ScrolltoTop>
    </Router>
);

export default Profile;