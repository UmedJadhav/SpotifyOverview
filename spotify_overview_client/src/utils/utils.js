export const get_hash_params = () => {
    const hash_params = {};
    let e;
    const pattern = /([^&;=]+)=?([^&;]*)/g;
    const hash = window.location.hash.substring(1);
    while((e = pattern.exec(hash))){
        hash_params[e[1]] = decodeURIComponent(e[2]);
    }
    return hash_params;
}

