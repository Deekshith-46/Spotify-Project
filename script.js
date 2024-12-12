
let playlist = "https://allsongs.onrender.com/playlist";
let options1 = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
};

let tracklist = "https://allsongs.onrender.com/track";
let options2 = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
};

let albumlist = "https://allsongs.onrender.com/album";
let options3 = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
};

let allsongs = "https://completesongs.onrender.com/allsongs";
let options5 = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
}

let artistlist = "https://allsongs.onrender.com/artist";
let options4 = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
}

// Create a global audio object to handle song playback
let currentSong = new Audio();
let isPlaying = false;  // Track playback state
let playPauseBtn = document.getElementById("playPauseBtn");
let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let songIndex = 0;
let songsData = []; // Store playlist data
let trackData = []; // Store tracklist data
let isPlayingFromPlaylist = true; // Flag to track song source
let spotifyPlaylist = document.getElementById("spotifyPlaylist")
let albumSongList = document.getElementById("albumSongList")
let mid = document.getElementById("mid");
let gradientInterval;

document.addEventListener("DOMContentLoaded", () => {
    Playlist(playlist, options1);
    TrackEvent(tracklist, options2);
    AlbumEvent(albumlist, options3);
    ArtistEvent(artistlist, options4);
    loadallsongs(allsongs, options5);
    playPauseBtn.addEventListener("click", togglePlayPause);
    nextBtn.addEventListener("click", playNextSong);
    prevBtn.addEventListener("click", playPreviousSong);
    // document.getElementById('yourElementId').innerHTML = 'Some Content';
});

async function Playlist(playlist, options1) {
    try {
        let response = await fetch(playlist, options1);
        let data = await response.json();
        localStorage.setItem("playtrack", JSON.stringify(data));
        let playlistStoredData = JSON.parse(localStorage.getItem("playtrack"));
        console.log(playlistStoredData);
        songsData = playlistStoredData; // Store playlist data

        displaySong(songIndex);
        let cardContainer = document.getElementById("cardContainer");
        cardContainer.innerHTML = ""; // Clear previous cards
        playlistStoredData.forEach((element, index) => {
            let cardEmpty = document.createElement("div");
            cardEmpty.innerHTML = `<div class="cardItem mt-2" id="cardItem">
                                    <div class="play" id="startmusic">
                                        <i id="playicon" class="fa-duotone fa-solid fa-play" style="background-color: rgb(42, 248, 42); padding: 16px; color: black; border-radius: 50%; cursor: pointer;"></i>
                                    </div>
                                    <img src=${element['image']} alt="">
                                    <h2>${element['songname']}</h2>
                                    <p><b> - <span>${element['name']}</span></b></p>
                                    <p>${element['description']}</p>
                                </div>`;
            cardContainer.appendChild(cardEmpty);

            // Attach an event listener to each song
            let playButton = cardEmpty.querySelector(".play i");
            playButton.addEventListener("click", () => playSongAtIndex(index, true)); // Set source as playlist
        });
    } catch (error) {
        console.error("Failed to load playlist:", error); // Log the error
    }
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`
}

function displaySong(index) {
    if (songsData.length > 0) {
        updateSongInfo(songsData[index]); // Update song info based on the index
    }
}

function playSongAtIndex(index) {

    songIndex = index;
    if (songsData[songIndex] && songsData[songIndex].audio_url) {
        playSongs(songsData[songIndex].audio_url);
        updateSongInfo(songsData[songIndex]);
    } else {
        console.error("Audio URL not found for this song index.");
    }
}

function togglePlayPause() {
    if (isPlaying) {
        currentSong.pause();
        stopGradientChange();

    } else {
        currentSong.play();
        startGradientChange();

    }
    isPlaying = !isPlaying;
    updatePlayPauseIcon();
}

// Function to generate a random color in hex format
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let colorValue = Math.floor(Math.random() * 128) + 128; // Ensure values are in the light range (128-255)
        color += colorValue.toString(16).padStart(2, '0');
    }
    return color;
}

// Function to apply a random gradient to the background
function applyRandomGradient() {
    let color1 = getRandomColor();
    let color2 = getRandomColor();
    mid.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
}

// Function to start the color change when the song is playing
function startGradientChange() {
    gradientInterval = setInterval(applyRandomGradient, 1000); // change every 1 second
}

// Function to stop the color change when the song is paused
function stopGradientChange() {
    clearInterval(gradientInterval);
}


function updatePlayPauseIcon() {
    // Update the icon based on whether the song is playing or paused
    playPauseBtn.innerHTML = isPlaying
        ? `<i class="fa-solid fa-pause" style="font-size:1.5rem; padding: 10px;"></i>`
        : `<i class="fa-solid fa-play" style="font-size:1.5rem; padding: 10px;"></i>`;
}

async function playSongs(songUrl) {
    try {
        if (currentSong.src !== songUrl) {
            currentSong.src = songUrl;
            await currentSong.load(); // Load the new source
        }
        currentSong.play();
        isPlaying = true;
        updatePlayPauseIcon();
    } catch (error) {
        console.error("Playback failed:", error); // Log playback errors
    }
}
function playNextSong() {
    songIndex = (songIndex + 1) % (isPlayingFromPlaylist ? songsData.length : trackData.length);
    let songData = isPlayingFromPlaylist ? songsData : trackData;
    playSongAtIndex(songIndex, isPlayingFromPlaylist);
}

function playPreviousSong() {
    songIndex = (songIndex - 1 + (isPlayingFromPlaylist ? songsData.length : trackData.length)) %
        (isPlayingFromPlaylist ? songsData.length : trackData.length);
    let songData = isPlayingFromPlaylist ? songsData : trackData;
    playSongAtIndex(songIndex, isPlayingFromPlaylist);
}

function updateSongInfo(song) {
    document.getElementById("songImage").src = song.image;
    document.getElementById("songName").textContent = song.songname;
    document.getElementById("songName1").textContent = song.songname;
    document.getElementById("artistName").textContent = song.name;
}

//listen for time update event 
currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".song-timer").innerHTML = `
    ${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    // document.querySelector(".progress-bar").style=left= (currentSong.currentTime/currentSong.duration) * 100 +"%"
})


