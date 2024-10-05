const audioPlayer = document.getElementById('audioPlayer');
const playlist = document.getElementById('playlist');
const nowPlaying = document.getElementById('nowPlaying');
const playPauseButton = document.getElementById('playPause');
const volumeControl = document.getElementById('volume');
const progressBar = document.getElementById('progressBar');
const searchInput = document.getElementById('search');
const addPlaylistButton = document.getElementById('addPlaylistBtn');
const viewPlaylistsButton = document.getElementById('viewPlaylistsBtn');
const playlistHeader = document.getElementById('playlistHeader');
const currentTimeDisplay = document.getElementById('currentTime'); // Element for current time
const durationDisplay = document.getElementById('durationTime'); // Element for total duration

let playlists = { 'Default': [] }; // Default playlist
let favorites = []; // Array for favorite songs
let currentPlaylist = 'Default';
let recentlyPlayed = [];
let currentSongIndex = 0;
let isPlaying = false;

// Sample songs for the default playlist
const songs = [
    { name: 'Fear', url: 'devara.mp3', image: 'fear.jpeg', artist: 'Artist 1', album: 'Album 1', genre: 'Pop' },
    { name: 'Pushpa Pushpa', url: 'pushparaj.mp3', image: 'pushpa.jpg', artist: 'Artist 2', album: 'Album 2', genre: 'Rock' },
    { name: 'Sooseki', url: 'rashmika.mp3', image: 'sooseki.jpg', artist: 'Artist 3', album: 'Album 3', genre: 'Classical' },
    { name: 'Tenu Sang Rakhna', url: 'tenusangrakhna.mp3', image: 'tenusang.webp', artist: 'Artist 4', album: 'Album 4', genre: 'Pop' },
    { name: 'Aaj Ki Raat', url: 'aajkiraat.mp3', image: 'aajkiraat.jpg', artist: 'Artist 5', album: 'Album 5', genre: '' },
    { name: 'Style', url: 'style.mp3', image: 'style.jpg', artist: 'Artist 6', album: 'Album 6', genre: 'Jazz' }
];

// Initialize playlists
playlists['Default'] = [...songs];

// DOM loaded handler
document.addEventListener('DOMContentLoaded', () => {
    loadPlaylist(playlists[currentPlaylist]);
    updatePlaylistHeader('Home');
    setActiveTab('allSongsTab');
});

// Load songs into the playlist
function loadPlaylist(songList) {
    playlist.innerHTML = ''; // Clear current playlist
    songList.forEach((song, index) => {
        const li = createPlaylistItem(song, index);
        playlist.appendChild(li);
    });
}

// Create each song item in the playlist
function createPlaylistItem(song, index) {
    const li = document.createElement('li');
    li.classList.add('playlist-item');

    const songImage = document.createElement('img');
    songImage.src = song.image;
    songImage.classList.add('song-image');

    const songDetails = document.createElement('div');
    songDetails.classList.add('song-details');

    songDetails.innerHTML = `
        <p class="song-name">${song.name}</p>
        <p class="song-artist">Artist: ${song.artist}</p>
        <p class="song-album">Album: ${song.album}</p>
        <p class="song-genre">Genre: ${song.genre}</p>
    `;

    const dropdown = createDropdownMenu(index, song);
    songDetails.appendChild(dropdown);
    
    li.appendChild(songImage);
    li.appendChild(songDetails);
    li.onclick = () => playSong(index);
    
    return li;
}

// Create dropdown menu for playlist options
function createDropdownMenu(index, song) {
    const dropdown = document.createElement('ul');
    dropdown.classList.add('dropdown-menu');
    dropdown.style.display = 'none'; // Initially hide the dropdown

    // Playlist options
    Object.keys(playlists).forEach(playlistName => {
        const addItem = document.createElement('li');
        addItem.textContent = `Add to ${playlistName}`;
        addItem.onclick = () => {
            addToPlaylist(playlistName, index);
            dropdown.style.display = 'none'; // Hide dropdown after selection
        };
        dropdown.appendChild(addItem);
    });

    // Add remove option
    const removeItem = document.createElement('li');
    removeItem.textContent = `Remove from ${currentPlaylist}`;
    removeItem.onclick = () => {
        removeFromPlaylist(index);
        dropdown.style.display = 'none'; // Hide dropdown after selection
    };
    dropdown.appendChild(removeItem);

    return dropdown;
}

