import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import styled from 'styled-components';

import Nav from '../Nav/Nav.component';
import User from '../User/User.component';
import ScrolltoTop from '../ScrollToTop/ScrollToTop.component';
import RecentlyPlayed from '../Recently_Played/Recently_Played.components';
import TopArtists from '../TopArtist/TopArtist.component';
import Playlists from '../Playlists/Playlists.components';
import Playlist from '../Playlist/Playlist.components';
import TopTracks from '../TopTracks/TopTracks.component';
import Recommendations from '../Recommendations/Recommendations.component';
import Track from '../Track/Track.component';
import Artist from '../Artist/Artist.component';

const SiteWrapper = styled.div`
`;

const Profile = () => (
    <Router >
        <SiteWrapper>
            <ScrolltoTop >
                <Nav/>
                <Route exact path='/' component={User}/>
                <Route exact path='/recent' component={RecentlyPlayed}/>
                <Route exact path='/artists' component={TopArtists}/>
                <Route exact path='/artist/:artistId' component={Artist}/>
                <Route exact path='/playlists/' component={Playlists}/>
                <Route exact path='/playlists/:playListId' component={Playlist}/>
                <Route exact path='/tracks' component={TopTracks}/>
                <Route exact path='/track/:trackId' component={Track}/>
                <Route exact path='/recommendations/:playListId' component={Recommendations}/>
            </ScrolltoTop>
        </SiteWrapper>
    </Router>
);

export default Profile;