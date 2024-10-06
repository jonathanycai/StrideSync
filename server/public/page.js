const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify OAuth Playback</title>
</head>
<body>
    <h1>Spotify OAuth Playback Control</h1>

    <!-- Spotify login -->
    <div>
        <button id="login-button">Login with Spotify</button>
    </div>

    <!-- Playlist generation -->
    <h2>Generate Playlist</h2>
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

    <button id="generate-playlist">Generate Playlist</button>

    <!-- Playback controls -->
    <h2>Playback Controls</h2>
    <div>
        <button id="play-button">Play</button>
        <button id="pause-button">Pause</button>
        <button id="previous-button">Play Previous</button>
        <button id="next-button">Play Next</button>
    </div>

    <h2>Generated Playlist:</h2>
    <ul id="playlist"></ul>

    <script>
        document.getElementById('login-button').addEventListener('click', () => {
            window.location.href = '/login';
        });

        document.getElementById('generate-playlist').addEventListener('click', async () => {
            const bpm = document.getElementById('bpm').value;
            const genre = document.getElementById('genre').value;
            const duration = document.getElementById('duration').value;

            if (!bpm || !genre || !duration) {
                alert("Please fill in all fields");
                return;
            }

            try {
                const response = await fetch('/spotify/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bpm: bpm,
                        genre: genre,
                        duration: duration
                    })
                });

                const data = await response.json();
                const playlistElement = document.getElementById('playlist');
                playlistElement.innerHTML = '';  // Clear previous list

                data.playlist.forEach(song => {
                    const li = document.createElement('li');
                    li.textContent = song.title;
                    playlistElement.appendChild(li);
                });

            } catch (error) {
                console.error('Error generating playlist:', error);
                alert('An error occurred while generating the playlist.');
            }
        });

        document.getElementById('play-button').addEventListener('click', async () => {
            await fetch('/spotify/play', { method: 'POST' });
        });

        document.getElementById('pause-button').addEventListener('click', async () => {
            await fetch('/spotify/pause', { method: 'POST' });
        });

        document.getElementById('previous-button').addEventListener('click', async () => {
            await fetch('/spotify/previous', { method: 'POST' });
        });

        document.getElementById('next-button').addEventListener('click', async () => {
            await fetch('/spotify/next', { method: 'POST' });
        });
    </script>
</body>
</html>`;

module.exports = html;