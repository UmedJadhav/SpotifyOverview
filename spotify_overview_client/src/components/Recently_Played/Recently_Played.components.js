import React, { Component } from 'react';

import Loader from '../Loader/Loader.component';
import TrackItem from '../TrackItem/TrackItem.component';

import styled from 'styled-components/macro';
import Main from '../../styles/Main';

import {catch_errors} from '../../utils/utils';
import { get_Recently_Played } from '../../utils/spotify_utils';

const TracksContainer = styled.ul`
  margin-top: 50px;
`;

class RecentlyPlayed extends Component {
  state = {
    recentlyPlayed: null,
  };

  componentDidMount() {
    catch_errors(this.getData());
  }

  async getData() {
    const { data } = await get_Recently_Played();
    this.setState({ recentlyPlayed: data });
  }

  render() {
    const { recentlyPlayed } = this.state;

    return (
      <Main>
        <h2>Recently Played Tracks</h2>
        <TracksContainer>
          {recentlyPlayed ? (
            recentlyPlayed.items.map(({ track }, i) => <TrackItem track={track} key={i} />)
          ) : (
            <Loader />
          )}
        </TracksContainer>
      </Main>
    );
  }
}

export default RecentlyPlayed;