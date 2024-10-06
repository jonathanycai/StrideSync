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

    async playCurrentSong(deviceId) {
        if (this.playlist.length === 0) {
            console.log('Playlist is empty. Fetch the playlist first.');
            return;
        }

        const currentSongTitle = this.playlist[this.currentSongIndex].title;
        console.log(`Playing song: ${currentSongTitle}`);

        try {
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

    previousSong() {
        if (this.currentSongIndex > 0) {
            this.currentSongIndex--;
            this.playCurrentSong();
        } else {
            console.log('Already at the beginning of the playlist.');
        }
    }

    nextSong() {
        if (this.currentSongIndex < this.playlist.length - 1) {
            this.currentSongIndex++;
            this.playCurrentSong();
        } else {
            console.log('End of playlist.');
        }
    }

    listSongs() {
        return this.playlist;
    }
}

module.exports = SpotifyController;