// Add song to the selected playlist
function addToPlaylist(playlistName, index) {
    const songToAdd = playlists[currentPlaylist][index];
    if (!playlists[playlistName].some(song => song.name === songToAdd.name)) {
        playlists[playlistName].push({ ...songToAdd });
        alert(`"${songToAdd.name}" has been added to "${playlistName}"!`);
    } else {
        alert(`"${songToAdd.name}" is already in the "${playlistName}" playlist.`);
    }
}

// Remove song from the current playlist
function removeFromPlaylist(index) {
    const songToRemove = playlists[currentPlaylist][index];
    playlists[currentPlaylist] = playlists[currentPlaylist].filter((_, i) => i !== index);
    alert(`"${songToRemove.name}" has been removed from "${currentPlaylist}"!`);
    loadPlaylist(playlists[currentPlaylist]); // Refresh playlist display
}

// Home button click event
document.getElementById('homeBtn').onclick = () => {
    loadPlaylist(playlists[currentPlaylist]); // Load all songs from the current playlist
    updatePlaylistHeader('Home'); // Update the header to reflect current view
    setActiveTab('allSongsTab'); // Set active tab to All Songs
};

// Play the selected song and add to recently played
function playSong(index) {
    currentSongIndex = index;
    audioPlayer.src = playlists[currentPlaylist][currentSongIndex].url;
    audioPlayer.play();
    nowPlaying.textContent = `Now Playing : ${playlists[currentPlaylist][currentSongIndex].name}`;
    playPauseButton.textContent = '⏸';
    isPlaying = true;

    // Reset current time display
    currentTimeDisplay.textContent = '0:00'; // Reset current time

    // Add to recently played if not already present
    if (!recentlyPlayed.includes(playlists[currentPlaylist][currentSongIndex])) {
        recentlyPlayed.push(playlists[currentPlaylist][currentSongIndex]);
    }
}

// Format time in minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Play/Pause Toggle
playPauseButton.onclick = () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.textContent = '⏯';
    } else {
        audioPlayer.play();
        playPauseButton.textContent = '⏸';
    }
    isPlaying = !isPlaying;
};

// Next/Previous song functionality
document.getElementById('next').onclick = () => {
    currentSongIndex = (currentSongIndex + 1) % playlists[currentPlaylist].length;
    playSong(currentSongIndex);
};

document.getElementById('prev').onclick = () => {
    currentSongIndex = (currentSongIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length;
    playSong(currentSongIndex);
};

// Update progress bar and current time display as song plays
audioPlayer.ontimeupdate = () => {
    requestAnimationFrame(updateProgressBar);
};

function updateProgressBar() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime); // Update current time display
}

// Update duration display when metadata is loaded
audioPlayer.onloadedmetadata = () => {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
};

// Allow seeking through the song using the progress bar
progressBar.oninput = () => {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
};

// Adjust volume
volumeControl.oninput = () => {
    audioPlayer.volume = volumeControl.value;
};

// Search functionality to filter songs
searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    const filteredSongs = playlists[currentPlaylist].filter(song => song.name.toLowerCase().includes(query));
    loadPlaylist(filteredSongs);
};

// Handle category tab click events
document.getElementById('allSongsTab').onclick = () => {
    loadPlaylist(playlists[currentPlaylist]);
    updatePlaylistHeader('All songs');
    setActiveTab('allSongsTab');
};

document.getElementById('albumsTab').onclick = () => {
    const albumSongs = playlists[currentPlaylist].filter(song => song.album.toLowerCase() === 'album 1');
    loadPlaylist(albumSongs);
    updatePlaylistHeader('Albums');
    setActiveTab('albumsTab');
};

