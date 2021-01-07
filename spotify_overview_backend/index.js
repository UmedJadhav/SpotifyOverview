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
const { Buffer } = require('buffer');
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
    
    app.get('/callback', (req, res) => {
        // Handles refresh and access token flow
        const code = req.query.code || null;
        const state = req.query.state || null;
        const cookie_state = req.cookies ? req.cookies[cookie_key] : null ;

        if(state === null || state !== cookie_state){
            res.redirect(`/#${queryString.stringify({ error: 'state_mismatch'})}`);
        }else{
            res.clearCookie(cookie_state);
            const auth_options = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: REDIRECT_URL,
                    grant_type: 'authorization_code'
                },
            headers:{
                Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                },
                json: true,
            };

            request.post(auth_options, (error, response, body)=>{
                if(!error && response.statusCode === 200){
                    const access_token = body.access_token;
                    const refresh_token = body.refresh_token;

                    // passing the token to FE to make request from FE
                    res.redirect(
                        `${FRONTEND_URL}/#${queryString.stringify({
                            access_token,
                            refresh_token
                        })}`
                    );
                }else{
                    res.redirect(`/#${queryString.stringify({error: 'invalid_token'})}`);
                }
            });
        }
    });

    app.get('/refresh_token', (req, res) => {
        const refresh_token = req.query.refresh_token;
        const auth_options = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token
            },
            json: true
        };

        request.post(auth_options, (error, response, body) => {
            if(!error && response.statusCode == 200){
                const access_token = body.access_token;
                res.send({ access_token });
            }
        });
    });

    //Forward the rest of requests to React
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, path.join('../spotify_overview_client','public/index.html')));
    });

    app.listen(PORT, () => {
        console.warn(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
    });
}

