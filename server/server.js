require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');  // Import SpotifyWebApi
const html = require('./public/page.js');  // Load the HTML content
const SpotifyController = require('./controllers/SpotifyController.js');  // Import SpotifyController

let spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

let spotifyController = null;  // Initialize a variable to hold the SpotifyController instance

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML content at "/"
app.get("/", (req, res) => {
    return res.send(html);  // Serve the HTML content from page.js
});

// Step 1: Redirect the user to Spotify for login
app.get('/login', (req, res) => {
    const scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'streaming',
        'user-read-email',
        'user-read-private'
    ];

    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

// Step 2: Handle the callback from Spotify
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);

        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];

        // Set the access and refresh tokens on the Spotify API object
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken);

        // Initialize SpotifyController with access token for the authenticated user
        spotifyController = new SpotifyController({
            spotifyApi: spotifyApi
        });

        // Redirect the user to the main app page after authentication
        res.redirect('/');
    } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error);
        res.redirect('/error');
    }
});

// Refresh token handler
app.get('/refresh_token', async (req, res) => {
    try {
        const data = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Access token refreshed:', data.body['access_token']);
        res.send('Access token refreshed');
    } catch (error) {
        console.error('Error refreshing access token:', error);
        res.status(500).send('Error refreshing access token');
    }
});

// Handle POST request to generate a playlist based on user input
app.post('/spotify/generate', async (req, res) => {
    const { bpm, genre, duration } = req.body;

    console.log('Generating playlist with:', { bpm, genre, duration });  // Log request parameters

    try {
        // Reinitialize the SpotifyController with the user-provided parameters
        spotifyController = new SpotifyController(duration, genre, bpm, spotifyApi);

        // Generate the playlist using the initialized SpotifyController
        await spotifyController.getPlaylist();

        // Get the generated playlist and return it as JSON
        const playlist = spotifyController.listSongs();
        res.json({ playlist });
    } catch (error) {
        console.error('Error generating playlist:', error);
        res.status(500).send('Error generating playlist');
    }
});

// Handle POST request to play a song
app.post('/spotify/play', async (req, res) => {
    try {
        // Ensure that the playlist has been generated
        if (!spotifyController || !spotifyController.playlist.length) {
            return res.status(400).send('No playlist available to play');
        }
        console.log("Play button works");

        await spotifyController.playCurrentSong();
        res.send('Playing song');
    } catch (error) {
        console.error('Error playing song:', error);
        res.status(500).send('Error playing song');
    }
});

// Handle POST request to pause a song
app.post('/spotify/pause', async (req, res) => {
    try {
        if (!spotifyController) {
            return res.status(400).send('No active playlist to pause');
        }

        await spotifyController.pauseCurrentSong();
        res.send('Paused song');
    } catch (error) {
        console.error('Error pausing song:', error);
        res.status(500).send('Error pausing song');
    }
});

// Handle POST request to play previous song
app.post('/spotify/previous', async (req, res) => {
    try {
        if (!spotifyController) {
            return res.status(400).send('No active playlist');
        }

        await spotifyController.previousSong();
        res.send('Playing previous song');
    } catch (error) {
        console.error('Error playing previous song:', error);
        res.status(500).send('Error playing previous song');
    }
});

// Handle POST request to skip to the next song
app.post('/spotify/next', async (req, res) => {
    try {
        if (!spotifyController) {
            return res.status(400).send('No active playlist');
        }

        await spotifyController.nextSong();
        res.send('Playing next song');
    } catch (error) {
        console.error('Error playing next song:', error);
        res.status(500).send('Error playing next song');
    }
});

app.get('/api/songs', (req, res) => {
    const songs = [
        { name: 'Not Like Us', path: '/songs/notLikeUs.mp3' },
        { name: 'Lose Yourself', path: '/songs/loseYourself.mp3' },
        { name: 'No Role Modelz', path: '/songs/noRoleModelz.mp3' },
        { name: 'Real Slim Shady', path: '/songs/realSlimShady.mp3' },
        { name: 'Surround Sound', path: '/songs/surroundSound.mp3' },
        { name: 'Too Comfortable', path: 'songs/tooComfortable.mp3' },
    ];
    res.json(songs);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});