document.getElementById('artistsTab').onclick = () => {
    const artistSongs = playlists[currentPlaylist].filter(song => song.artist.toLowerCase() === 'artist 1');
    loadPlaylist(artistSongs);
    updatePlaylistHeader('Artists');
};

// Update the playlist header
function updatePlaylistHeader(headerText) {
    playlistHeader.textContent = headerText;
}

// Set the active tab visually
function setActiveTab(tabId) {
    ['allSongsTab', 'albumsTab', 'artistsTab'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Show recently played songs when the "Recently Played" button is clicked
document.getElementById('recentBtn').onclick = () => {
    if (recentlyPlayed.length > 0) {
        loadPlaylist(recentlyPlayed);
        updatePlaylistHeader('Recently Played');
        setActiveTab('recentTab');
    } else {
        alert('No recently played songs.');
    }
};

// Add new playlist functionality
// Playlist management buttons
addPlaylistButton.onclick = () => {
    const newPlaylistName = prompt('Enter new playlist name:');
    
    // Check if the playlist already exists
    if (newPlaylistName) {
        if (!playlists[newPlaylistName]) {
            playlists[newPlaylistName] = [];
            alert(`"${newPlaylistName}" playlist created!`);
        } else {
            alert(`"${newPlaylistName}" playlist already exists!`);
        }

        // Prompt user to enter song names to add to the playlist
        const songNamesInput = prompt('Enter song names to add (separate with commas):');
        if (songNamesInput) {
            const songNames = songNamesInput.split(',').map(name => name.trim());
            songNames.forEach(name => {
                const songIndex = playlists[currentPlaylist].findIndex(song => song.name.toLowerCase() === name.toLowerCase());
                if (songIndex !== -1) {
                    addToPlaylist(newPlaylistName, songIndex); // Add the song by index
                } else {
                    alert(`"${name}" not found in the current playlist.`);
                }
            });
            alert(`Songs added to "${newPlaylistName}" playlist!`);
        } else {
            alert('No songs were added to the playlist.');
        }
    } else {
        alert('Invalid playlist name.');
    }
};

// View playlists
viewPlaylistsButton.onclick = () => {
    const playlistNames = Object.keys(playlists).filter(name => name !== 'Default'); // Exclude 'Default' from the list
    const selectedPlaylistName = prompt(`Select a playlist to view:\n${playlistNames.join(', ')}`);
    
    if (selectedPlaylistName === 'Default') {
        alert('Invalid playlist name. Please try again.'); // Alert for "Default"
    } else if (selectedPlaylistName && playlists[selectedPlaylistName]) {
        loadPlaylist(playlists[selectedPlaylistName]);
        updatePlaylistHeader(selectedPlaylistName);
        setActiveTab('allSongsTab'); // or set a specific tab if needed
    } else {
        alert('Invalid playlist name. Please try again.');
    }
};

// Keyboard event listener for space bar, arrow keys, and volume control
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
        togglePlayPause();
    } else if (event.code === 'ArrowLeft') {
        skipToPreviousSong();
    } else if (event.code === 'ArrowRight') {
        skipToNextSong();
    } else if (event.code === 'ArrowUp') {
        increaseVolume();
    } else if (event.code === 'ArrowDown') {
        decreaseVolume();
    }
});

// Play/pause toggle function for keyboard event
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.textContent = '⏯';
    } else {
        audioPlayer.play();
        playPauseButton.textContent = '⏸';
    }
    isPlaying = !isPlaying;
}

// Skip to previous song for left arrow key
function skipToPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length;
    playSong(currentSongIndex);
}

// Skip to next song for right arrow key
function skipToNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlists[currentPlaylist].length;
    playSong(currentSongIndex);
}

// Increase volume (ArrowUp)
function increaseVolume() {
    if (audioPlayer.volume < 1) {
        audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1); // Increase volume by 0.1
    }
    volumeControl.value = audioPlayer.volume; // Sync volume slider
}

// Decrease volume (ArrowDown)
function decreaseVolume() {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0); // Decrease volume by 0.1
    }
    volumeControl.value = audioPlayer.volume; // Sync volume slider
}
