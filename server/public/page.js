const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Playlist Generator</title>
</head>
<body>
    <h1>Generate Spotify Playlist</h1>

    <div>
        <label for="bpm">BPM: </label>
        <input type="text" id="bpm" placeholder="Enter BPM" />
    </div>

    <div>
        <label for="genre">Genre: </label>
        <input type="text" id="genre" placeholder="Enter Genre" />
    </div>

    <div>
        <label for="duration">Duration (in minutes): </label>
        <input type="text" id="duration" placeholder="Enter Playlist Duration" />
    </div>

    <div>
        <button onclick="generatePlaylist()">Generate Playlist</button>
        <button onclick="playSong()">Play</button>
        <button onclick="pauseSong()">Pause</button>
        <button onclick="previousSong()">Previous</button>
        <button onclick="nextSong()">Next</button>
    </div>

    <h2>Playlist:</h2>
    <ul id="playlist">
        <!-- Songs will be listed here -->
    </ul>

    <script>
        async function generatePlaylist() {
            const bpm = document.getElementById('bpm').value;
            const genre = document.getElementById('genre').value;
            const duration = document.getElementById('duration').value;

            try {
                const response = await fetch('/spotify/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bpm, genre, duration }),
                });

                const data = await response.json();
                const playlistElement = document.getElementById('playlist');
                playlistElement.innerHTML = ''; // Clear any previous playlist

                if (data.playlist && data.playlist.length > 0) {
                    data.playlist.forEach(song => {
                        const li = document.createElement('li');
                        li.textContent = song.title;  // Assuming songs have a "title" attribute
                        playlistElement.appendChild(li);
                    });
                } else {
                    playlistElement.innerHTML = '<li>No songs found</li>';
                }
            } catch (error) {
                console.error('Error generating playlist:', error);
            }
        }

        async function playSong() {
            await fetch('/spotify/play', { method: 'POST' });
        }

        async function pauseSong() {
            await fetch('/spotify/pause', { method: 'POST' });
        }

        async function previousSong() {
            await fetch('/spotify/previous', { method: 'POST' });
        }

        async function nextSong() {
            await fetch('/spotify/next', { method: 'POST' });
        }
    </script>
</body>
</html>`

module.exports = html;