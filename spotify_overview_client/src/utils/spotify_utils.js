import axios from 'axios';
import { get_hash_params } from './utils';

const EXPIRATION_TIME = 3600 * 1000; // 1 hr

const set_token_timestamp = () => window.localStorage.setItem('spotify_token_timestamp', Date.now());

const set_Local_Access_Token = token => {
    set_token_timestamp();
    window.localStorage.setItem('spotify_access_token', token);
}

const set_Local_Refresh_Token = token => window.localStorage.setItem('spotify_refresh_token', token);

const get_token_Timestamp = () => window.localStorage.getItem('spotify_token_timestamp');

const get_Local_Access_Token = () => window.localStorage.getItem('spotify_access_token');

const get_local_Refresh_Token = () => window.localStorage.getItem('spotify_refresh_token');

const refresh_Access_Token = async () => {
    try{
        const { data } = await axios.get(`/refresh_token?refresh_token=${get_local_Refresh_Token}`);
        const { access_token } = data;
        set_Local_Access_Token(access_token);
        window.location.reload();
        return;
    }catch(err){
        console.error(err);
    }
};

export const get_Access_Token = () => {
    const { error, access_token, refresh_token } = get_hash_params();
    if(error){
        console.error(error);
        refresh_Access_Token();
    }

    if(Date.now() - get_token_Timestamp() > EXPIRATION_TIME){
        console.warn('Access token expired , Refreshing the token !');
        refresh_Access_Token();
    }

    const local_Access_Token = get_Local_Access_Token();
    const local_Refresh_Token = get_local_Refresh_Token();

    if(!local_Refresh_Token || local_Refresh_Token === 'undefined'){
        set_Local_Refresh_Token(refresh_token);
    }

    if(!local_Access_Token || local_Access_Token === 'undefined'){
        set_Local_Access_Token(access_token);
        return access_token;
    }

    return local_Access_Token;

}

export const token = get_Access_Token();

export const logout = () => {
    window.localStorage.removeItem('spotify_token_timestamp');
    window.localStorage.removeItem('spotify_access_token');
    window.localStorage.removeItem('spotify_refresh_token');
    window.location.reload();
}

const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
}

export const get_user = () => axios.get('https://api.spotify.com/v1/me', { headers });

export const get_following = () => axios.get('https://api.spotify.com/v1/me/following?type=artist', { headers });

export const get_playlists = () => axios.get('https://api.spotify.com/v1/me/playlists', { headers });


export const get_top_artists = (term) => axios.get(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${term}`, { headers });

export const get_top_tracks = (term) => axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${term}`, { headers });


export const get_user_info = () => {
    return axios.all(
        [get_user(), get_following(), get_playlists(), get_top_artists('long_term'), get_top_tracks('long_term')]
    ).then(
        axios.spread((user, followed_artists, playlists, top_artists, top_tracks) => {
            return {
                user: user.data,
                followed_artists: followed_artists.data,
                playlists: playlists.data,
                top_artists: top_artists.data,
                top_tracks: top_tracks.data
            };
        })
    );
};

export const get_Recently_Played = () => axios.get('https://api.spotify.com/v1/me/player/recently-played', { headers });
;

export const get_Playlist = playlistId =>
  axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers });

const get_track_ids = tracks => tracks.map(({ track }) => track.id).join(',');

export const get_Audio_Features_For_Tracks = tracks => {
    const ids = get_track_ids(tracks);
    return axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, { headers });
};

// https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
export const get_recommendations_For_Tracks = tracks => {
    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    const seed_tracks = get_track_ids(shuffledTracks.slice(0, 5));
    const seed_artists = '';
    const seed_genres = '';

    return axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`, { headers }
    );
};

export const createPlaylist = (userID, name) => {
    const url = `https://api.spotify.com/v1/users/${userID}/playlists`;
    const data = JSON.stringify({ name });
    return axios({ method: 'post', url, headers, data });
};

export const add_tracks_to_playlist = (playlistID, urls) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=${urls}`
    return axios({ method: 'post', url, headers });
};

export const follow_playlist = playlistId => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    return axios({ method: 'put', url, headers }); 
}

export const does_user_follow_playlist = (playlistId, userID) =>   axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userID}`, {
    headers,
  });

const get_track = trackId => axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { headers }); 

const get_track_Audio_Analysis = trackId => axios.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`, { headers });

const get_track_Audio_Features = trackId => axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers });

export const get_track_info = trackId => {
    return axios.all([ get_track(trackId), get_track_Audio_Analysis(trackId), get_track_Audio_Features(trackId) ])
            .then(axios.spread((track, audioAnalysis, audioFeatures) => {
                return {
                        track: track.data,
                        audioAnalysis: audioAnalysis.data,
                        audioFeatures: audioFeatures.data
                        }
                    })
            )
};

export const get_artists = artistId => axios.get(`https://api.spotify.com/v1/artists/${artistId}`, { headers });

export const follow_artist = artistId => axios.post(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,headers)

export const does_user_follow_artist = artistId => axios.get(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`, { headers });
