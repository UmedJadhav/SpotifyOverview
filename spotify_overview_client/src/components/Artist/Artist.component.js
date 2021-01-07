import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { format_with_commas, catch_errors } from '../../utils/utils';
import { get_artists, follow_artist, does_user_follow_artist  } from '../../utils/spotify_utils';
import styled from 'styled-components';
import theme from '../../styles/theme';
import media from '../../styles/media';
import mixins from '../../styles/mixins';
import Main from '../../styles/Main';

import Loader from '../Loader/Loader.component';
import PropTypes from 'prop-types';

const { colors, fontSizes, spacing } = theme;

const ArtistContainer = styled(Main)`
  ${mixins.flexCenter};
  flex-direction: column;
  height: 100%;
  text-align: center;
`;
const Artwork = styled.div`
  ${mixins.coverShadow};
  border-radius: 100%;
  img {
    object-fit: cover;
    border-radius: 100%;
    width: 300px;
    height: 300px;
    ${media.tablet`
      width: 200px;
      height: 200px;
    `};
  }
`;
const ArtistName = styled.h1`
  font-size: 70px;
  margin-top: ${spacing.md};
  ${media.tablet`
    font-size: 7vw;
  `};
`;
const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: ${spacing.md};
  text-align: center;
`;
const Stat = styled.div``;
const Number = styled.div`
  color: ${colors.blue};
  font-weight: 700;
  font-size: ${fontSizes.lg};
  text-transform: capitalize;
  ${media.tablet`
    font-size: ${fontSizes.md};
  `};
`;
const Genre = styled.div`
  font-size: ${fontSizes.md};
`;
const NumLabel = styled.p`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${spacing.xs};
`;
const FollowButton = styled.button`
  ${mixins.greenButton};
  margin-top: 50px;
  padding: 12px 50px;
  background-color: ${props => (props.isFollowing ? 'transparent' : colors.green)};
  border: 1px solid ${props => (props.isFollowing ? 'white' : 'transparent')};
  pointer-events: ${props => (props.isFollowing ? 'none' : 'auto')};
  cursor: ${props => (props.isFollowing ? 'default' : 'pointer')};
  &:hover,
  &:focus {
    background-color: ${props => (props.isFollowing ? 'transparent' : colors.offGreen)};
  }
`;

class Artist extends Component {
  static propTypes = {
    artistId: PropTypes.string,
  };

  state = {
    artist: null,
    isFollowing: null,
    artistId: this.props.match.params.artistId
  };

  componentDidMount() {
    catch_errors(this.getData());
    catch_errors(this.isFollowing());
  }

  async getData() {
    const { artistId } = this.state;
    const { data } = await get_artists(artistId);
    this.setState({ artist: data });
  }

  isFollowing = async () => {
    const { artistId } = this.state;
    const { data } = await does_user_follow_artist(artistId);
    this.setState({ isFollowing: data[0] });
  };

  follow = async () => {
    const { artistId } = this.state;
    await follow_artist(artistId);
    this.isFollowing();
  };

  render() {
    const { artist, isFollowing } = this.state;

    return (
      <React.Fragment>
        {artist ? (
          <ArtistContainer>
            <Artwork>
              <img src={artist.images[0].url} alt="Artist Artwork" />
            </Artwork>
            <div>
              <ArtistName>{artist.name}</ArtistName>
              <Stats>
                <Stat>
                  <Number>{format_with_commas(artist.followers.total)}</Number>
                  <NumLabel>Followers</NumLabel>
                </Stat>
                {artist.genres && (
                  <Stat>
                    <Number>
                      {artist.genres.map(genre => (
                        <Genre key={genre}>{genre}</Genre>
                      ))}
                    </Number>
                    <NumLabel>Genres</NumLabel>
                  </Stat>
                )}
                {artist.popularity && (
                  <Stat>
                    <Number>{artist.popularity}%</Number>
                    <NumLabel>Popularity</NumLabel>
                  </Stat>
                )}
              </Stats>
            </div>
            <FollowButton isFollowing={isFollowing} onClick={catch_errors(this.follow)}>
              {isFollowing ? 'Following' : 'Follow'}
            </FollowButton>
          </ArtistContainer>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Artist);
