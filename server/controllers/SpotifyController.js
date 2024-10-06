const SpotifyWebApi = require('spotify-web-api-node');
const OpenAiController = require('./OpenAiController');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

class SpotifyController {
    constructor(workoutLength, genre, bpm) {
        this.workoutLength = workoutLength;
        this.genre = genre;
        this.bpm = bpm;
        this.playlist = [];
        this.currentSongIndex = 0;
        this.openAIController = new OpenAiController(workoutLength, genre, bpm);
    }

    // Method to authenticate Spotify API using client credentials grant
    async authenticate() {
        try {
            const data = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(data.body['access_token']);
            console.log('Access token retrieved successfully');
        } catch (error) {
            console.error('Error authenticating Spotify:', error);
        }
    }

    // Fetch playlist using OpenAI and store it
    async getPlaylist() {
        try {
            this.playlist = await this.openAIController.getPlaylist();
            if (this.playlist && this.playlist.length > 0) {
                console.log('Playlist generated:', this.playlist);
            } else {
                console.log('No songs returned from OpenAI.');
            }
        } catch (error) {
            console.error('Error generating playlist:', error);
        }
    }

    // Play the current song
    async playCurrentSong(deviceId) {
        if (this.playlist.length === 0) {
            console.log('Playlist is empty. Fetch the playlist first.');
            return;
        }

        const currentSongTitle = this.playlist[this.currentSongIndex].title;
        console.log(`Playing song: ${currentSongTitle}`);

        try {
            // Ensure the API is authenticated
            await this.authenticate();

            const searchResponse = await spotifyApi.searchTracks(`track:${currentSongTitle}`, { limit: 1 });

            if (searchResponse.body.tracks.items.length > 0) {
                const firstTrack = searchResponse.body.tracks.items[0];
                const trackUri = firstTrack.uri;
                await spotifyApi.play({ device_id: deviceId, uris: [trackUri] });
                console.log('Playback started');
            } else {
                console.log('No results found for the song title.');
            }
        } catch (error) {
            console.error('Error playing song:', error);
        }
    }

    // Play previous song
    previousSong() {
        if (this.currentSongIndex > 0) {
            this.currentSongIndex--;
            this.playCurrentSong();
        } else {
            console.log('Already at the beginning of the playlist.');
        }
    }

    // Play next song
    nextSong() {
        if (this.currentSongIndex < this.playlist.length - 1) {
            this.currentSongIndex++;
            this.playCurrentSong();
        } else {
            console.log('End of playlist.');
        }
    }

    // List the songs in the playlist
    listSongs() {
        return this.playlist;
    }
}

module.exports = SpotifyController;