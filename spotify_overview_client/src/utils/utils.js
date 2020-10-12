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

// HOF for async error handling 
export const catch_errors = fn => {
    return (...args)=>{
        return fn(...args)
        .catch(err => {
            console.error(err);
        });
    };
};

export const format_duration = millis => {
    const minutes = Math.floor(millis/ 60_000);
    const seconds = ((millis % 60_000)/1_000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0': ''}${seconds}`;
}



