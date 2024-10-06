const musicPlayer = document.getElementById('music-player');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playlist = document.getElementById('playlist');
let tracks = [];
let currentTrack = 0;

loadPlaylist();  // Load playlist on page load

// Fetch the list of songs from the server
function loadPlaylist() {
    fetch('/api/songs')
        .then(response => response.json())
        .then(data => {
            playlist.innerHTML = '';  // Clear any existing items
            tracks = [];  // Reset the tracks array

            data.forEach((song, index) => {
                const listItem = document.createElement('li');
                listItem.setAttribute('data-src', song.path);  // Store the song path
                listItem.setAttribute('data-index', index);
                listItem.innerHTML = `<i class="fas fa-music"></i><span>${song.name}</span>`;
                playlist.appendChild(listItem);
                tracks.push(listItem);  // Add track to the tracks array
            });

            // Add event listener for selecting a track
            playlist.addEventListener('click', (e) => {
                const clickedTrack = e.target.closest('li[data-index]');
                if (clickedTrack) {
                    const trackIndex = parseInt(clickedTrack.getAttribute('data-index'));
                    currentTrack = trackIndex;
                    loadTrack(currentTrack);  // Load and play selected track
                }
            });
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
        });
}

// Load a specific track based on its index in the playlist
function loadTrack(trackIndex) {
    clearCurrentTrack();  // Clear any currently playing track
    if (tracks[trackIndex]) {
        tracks[trackIndex].classList.add('playing');
        const trackURL = tracks[trackIndex].getAttribute('data-src');  // Get the song URL
        console.log('Loading track URL:', trackURL);  // Debug log
        musicPlayer.src = trackURL;  // Set the audio source to the selected song
        musicPlayer.play().catch(error => {
            console.error('Error playing track:', error);
        });
    }
}

// Clear the 'playing' class from the current track
function clearCurrentTrack() {
    const currentPlaying = playlist.querySelector('.playing');
    if (currentPlaying) {
        currentPlaying.classList.remove('playing');
    }
}

// Event listeners for previous, next, and play/pause
prevBtn.addEventListener('click', () => {
    currentTrack--;
    if (currentTrack < 0) { currentTrack = tracks.length - 1; }
    loadTrack(currentTrack);
});

nextBtn.addEventListener('click', () => {
    currentTrack++;
    if (currentTrack >= tracks.length) { currentTrack = 0; }
    loadTrack(currentTrack);
});

playBtn.addEventListener('click', () => {
    if (musicPlayer.paused) {
        musicPlayer.play();
        playBtn.textContent = 'Pause';
    } else {
        musicPlayer.pause();
        playBtn.textContent = 'Play';
    }
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