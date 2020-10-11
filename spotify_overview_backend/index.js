require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 8080;

const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length


const express = require('express');
const request = require('request');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const queryString = require('querystring');
const history = require('connect-history-api-fallback');
const helmet = require('helmet');
const cookie_key = 'spotify_auth_state';

const generateRandomString = (length) => {
    let random_string = '';
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charset_length = charset.length;
    for (let index = 0; index < length; index++) {
        random_string += charset.charAt(Math.floor(Math.random() * charset_length));
    }
    return random_string;
}

console.log(generateRandomString(7));

if(cluster.isMaster){
    console.warn(`Node cluster master ${process.pid} is running`);

    for (let index = 0; index < numCPUs; index++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
        }
    );
}else{
    const app = express();

    app.use(express.static(path.resolve(__dirname, '../client/build')))
    .use(helmet())
    .use(cors())
    .use(cookieParser())
    .use(
        history({
            verbose: true,
            rewrites: [
                { from: /\/login/, to: '/login' },
                { from: /\/callback/, to: '/callback'},
                { from: /\/refresh_token/, to: '/refresh_token'},
            ],
        }),
    )
    .use(express.static(path.resolve(__dirname, path.join('../spotify_overview_client','public'))));

    app.get('/', (req, res)=>{
        res.render(path.resolve(__dirname, path.join('../spotify_overview_client','public/index.html'))); 
    });

    app.get('/login', (req,res) => {
        const state = generateRandomString(16);
        res.cookie(cookie_key, state);

        const scope = `user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public`;

        res.redirect(
            `https://accounts.spotify.com/authorize?${queryString.stringify({
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: REDIRECT_URL,
                state: state
            })}`,
        )
    });
    
    app.listen(PORT, () => {
        console.warn(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
    })
}

