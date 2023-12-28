document.addEventListener("DOMContentLoaded", function() {
    const folderSelect = document.getElementById("folder-select");
    const sweeperFolderSelect = document.getElementById("sweeper-folder-select");
    const mp3ListContainer = document.getElementById("mp3-list");
    const sweeperListContainer = document.getElementById("sweepers_mp3-list");
    const audioPlayer = document.getElementById("audio-player");
    const playButton = document.getElementById("play-button");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const mp3NameElement = document.getElementById("mp3-name");

    let mp3Files = []; // Store the list of MP3 files
    let sweeperFiles = []; // Store the list of sweeper MP3 files
    let currentTrackIndex = 0; // Index of the currently playing track
    let sweeperIndex = 0; // Index of the currently playing sweeper track

    // Function to list folders in the "Music" directory
    function listFolders() {
        fetch("list_folders.php")
            .then(response => response.json())
            .then(data => {
                folderSelect.innerHTML = "";
                data.forEach(folder => {
                    const option = document.createElement("option");
                    option.text = folder;
                    option.value = folder;
                    folderSelect.appendChild(option);
                });

                const defaultFolder = folderSelect.value;
                listMP3Files(defaultFolder);
            })
            .catch(error => {
                console.error("Error fetching folder data:", error);
            });
    }

    // Function to list folders in the "Sweepers" directory
    function listSweeperFolders() {
        fetch("list_sweeper_folders.php")
            .then(response => response.json())
            .then(data => {
                sweeperFolderSelect.innerHTML = "";
                data.forEach(folder => {
                    const option = document.createElement("option");
                    option.text = folder;
                    option.value = folder;
                    sweeperFolderSelect.appendChild(option);
                });

                const defaultSweeperFolder = sweeperFolderSelect.value;
                listSweeperFiles(defaultSweeperFolder);
            })
            .catch(error => {
                console.error("Error fetching sweeper folder data:", error);
            });
    }

    function listMP3Files(folderPath) {
        fetch("list_mp3_files.php?folder=" + encodeURIComponent(folderPath))
            .then(response => response.json())
            .then(data => {
                mp3Files = data;
                console.log("Fetched MP3 files:", mp3Files); // Log the fetched data for debugging
                currentTrackIndex = 0;
                updateMP3List();
                playTrack(); // Start playing the first song
            })
            .catch(error => {
                console.error("Error fetching MP3 data:", error);
            });
    }

    function listSweeperFiles(folderPath) {
		sweeperIndex = 0;
        fetch("list_mp3_sweepers_files.php?folder=" + encodeURIComponent(folderPath))
            .then(response => response.json())
            .then(data => {
                sweeperFiles = data;
                console.log("Sweeper Files:", sweeperFiles);
                updateMP3SweeperList(); // Add this line to update the list in the HTML
            })
            .catch(error => {
                console.error("Error fetching sweeper MP3 data:", error);
            });
    }

    // Function to play the current track
    function playTrack() {
        let mp3FilePath;

        // Determine the track type (Music or Sweeper)
        if (currentTrackIndex % 4 === 0) {
            // Play a sweeper track every 4th track
            //const sweeperFileIndex = Math.floor(currentTrackIndex / 2) % sweeperFiles.length;
            //mp3FilePath = sweeperFiles[sweeperFileIndex].path;
            //sweeperIndex = sweeperFileIndex; // Update the sweeper index
			// Check if we have sweeper tracks
			if (sweeperFiles.length > 0) {
				mp3FilePath = sweeperFiles[sweeperIndex].path;

				// Increment the sweeper index for the next track
				sweeperIndex++;

				// If we've reached the end of the sweeper tracks, start over
				if (sweeperIndex >= sweeperFiles.length) {
					sweeperIndex = 0;
				}		
			}
			
			
        } else {
            // Play a music track for the other tracks
            const musicIndex = currentTrackIndex % mp3Files.length;
            mp3FilePath = mp3Files[musicIndex].path;
			
        }

        // Set the audio source and preload
        audioPlayer.src = mp3FilePath;
        audioPlayer.preload = "auto";

        // Play the audio
        audioPlayer.play()
            .then(() => {
                // Update the displayed name
                updateMP3Name();

                // Increment the track index
                currentTrackIndex++;

                // Add an event listener to play the next track when the current one ends
                audioPlayer.addEventListener("ended", playTrack);
            })
            .catch(error => {
                console.error("Error playing audio:", error);
            });
    }
/*
    // Function to play the next track
    function playNextTrack() {
        if (currentTrackIndex >= mp3Files.length + sweeperFiles.length) {
            currentTrackIndex = 0;
        }
        playTrack(); // Play the next song in the shuffled playlist
    }
*/

	// Function to play the next track
	function playNextTrack() {
		if (currentTrackIndex >= mp3Files.length) {
			currentTrackIndex = 0;
			listMP3Files(folderSelect.value); // Call listMP3Files to refresh the MP3 files list
		}
		playTrack(); // Play the next song in the shuffled playlist
	}
	
	
	

    // Function to play the previous track
    function playPrevTrack() {
        currentTrackIndex--;
        if (currentTrackIndex < 0) {
            currentTrackIndex = mp3Files.length + sweeperFiles.length - 1;
        }
        playTrack();
    }

    // Function to update the list of MP3 files in the UI
    function updateMP3List() {
        mp3ListContainer.innerHTML = "";
        mp3Files.forEach((mp3, index) => {
            const mp3Element = document.createElement("div");
            mp3Element.classList.add("mp3-file");
            mp3Element.setAttribute("data-mp3-index", index);
            mp3Element.textContent = mp3.name;
            mp3ListContainer.appendChild(mp3Element);
        });
    }

    // Function to update the list of Sweeper MP3 files in the UI
    function updateMP3SweeperList() {
        sweeperListContainer.innerHTML = "";
        sweeperFiles.forEach((sweeper, index) => {
            const mp3SweeperElement = document.createElement("div");
            mp3SweeperElement.classList.add("mp3-file");
            mp3SweeperElement.setAttribute("data-mp3-index", index);
            mp3SweeperElement.textContent = sweeper.name;
            sweeperListContainer.appendChild(mp3SweeperElement);
        });
    }

function updateMP3Name() {
    console.log("currentTrackIndex:", currentTrackIndex);
    console.log("sweeperIndex: ", sweeperIndex);

    const currentAudioSrc = audioPlayer.currentSrc;
    
    if (currentAudioSrc) {
        const fileName = currentAudioSrc.split('/').pop(); // Get the file name from the URL
        const decodedFileName = decodeURIComponent(fileName); // Decode percent-encoded characters
        const fileNameWithoutExtension = decodedFileName.replace(/\.[^/.]+$/, ''); // Remove the file extension
        mp3NameElement.textContent = fileNameWithoutExtension;
    } else {
        mp3NameElement.textContent = "Select a Playlist ";
    }
}




    // Event listener for folder selection
    folderSelect.addEventListener("change", function(event) {
        const selectedFolder = folderSelect.value;
        listMP3Files(selectedFolder);
    });

    // Event listener for sweeper folder selection
    sweeperFolderSelect.addEventListener("change", function(event) {
        const selectedSweeperFolder = sweeperFolderSelect.value;
        listSweeperFiles(selectedSweeperFolder);
    });

    // Initially list folders in the "Music" directory
    listFolders();

    // Initially list folders in the "Sweepers" directory
    listSweeperFolders();

    // Event listener for "Play" button
    playButton.addEventListener("click", function() {
        playTrack();
    });

    // Event listener for "Next" button
    nextButton.addEventListener("click", function() {
        playNextTrack();
    });

    // Event listener for "Previous" button
    prevButton.addEventListener("click", function() {
        playPrevTrack();
    });
});
