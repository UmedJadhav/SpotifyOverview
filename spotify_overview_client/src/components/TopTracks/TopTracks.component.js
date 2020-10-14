import React, { Component } from 'react';


import { get_top_tracks } from '../../utils/spotify_utils';
import { catch_errors } from '../../utils/utils';

import Loader from '../Loader/Loader.component';
import TrackItem from '../TrackItem/TrackItem.component';

import styled from 'styled-components/macro';
import theme from '../../styles/theme';
import mixins from '../../styles/mixins';
import media from '../../styles/media';
import Main from '../../styles/Main';

const { colors, fontSizes } = theme;

const Header = styled.header`
  ${mixins.flexBetween};
  ${media.tablet`
    display: block;
  `};
  h2 {
    margin: 0;
  }
`;
const Ranges = styled.div`
  display: flex;
  margin-right: -11px;
  ${media.tablet`
    justify-content: space-around;
    margin: 30px 0 0;
  `};
`;
const RangeButton = styled.button`
  background-color: transparent;
  color: ${props => (props.isActive ? colors.white : colors.lightGrey)};
  font-size: ${fontSizes.base};
  font-weight: 500;
  padding: 10px;
  ${media.phablet`
    font-size: ${fontSizes.sm};
  `};
  span {
    padding-bottom: 2px;
    border-bottom: 1px solid ${props => (props.isActive ? colors.white : `transparent`)};
    line-height: 1.5;
    white-space: nowrap;
  }
`;
const TracksContainer = styled.ul`
  margin-top: 50px;
`;

class TopTracks extends Component {
  state = {
    topTracks: null,
    activeRange: 'long',
  };

  apiCalls = {
    long: get_top_tracks('long_term'),
    medium: get_top_tracks('medium_term'),
    short: get_top_tracks('short_term'),
  };

  componentDidMount() {
    catch_errors(this.getData());
  }

  async getData() {
    const { data } = await get_top_tracks('long_term');
    this.setState({ topTracks: data });
  }

  async changeRange(range) {
    const { data } = await this.apiCalls[range];
    this.setState({ topTracks: data, activeRange: range });
  }

  setActiveRange = range => catch_errors(this.changeRange(range));

  render() {
    const { topTracks, activeRange } = this.state;

    return (
      <Main>
        <Header>
          <h2>Top Tracks</h2>
          <Ranges>
            <RangeButton
              isActive={activeRange === 'long'}
              onClick={() => this.setActiveRange('long')}>
              <span>All Time</span>
            </RangeButton>
            <RangeButton
              isActive={activeRange === 'medium'}
              onClick={() => this.setActiveRange('medium')}>
              <span>Last 6 Months</span>
            </RangeButton>
            <RangeButton
              isActive={activeRange === 'short'}
              onClick={() => this.setActiveRange('short')}>
              <span>Last 4 Weeks</span>
            </RangeButton>
          </Ranges>
        </Header>
        <TracksContainer>
          {topTracks ? (
            topTracks.items.map((track, i) => <TrackItem track={track} key={i} />)
          ) : (
            <Loader />
          )}
        </TracksContainer>
      </Main>
    );
  }
}

export default TopTracks;