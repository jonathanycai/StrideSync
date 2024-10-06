const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
dotenv.config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant().then(
    (data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Access token retrieved successfully');
    },
    (err) => {
        console.log('Error retrieving access token', err);
    }
);
