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

export const get_year = date => date.split('-')[0];

export const parse_pitch_class = note => {
    let key = note;
    switch(note){
        case 0:
      key = 'C';
      break;
    case 1:
      key = 'D♭';
      break;
    case 2:
      key = 'D';
      break;
    case 3:
      key = 'E♭';
      break;
    case 4:
      key = 'E';
      break;
    case 5:
      key = 'F';
      break;
    case 6:
      key = 'G♭';
      break;
    case 7:
      key = 'G';
      break;
    case 8:
      key = 'A♭';
      break;
    case 9:
      key = 'A';
      break;
    case 10:
      key = 'B♭';
      break;
    case 11:
      key = 'B';
      break;
    default:
      return null;
    }
    return key;
}

export const format_with_commas = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');