//add an event listener to progress-area(or) seekbar
document.querySelector(".progress-area").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
})


async function TrackEvent(tracklist, options2) {
    try {
        let response = await fetch(tracklist, options2);
        let data = await response.json();
        localStorage.setItem("tracklist", JSON.stringify(data));
        let tracklistStoredData = JSON.parse(localStorage.getItem("tracklist"));
        console.log(tracklistStoredData);

        let trackContainer = document.getElementById("trackContainer");
        trackContainer.innerHTML = ""; // Clear previous tracks
        tracklistStoredData.forEach((element, index) => {
            let trackEmpty = document.createElement("div");
            trackEmpty.innerHTML = `<div class="trackItem mt-2" id="cardItem">
                                    <div class="play">
                                        <i class="fa-duotone fa-solid fa-play" style="background-color: rgb(42, 248, 42); padding: 16px; color: black; border-radius: 50%; cursor: pointer;"></i>
                                    </div>
                                    <img class="track-image" src="${element['image']}" alt="">
                                    <h2>${element['songname']}</h2>
                                    <p>${element['name']}</p>
                                    <p>${element['description']}</p>
                                </div>`;
            trackContainer.appendChild(trackEmpty);

            // Add click event to play button
            let playButton = trackEmpty.querySelector(".play i");
            playButton.addEventListener("click", () => {
                currentSong.src = element.audio_url; // Use the audio URL from the track data
                currentSong.play();
                isPlaying = true;
                updateSongInfo(element);
                updatePlayPauseIcon();

            });
        });
    } catch (error) {
        console.error("Failed to load tracklist:", error); // Log tracklist loading errors
    }
}

