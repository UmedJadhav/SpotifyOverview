import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { get_Playlist, get_recommendations_For_Tracks, get_user, createPlaylist, add_tracks_to_playlist, follow_playlist, does_user_follow_playlist } from '../../utils/spotify_utils';
import { catch_errors } from '../../utils/utils';

import TrackItem from '../TrackItem/TrackItem.component';

import styled from 'styled-components/macro';
import theme from '../../styles/theme';
import mixins from '../../styles/mixins';
import media from '../../styles/media';
import Main from '../../styles/Main';

const { colors } = theme;

const PlaylistHeading = styled.div`
  ${mixins.flexBetween};
  ${media.tablet`
    flex-direction: column;
  `};
  h2 {
    margin-bottom: 0;
  }
`;
const SaveButton = styled.button`
  ${mixins.greenButton};
`;
const OpenButton = styled.a`
  ${mixins.button};
`;
const TracksContainer = styled.ul`
  margin-top: 50px;
`;
const PlaylistLink = styled(Link)`
  &:hover,
  &:focus {
    color: ${colors.offGreen};
  }
`;

class Recommendations extends Component {
  static propTypes = {
    playlistId: PropTypes.string,
  };

  state = {
    playlist: null,
    recommendations: null,
    userId: null,
    isFollowing: false,
    playlistId: this.props.match.params.playListId
  };

  componentDidMount() {
    catch_errors(this.getData());
  }

  async getData() {
    const { data } = await get_Playlist(this.state.playlistId);
    this.setState({ playlist: data });

    if (data) {
      const { playlist } = this.state;
      console.log('Umed playlist' , playlist);
      const { data } = await get_recommendations_For_Tracks(playlist.tracks.items);
      this.setState({ recommendations: data });
    }
  }

  getTrackUris = recommendations => recommendations.tracks.map(({ uri }) => uri);

  createPlaylist = async () => {
    const { playlist } = this.state;
    const name = `Recommended Tracks Based on ${playlist.name}`;
    const { data } = await get_user();
    const userId = data.id;
    this.setState({ userId });

    if (data) {
      const { data } = await createPlaylist(userId, name);
      const recPlaylistId = data.id;
      this.setState({ recPlaylistId });

      if (data) {
        catch_errors(this.addTracksAndFollow(recPlaylistId));
      }
    }
  };

  addTracksAndFollow = async playlistId => {
    const { recommendations } = this.state;
    const uris = this.getTrackUris(recommendations).join(',');
    const { data } = await add_tracks_to_playlist(playlistId, uris);

    if (data) {
      await follow_playlist(playlistId);
      catch_errors(this.isFollowing(playlistId));
    }
  };

  isFollowing = async playlistId => {
    const { userId } = this.state;
    const { data } = await does_user_follow_playlist(playlistId, userId);
    this.setState({ isFollowing: data[0] });
  };

  render() {
    const { playlist, recommendations, isFollowing, recPlaylistId } = this.state;

    return (
      <Main>
        {playlist && (
          <PlaylistHeading>
            <h2>
              Recommended Tracks Based On{' '}
              <PlaylistLink to={`/playlist/${playlist.id}`}>{playlist.name}</PlaylistLink>
            </h2>
            {isFollowing && recPlaylistId ? (
              <OpenButton
                href={`https://open.spotify.com/playlist/${recPlaylistId}`}
                target="_blank"
                rel="noopener noreferrer">
                Open in Spotify
              </OpenButton>
            ) : (
              <SaveButton onClick={catch_errors(this.create_playlist)}>Save to Spotify</SaveButton>
            )}
          </PlaylistHeading>
        )}
        <TracksContainer>
          {recommendations &&
            recommendations.tracks.map((track, i) => <TrackItem track={track} key={i} />)}
        </TracksContainer>
      </Main>
    );
  }
}

export default withRouter(Recommendations);