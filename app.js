let songsData = [];

// Fetch songs data from the JSON file and populate the dropdowns
async function loadSongs() {
    try {
        const response = await fetch('montesongs.json');
        const data = await response.json();
        songsData = data.items;

        const song1Select = document.getElementById('song1');
        const song2Select = document.getElementById('song2');

        songsData.forEach(song => {
            const option = document.createElement('option');
            const title = song.snippet.title;
            const videoId = song.snippet.resourceId.videoId;
            option.value = videoId;
            option.textContent = title;
            song1Select.appendChild(option.cloneNode(true));
            song2Select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

// Function to draw the selected songs and thumbnails on the canvas
async function generateImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const song1Select = document.getElementById('song1');
    const song2Select = document.getElementById('song2');

    const song1Id = song1Select.value;
    const song2Id = song2Select.value;

    const song1 = songsData.find(song => song.snippet.resourceId.videoId === song1Id);
    const song2 = songsData.find(song => song.snippet.resourceId.videoId === song2Id);

    // Clear canvas and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#712775';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw thumbnails
    const thumbnail1 = new Image();
    const thumbnail2 = new Image();

    thumbnail1.src = song1.snippet.thumbnails.maxres.url;
    thumbnail2.src = song2.snippet.thumbnails.maxres.url;

    // Load and draw the thumbnails on canvas
    thumbnail1.onload = () => {
        ctx.drawImage(thumbnail1, 50, 50, 500, 281); // Draw first thumbnail
        drawSecondThumbnail();
    };

    function drawSecondThumbnail() {
        thumbnail2.onload = () => {
            ctx.drawImage(thumbnail2, 50, 350, 500, 281); // Draw second thumbnail

            // Draw song titles below thumbnails
            ctx.font = '32px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText(`1. ${song1.snippet.title}`, 600, 200);
            ctx.fillText(`2. ${song2.snippet.title}`, 600, 500);

            // Show the share button
            const shareBtn = document.getElementById('shareBtn');
            shareBtn.hidden = false;
        };
    }
}

document.addEventListener('DOMContentLoaded', loadSongs);
