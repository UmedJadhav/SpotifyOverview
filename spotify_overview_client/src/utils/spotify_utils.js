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
