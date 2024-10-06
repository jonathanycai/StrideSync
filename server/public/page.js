const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #333333;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: white;
        }
        
        .button_style {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
        }

        .container {
            width: 90%;  
            max-width: 1400px;
            background-color: #444444;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1, h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            color: #bbbbbb;
        }

        input[type="text"] {
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            border: none;
            margin-bottom: 15px;
            background-color: #555555;
            color: white;
        }

        button {
            width: 33%;
            padding: 12px;
            background-color: #317BFE;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 16px;
        }

        button:hover {
            background-color: #2565CC;
        }

        .player-container {
            margin-bottom: 20px;
            text-align: center;
        }

        .player-container audio {
            width: 100%;
            margin-bottom: 15px;
        }

        #prev, #play, #next {
            background-color: white;
            color: #317BFE;
            border: none;
            padding: 10px;
            margin: 5px;
            border-radius: 50%;
            cursor: pointer;
            width: 60px;
            height: 60px;
            font-size: 24px;
        }

        #prev:hover, #play:hover, #next:hover {
            background-color: #dddddd;
        }

        #volume {
            width: 100%;
            margin-top: 15px;
        }

        #playlist {
            list-style-type: none;
            padding: 0;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        #playlist.hidden {
            display: none;
        }

        #playlist li {
            background-color: #555555;
            padding: 15px;
            border-radius: 10px;
            flex: 1 1 calc(33% - 20px);
            text-align: center;
        }

        .progress-bar {
            height: 8px;
            background-color: #555555;
            border-radius: 5px;
            margin-top: 10px;
        }

        .progress {
            height: 100%;
            background-color: #317BFE;
            width: 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 id="spotify_title">Spotify</h1>

        <!-- Spotify login -->
        <div id="" class="button_style">
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
        <div class="button_style">
            <button id="generate-playlist">Generate Playlist</button>
        </div>
        

        <!-- Player controls -->
        <h2>Music Player</h2>
        <div class="player-container">
            <audio id="music-player" controls></audio>
            <button id="prev">⏮</button>
            <button id="play">⏯</button>
            <button id="next">⏭</button>
            <input type="range" id="volume" min="0" max="1" step="0.1">
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        </div>

        <!-- Generated Playlist - initially hidden -->
        <h2>Generated Playlist:</h2>
        <ul id="playlist" class="hidden">
            <li>Not Like Us</li>
            <li>Lose Yourself</li>
            <li>No Role Modelz</li>
            <li>Real Slim Shady</li>
            <li>Surround Sound</li>
            <li>Too Comfortable</li>
        </ul>
    </div>

    <script src="/player.js"></script>
    <script>
        window.addEventListener('load', () => {
            // Hide the playlist initially
            const playlistElement = document.getElementById('playlist');

            // Handle the Play/Pause functionality
            let isPlaying = false;  // Variable to track if audio is playing
            const musicPlayer = document.getElementById('music-player');
            const playBtn = document.getElementById('play');

            playBtn.addEventListener('click', () => {
                if (isPlaying) {
                    musicPlayer.pause();
                    playBtn.textContent = "⏯";
                    isPlaying = false;
                } else {
                    musicPlayer.play();
                    playBtn.textContent = "⏸";  // Change to Pause symbol
                    isPlaying = true;
                }
            });
            const spotify_title = document.getElementById('spotify_title');
            const login_button = document.getElementById('login-button');
            document.getElementById('generate-playlist').addEventListener('click', () => {
                // Show the playlist after clicking "Generate Playlist"
                playlistElement.classList.remove('hidden');
            });

            // Volume control
            const volumeControl = document.getElementById('volume');
            volumeControl.addEventListener('input', () => {
                musicPlayer.volume = volumeControl.value;
            });

            // Update the progress bar
            const progressBar = document.querySelector('.progress-bar');
            const progress = document.querySelector('.progress');

            musicPlayer.addEventListener('timeupdate', () => {
                const currentTime = musicPlayer.currentTime;
                const duration = musicPlayer.duration;
                const progressPercent = (currentTime / duration) * 100;
                progress.style.width = progressPercent + '%';
            });
        });
    </script>
</body>
</html>`;

module.exports = html;