async function AlbumEvent(albumlist, options3) {
    try {
        let response = await fetch(albumlist, options3);
        let data = await response.json();
        localStorage.setItem("albumlist", JSON.stringify(data));
        let albumlistStoredData = JSON.parse(localStorage.getItem("albumlist"));
        console.log(albumlistStoredData);

        let albumContainer = document.getElementById("albumContainer");
        albumContainer.innerHTML = ""; // Clear previous tracks
        albumlistStoredData.forEach((element, index) => {
            let albumEmpty = document.createElement("div");
            albumEmpty.innerHTML = `<div class="albumItem mt-2" id="cardItem">
                                    <div class="play">
                                        <i class="fa-duotone fa-solid fa-play" style="background-color: rgb(42, 248, 42); padding: 16px; color: black; border-radius: 50%; cursor: pointer;"></i>
                                    </div>
                                    <img class="track-image" src="${element['image']}" alt="">
                                    <h2>${element['albumname']}</h2>
                                    <p>${element['description']}</p>
                                </div>`;
            albumContainer.appendChild(albumEmpty);

            // Add click event to play button
            let playButton = albumEmpty.querySelector(".play i");
            playButton.addEventListener("click", () => {
                spotifyPlaylist.style.display = "none";
                albumSongList.style.display = "block";
                let banner = document.getElementById("banner")
                banner.style.backgroundImage = `url(${element['image']})`;

                let song_list = document.getElementById("song-list");
                let currentPlayingSong = null;
                song_list.innerHTML = ""; // Clear previous songs

                // Ensure 'songs' is an array
                let albumSongContainer = element['songs'] || [];
                if (albumSongContainer.length === 0) {
                    console.warn(`No songs found for album: ${element['albumname']}`);
                }

                albumSongContainer.forEach((song) => {
                    let songItem = document.createElement("li");
                    songItem.classList.add("song-item");

                    songItem.innerHTML = `
                        <img src="${song['image']}" alt="Song Thumbnail">
                        <div class="song-info">
                            <div class="song-title">${song['songname']}</div>
                        </div>
                        <div class="play-icon"><i class="fa-solid fa-play"></i></div>`;

                    // Attach click event to play icon
                    let playIcon = songItem.querySelector(".play-icon");
                    playIcon.addEventListener("click", () => {

                        if (currentPlayingSong === song) {
                            if (playIcon.innerHTML.includes("fa-play")) {
                                playIcon.innerHTML = '<i class="fa-solid fa-pause"></i>';
                                playSongs(song.audio_url); // Start playing the song
                            } else {
                                playIcon.innerHTML = '<i class="fa-solid fa-play"></i>';
                                pauseSongs(); // Pause the song
                            }
                        } else {
                            // Pause the currently playing song if any
                            if (currentPlayingSong) {
                                let previousIcon = document.querySelector(".play-icon-playing");
                                if (previousIcon) {
                                    previousIcon.innerHTML = '<i class="fa-solid fa-play"></i>';
                                    previousIcon.classList.remove("play-icon-playing");
                                }
                            }
                            // Set this song as the currently playing song
                            currentPlayingSong = song;
                            playIcon.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Set to pause icon
                            playIcon.classList.add("play-icon-playing"); // Add a class to track it
                            playSongs(song.audio_url); // Play the song based on the clicked icon
                            updateSongInfo(song);
                        }
                    });

                    song_list.appendChild(songItem);
                });

            });
        });
    } catch (error) {
        console.error("Failed to load tracklist:", error); // Log tracklist loading errors
    }
}

//left and right arrow
document.getElementById("left-icon").addEventListener("click", () => {
    spotifyPlaylist.style.display = "block";
    albumSongList.style.display = "none";
})
document.getElementById("right-icon").addEventListener("click", () => {
    spotifyPlaylist.style.display = "block";
})

