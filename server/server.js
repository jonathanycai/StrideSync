require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const html = require('./public/page.js');  // Load the HTML content
const SpotifyController = require('./controllers/SpotifyController');  // Import SpotifyController
const OpenAiController = require('./controllers/OpenAiController.js');

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    return res.send(html);  // Serve the HTML content from page.js
});

// Handle POST request to generate a playlist based on user input
app.post('/spotify/generate', async (req, res) => {
    const { bpm, genre, duration } = req.body;

    try {
        const spotifyController = new SpotifyController(duration, genre, bpm);
        await spotifyController.getPlaylist();

        const playlist = spotifyController.listSongs();  // Get the generated playlist
        res.json({ playlist });  // Return the playlist as JSON
    } catch (error) {
        console.error('Error generating playlist:', error);
        res.status(500).send('Error generating playlist');
    }
});

// Handle POST request to play a song
app.post('/spotify/play', async (req, res) => {
    try {
        const spotifyController = new SpotifyController();  // Adjust as necessary
        await spotifyController.playCurrentSong();
        res.send('Playing song');
    } catch (error) {
        console.error('Error playing song:', error);
        res.status(500).send('Error playing song');
    }
});
//
// // Handle POST request to pause a song
// app.post('/spotify/pause', async (req, res) => {
//     try {
//         const spotifyController = new SpotifyController();  // Adjust as necessary
//         await spotifyController.pauseCurrentSong();
//         res.send('Paused song');
//     } catch (error) {
//         console.error('Error pausing song:', error);
//         res.status(500).send('Error pausing song');
//     }
// });
//
// // Handle POST request to play previous song
// app.post('/spotify/previous', async (req, res) => {
//     try {
//         const spotifyController = new SpotifyController();  // Adjust as necessary
//         await spotifyController.previousSong();
//         res.send('Playing previous song');
//     } catch (error) {
//         console.error('Error playing previous song:', error);
//         res.status(500).send('Error playing previous song');
//     }
// });
//
// // Handle POST request to skip to the next song
// app.post('/spotify/next', async (req, res) => {
//     try {
//         const spotifyController = new SpotifyController();  // Adjust as necessary
//         await spotifyController.nextSong();
//         res.send('Playing next song');
//     } catch (error) {
//         console.error('Error playing next song:', error);
//         res.status(500).send('Error playing next song');
//     }
// });
//
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
