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

    <!-- Player controls -->
    <h2>Music Player</h2>
    <div class="player-container">
        <audio id="music-player" controls>
        </audio>
        <button id="prev">Prev</button>
        <button id="play">Play/Pause</button>
        <button id="next">Next</button>
        <input type="range" id="volume" min="0" max="1" step="0.1">

        <div class="progress-bar">
            <div class="progress"></div>
        </div>

        <h2>Generated Playlist:</h2>
        <ul id="playlist" class="playlist">
            <!-- Playlist songs will be loaded here -->
        </ul>
    </div>

    <!-- Load the player.js script for additional functionality -->
    <script src="/player.js"></script>

    <script>
        document.getElementById('login-button').addEventListener('click', () => {
            window.location.href = '/login';
        });

        // Playlist generation event
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

        // Music control buttons
        const playBtn = document.getElementById('play');
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');
        const musicPlayer = document.getElementById('music-player');

        playBtn.addEventListener('click', () => {
            if (musicPlayer.paused) {
                musicPlayer.play();
                playBtn.textContent = "Pause";
            } else {
                musicPlayer.pause();
                playBtn.textContent = "Play";
            }
        });

        prevBtn.addEventListener('click', async () => {
            await fetch('/spotify/previous', { method: 'POST' });
        });

        nextBtn.addEventListener('click', async () => {
            await fetch('/spotify/next', { method: 'POST' });
        });

        // Volume control
        const volumeControl = document.getElementById('volume');
        volumeControl.addEventListener('input', () => {
            musicPlayer.volume = volumeControl.value;
        });

        // Progress bar update
        const progressBar = document.querySelector('.progress-bar');
        const progress = document.querySelector('.progress');

        musicPlayer.addEventListener('timeupdate', () => {
            const currentTime = musicPlayer.currentTime;
            const duration = musicPlayer.duration;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = progressPercent + '%';
        });
    </script>
</body>
</html>`;

module.exports = html;