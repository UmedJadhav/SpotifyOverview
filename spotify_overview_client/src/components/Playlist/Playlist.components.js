import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {catch_errors} from '../../utils/utils';
import { get_Playlist, get_Audio_Features_For_Tracks  } from '../../utils/spotify_utils';


import Loader from '../Loader/Loader.component';
import TrackItem from '../TrackItem/TrackItem.component';
import FeatureChart from '../FeatureChart/FeatureChart.component';

import styled from 'styled-components/macro';
import theme from '../../styles/theme';
import mixins from '../../styles/mixins';
import media from '../../styles/media';
import Main from '../../styles/Main';

const { colors, fontSizes, spacing } = theme;

const PlaylistContainer = styled.div`
  display: flex;
  ${media.tablet`
    display: block;
  `};
`;
const Left = styled.div`
  width: 30%;
  text-align: center;
  min-width: 200px;
  ${media.tablet`
    width: 100%;
    min-width: auto;
  `};
`;
const Right = styled.div`
  flex-grow: 1;
  margin-left: 50px;
  ${media.tablet`
    margin: 50px 0 0;
  `};
`;
const PlaylistCover = styled.div`
  ${mixins.coverShadow};
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  ${media.tablet`
    display: none;
  `};
`;
const Name = styled.h3`
  font-weight: 700;
  font-size: ${fontSizes.xl};
  margin-top: 20px;
`;
const Description = styled.p`
  font-size: ${fontSizes.sm};
  color: ${colors.lightGrey};
  a {
    color: ${colors.white};
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
      border-bottom: 1px solid ${colors.white};
    }
  }
`;
const RecButton = styled(Link)`
  ${mixins.greenButton};
  margin-bottom: ${spacing.lg};
`;
const Owner = styled.p`
  font-size: ${fontSizes.sm};
  color: ${colors.lightGrey};
`;
const TotalTracks = styled.p`
  font-size: ${fontSizes.sm};
  color: ${colors.white};
  margin-top: 20px;
`;

class Playlist extends Component {
  static propTypes = {
    playlistId: PropTypes.string,
  };

  
  state = {
    playlist: null,
    tracks: null,
    audioFeatures: null,
    playlistId: this.props.match.params.playListId
  };

  componentDidMount() {
      catch_errors(this.getData());
    }
    
    async getData() {
    console.log('PlayListId', this.state.playlistId);
    const { data } = await get_Playlist(this.state.playlistId);
    this.setState({ playlist: data });

    if (data) {
      const { playlist } = this.state;
      const { data } = await get_Audio_Features_For_Tracks(playlist.tracks.items);
      this.setState({ audioFeatures: data });
    }
  }

  render() {
    const { playlist, audioFeatures } = this.state;

    return (
      <React.Fragment>
        {playlist ? (
          <Main>
            <PlaylistContainer>
              <Left>
                {playlist.images.length && (
                  <PlaylistCover>
                    <img src={playlist.images[0].url} alt="Album Art" />
                  </PlaylistCover>
                )}

                <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <Name>{playlist.name}</Name>
                </a>

                <Owner>By {playlist.owner.display_name}</Owner>

                {playlist.description && (
                  <Description dangerouslySetInnerHTML={{ __html: playlist.description }} />
                )}

                <TotalTracks>{playlist.tracks.total} Tracks</TotalTracks>

                <RecButton to={`/recommendations/${playlist.id}`}>Get Recommendations</RecButton>

                {audioFeatures && (
                  <FeatureChart features={audioFeatures.audio_features} type="horizontalBar" />
                )}
              </Left>
              <Right>
                <ul>
                  {playlist.tracks &&
                    playlist.tracks.items.map(({ track }, i) => (
                      <TrackItem track={track} key={i} />
                    ))}
                </ul>
              </Right>
            </PlaylistContainer>
          </Main>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Playlist);