const SpotifyWebApi = require('spotify-web-api-node');
const OpenAiController = require('./OpenAiController');

// Initialize Spotify API with OAuth credentials
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

    // Authenticate using OAuth (refresh token if necessary)
    async authenticate() {
        try {
            if (spotifyApi.getAccessToken()) {
                return;  // Token already set
            }

            const data = await spotifyApi.refreshAccessToken();
            spotifyApi.setAccessToken(data.body['access_token']);
            console.log('Access token refreshed successfully.');
        } catch (error) {
            console.error('Error refreshing access token:', error);
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

    // Pause the current song
    async pauseCurrentSong() {
        try {
            await this.authenticate();
            await spotifyApi.pause();
            console.log('Playback paused');
        } catch (error) {
            console.error('Error pausing playback:', error);
        }
    }

    // Play the previous song in the playlist
    async previousSong() {
        if (this.currentSongIndex > 0) {
            this.currentSongIndex--;
            console.log(`Playing previous song: ${this.playlist[this.currentSongIndex].title}`);
            await this.playCurrentSong();
        } else {
            console.log('Already at the beginning of the playlist.');
        }
    }

    // Play the next song in the playlist
    async nextSong() {
        if (this.currentSongIndex < this.playlist.length - 1) {
            this.currentSongIndex++;
            console.log(`Playing next song: ${this.playlist[this.currentSongIndex].title}`);
            await this.playCurrentSong();
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