async function ArtistEvent(artistlist, options4) {
    try {
        let response = await fetch(artistlist, options4);
        let data = await response.json();
        localStorage.setItem("artistlist", JSON.stringify(data));
        let artistlistStoredData = JSON.parse(localStorage.getItem("artistlist"));
        console.log(artistlistStoredData);

        let artistContainer = document.getElementById("artistContainer");
        artistContainer.innerHTML = ""; // Clear previous tracks
        artistlistStoredData.forEach((element, index) => {
            let artistEmpty = document.createElement("div");
            artistEmpty.innerHTML = `<div class="artistItem mt-2" id="cardItem">
                                    <div class="play">
                                        <i class="fa-duotone fa-solid fa-play" style="background-color: rgb(42, 248, 42); padding: 16px; color: black; border-radius: 50%; cursor: pointer;"></i>
                                    </div>
                                    <img class="track-image" src="${element['image']}" alt="">
                                    <h2>${element['songname']}</h2>
                                    <p>${element['name']}</p>
                                    <p>${element['description']}</p>
                                </div>`;
            artistContainer.appendChild(artistEmpty);

            // Add click event to play button
            let playButton = artistEmpty.querySelector(".play i");
            playButton.addEventListener("click", () => {
                currentSong.src = element.audio_url; // Use the audio URL from the track data
                currentSong.play();
                isPlaying = true;
                updateSongInfo(element);
                updatePlayPauseIcon();

            });
        });
    } catch (error) {
        console.error("Failed to load tracklist:", error); // Log tracklist loading errors
    }
}
currentSong.addEventListener("ended", () => {
    playNextSong();
});

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = '0'
})
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%"
})
//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to ", e.target.value)
    currentSong.volume = parseInt(e.target.value) / 100;
})

let songs = [];
let allsongsstore = [];
let searchBar = document.getElementById("searchBar");
let songCard = document.getElementById("songCard");


async function loadallsongs(allsongs, options5) {
    try {
        let response = await fetch(allsongs, options5);
        let data = await response.json();
        songs = data;

        localStorage.setItem("allsongs", JSON.stringify(data));
        let allsongstoreddata = JSON.parse(localStorage.getItem("allsongs"));
        allsongsstore = allsongstoreddata;
        console.log(allsongstoreddata);
        searchBar.addEventListener("keyup", () => {
            console.log(data);
            let query = searchBar.value.trim();
            console.log(query);

            if (query.length > 0) {
                filterAndDisplaySongs(query);
                document.querySelector("#spotifyPlaylist").style.display = "none";
            } else {
                songList.innerHTML = "";
                songCard.style.display = "none";
                document.querySelector("#spotifyPlaylist").style.display = "block";
            }
        })


    }
    catch {
        console.error("Failed to load allsongs:", error);
    }
}

let mulsonglist = document.getElementById("mulsonglist");
let songList = document.createElement("ul");
songList.className = "song-list";
// Function to filter and display the song list
function filterAndDisplaySongs(query) {
    let filteredSongs = songs.filter((song) =>
        song.songname.toLowerCase().includes(query.toLowerCase())
    );

    songList.innerHTML = "";
    if (filteredSongs.length === 0) {
        songList.innerHTML = "<li>No songs found</li>";
        return;
    }
    filteredSongs.forEach((song) => {
        let li = document.createElement("li");
        li.className = "listsongs"
        li.textContent = `${song.songname}`;
        li.dataset.id = song.id; // Store song ID for later use
        songList.appendChild(li);
        mulsonglist.appendChild(songList);
    });
}
// Function to display selected song in card format
function displaySongCard(songId) {
    let song = songs.find((song) => song.id == songId); // Find the song by ID
    if (!song) return;

    songCard.innerHTML = `
        <div class="artistItem mt-2" id="cardItem">
                                    <div class="play">
                                        <i id="playicon" class="fa-duotone fa-solid fa-play" style="background-color: rgb(42, 248, 42); padding: 16px; color: black; border-radius: 50%; cursor: pointer;"></i>
                                    </div>
                                    <img class="track-image" src="${song['image']}" alt="">
                                    <h2>${song['songname']}</h2>
                                    <p>${song['name']}</p>
                                    <p>${song['description']}</p>
                                </div>
    `;
    songCard.style.display = "block";
    document.querySelector("#playicon").addEventListener("click", () => {
        songs.forEach((element) => {
            currentSong.src = element.audio_url; // Use the audio URL from the track data
            currentSong.play();
            isPlaying = true;
            updateSongInfo(element);
            updatePlayPauseIcon();
        })


    })

}
// Event listener for song list
songList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        let songId = e.target.dataset.id;
        displaySongCard(songId);
    }
    mulsonglist.style.display = "none";
});
searchBar.addEventListener("click", () => {
    mulsonglist.style.display = "block";
    songCard.style.display = "none";
})


