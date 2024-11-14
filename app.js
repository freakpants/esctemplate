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

    // Clear canvas and set background color
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#712775';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load thumbnails
    const thumbnail1 = new Image();
    const thumbnail2 = new Image();
    thumbnail1.src = song1.snippet.thumbnails.maxres.url;
    thumbnail2.src = song2.snippet.thumbnails.maxres.url;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const labelWidth = canvasWidth / 2;
    const thumbnailWidth = canvasWidth / 2;
    const thumbnailHeight = canvasHeight / 2;

    // Draw text labels centered within their quarters
    function drawCenteredText(text, x, y, width, height) {
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate center point within the given area
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        ctx.fillText(text, centerX, centerY);
    }

    // Draw the text blocks
    drawCenteredText('Who I want to win:', 0, 0, labelWidth, canvasHeight / 2);
    drawCenteredText('Who I think will win:', 0, canvasHeight / 2, labelWidth, canvasHeight / 2);

    // Function to draw the thumbnails with preserved aspect ratio and alignment
    function drawThumbnail(image, x, y, maxWidth, maxHeight) {
        const aspectRatio = image.width / image.height;
        let drawWidth = maxWidth;
        let drawHeight = maxHeight;

        if (aspectRatio > 1) { // Landscape orientation
            drawWidth = maxHeight * aspectRatio;
        } else { // Portrait orientation
            drawHeight = maxWidth / aspectRatio;
        }

        if (drawWidth > maxWidth) {
            drawWidth = maxWidth;
            drawHeight = drawWidth / aspectRatio;
        }

        if (drawHeight > maxHeight) {
            drawHeight = maxHeight;
            drawWidth = drawHeight * aspectRatio;
        }

        const drawX = x + (maxWidth - drawWidth);
        const drawY = y + (maxHeight - drawHeight) / 2;

        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    }

    // Draw thumbnails when loaded
    thumbnail1.onload = () => {
        thumbnail2.onload = () => {
            // Draw first thumbnail aligned to the right edge
            drawThumbnail(thumbnail1, labelWidth, 0, thumbnailWidth, thumbnailHeight);
            // Draw second thumbnail aligned to the right edge
            drawThumbnail(thumbnail2, labelWidth, thumbnailHeight, thumbnailWidth, thumbnailHeight);

            // Show the share button
            const shareBtn = document.getElementById('shareBtn');
            shareBtn.hidden = false;
        };
    };
}

document.addEventListener('DOMContentLoaded', loadSongs);
