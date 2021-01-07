import React, { Component } from 'react';
import { Link }  from 'react-router-dom';

import styled from 'styled-components/macro';
import theme from '../../styles/theme';
import mixins from '../../styles/mixins';
import media from '../../styles/media';
import Main from '../../styles/Main';

import { get_user_info, logout } from '../../utils/spotify_utils';
import { catch_errors } from '../../utils/utils';

import IconUser from '../icons/user.svg';
import IconInfo from '../icons/info.svg.js';

import Loader from '../Loader/Loader.component.js';
import TrackItem from '../TrackItem/TrackItem.component.js';

const { colors, fontSizes, spacing } = theme;

const Header = styled.header`
    ${mixins.flexCenter};
    flex-direction: column;
    position: relative;
`;

const Avatar = styled.div`
    width: 250px;
    height: 200px;
    img{
        border-radius: 100%;
    }
`;

const NoAvatar = styled.div`
    border: 2px solid currentColor ;
    border-radius: 100%;
    padding: ${spacing.md};
`;

const UserName = styled.a`
    &:hover,
    &:focus{
        color: ${colors.offGreen};
    }
`;

const Name = styled.h1`
    font-size: 50px;
    font-weight: 700;
    margin: 20px 0 0;
    ${media.tablet`
        font-size: 40px
    `};
    ${media.phablet`
        font-size: 8vw;
    `};
`;

const Stats = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 30px;
    margin-top: ${spacing.base};
`;

const Stat = styled.div`
    text-align: center;
`;

const Number = styled.div`
    color: ${colors.green};
    font-weight: 700;
    font-size: ${fontSizes.md};
`;

const NumLabel = styled.div`
    color: ${colors.lightGrey};
    font-size: ${fontSizes.xs};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: ${spacing.xs};
`;

const LogoutButton = styled.a`
  background-color: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  border-radius: 30px;
  margin-top: 30px;
  padding: 12px 30px;
  font-size: ${fontSizes.xs};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${colors.white};
    color: ${colors.black};
  }
`;
const Preview = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 70px;
  width: 100%;
  margin-top: 100px;
  ${media.tablet`
    display: block;
    margin-top: 70px;
  `};
`;
const Tracklist = styled.div`
  ${media.tablet`
    &:last-of-type {
      margin-top: 50px;
    }
  `};
`;
const TracklistHeading = styled.div`
  ${mixins.flexBetween};
  margin-bottom: 40px;
  h3 {
    display: inline-block;
    margin: 0;
  }
`;
const MoreButton = styled(Link)`
  ${mixins.button};
  text-align: center;
  white-space: nowrap;
  ${media.phablet`
    padding: 11px 20px;
    font-sizes: ${fontSizes.xs};
  `};
`;
const Mask = styled.div`
  ${mixins.flexCenter};
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: ${colors.white};
  opacity: 0;
  transition: ${theme.transition};
  svg {
    width: 25px;
  }
`;
const Artist = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.md};
  ${media.tablet`
    margin-bottom: ${spacing.base};
  `};
  &:hover,
  &:focus {
    ${Mask} {
      opacity: 1;
    }
  }
`;
const ArtistArtwork = styled(Link)`
  display: inline-block;
  position: relative;
  width: 50px;
  min-width: 50px;
  margin-right: ${spacing.base};
  img {
    width: 50px;
    min-width: 50px;
    height: 50px;
    margin-right: ${spacing.base};
    border-radius: 100%;
  }
`;

const ArtistName = styled(Link)`
  flex-grow: 1;
  span {
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
      border-bottom: 1px solid ${colors.white};
    }
  }
`;

class User extends Component {
  state = {
    user: null,
    followed_Artists: null,
    playlists: null,
    top_artists: null,
    top_tracks: null,
  };

  async get_data(){
    const { user, followed_Artists, playlists, top_artists, top_tracks } = await get_user_info();
    console.log(top_artists, top_tracks)
    this.setState({ user, followed_Artists, playlists, top_artists, top_tracks });
  }

  componentDidMount(){
      catch_errors(this.get_data());
  }

  render() {
    const { user, followedArtists, playlists, top_artists, top_tracks } = this.state;
    const totalPlaylists = playlists ? playlists.total : 0;

    return (
      <React.Fragment>
        {user ? (
          <Main>
            <Header>
              <Avatar>
                {user.images.length > 0 ? (
                  <img src={user.images[0].url} alt="avatar" />
                ) : (
                  <NoAvatar>
                    <IconUser />
                  </NoAvatar>
                )}
              </Avatar>
              <UserName href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <Name>{user.display_name}</Name>
              </UserName>
              <Stats>
                <Stat>
                  <Number>{user.followers.total}</Number>
                  <NumLabel>Followers</NumLabel>
                </Stat>
                {followedArtists && (
                  <Stat>
                    <Number>{followedArtists.artists.items.length}</Number>
                    <NumLabel>Following</NumLabel>
                  </Stat>
                )}
                {totalPlaylists && (
                  <Stat>
                    <Link to="playlists">
                      <Number>{totalPlaylists}</Number>
                      <NumLabel>Playlists</NumLabel>
                    </Link>
                  </Stat>
                )}
              </Stats>
              <LogoutButton onClick={logout}>Logout</LogoutButton>
            </Header>

            <Preview>
              <Tracklist>
                <TracklistHeading>
                  <h3>Top Artists of All Time</h3>
                  <MoreButton to="/artists">See More</MoreButton>
                </TracklistHeading>
                <div>
                  {top_artists ? (
                    <ul>
                      {top_artists.items.slice(0, 10).map((artist, i) => (
                        <Artist key={i}>
                          <ArtistArtwork to={`/artist/${artist.id}`}>
                            {artist.images.length && (
                              <img src={artist.images[2].url} alt="Artist" />
                            )}
                            <Mask>
                              <IconInfo />
                            </Mask>
                          </ArtistArtwork>
                          <ArtistName to={`/artist/${artist.id}`}>
                            <span>{artist.name}</span>
                          </ArtistName>
                        </Artist>
                      ))}
                    </ul>
                  ) : (
                    <Loader />
                  )}
                </div>
              </Tracklist>

              <Tracklist>
                <TracklistHeading>
                  <h3>Top Tracks of All Time</h3>
                  <MoreButton to="/tracks">See More</MoreButton>
                </TracklistHeading>
                <ul>
                  {top_tracks ? (
                    top_tracks.items
                      .slice(0, 10)
                      .map((track, i) => <TrackItem track={track} key={i} />)
                  ) : (
                    <Loader />
                  )}
                </ul>
              </Tracklist>
            </Preview>
          </Main>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}

export default User;
