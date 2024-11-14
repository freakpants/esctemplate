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

// Function to draw centered text within a specified area
function drawCenteredText(ctx, text, x, y, width, height) {
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.fillText(text, centerX, centerY);
}

// Function to draw thumbnails while preserving aspect ratio
function drawThumbnail(ctx, image, x, y, maxWidth, maxHeight) {
    const aspectRatio = image.width / image.height;
    let drawWidth = maxWidth;
    let drawHeight = maxHeight;

    if (aspectRatio > 1) {
        drawWidth = maxHeight * aspectRatio;
    } else {
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

// Function to generate the canvas image
function generateImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const song1Select = document.getElementById('song1');
    const song2Select = document.getElementById('song2');

    const song1Id = song1Select.value;
    const song2Id = song2Select.value;

    const song1 = songsData.find(song => song.snippet.resourceId.videoId === song1Id);
    const song2 = songsData.find(song => song.snippet.resourceId.videoId === song2Id);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#712775';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const labelWidth = canvasWidth / 2;
    const thumbnailWidth = canvasWidth / 2;
    const thumbnailHeight = canvasHeight / 2;

    drawCenteredText(ctx, 'Who I want to win:', 0, 0, labelWidth, canvasHeight / 2);
    drawCenteredText(ctx, 'Who I think will win:', 0, canvasHeight / 2, labelWidth, canvasHeight / 2);

    const thumbnail1 = new Image();
    const thumbnail2 = new Image();

    thumbnail1.src = song1.snippet.thumbnails.maxres.url;
    thumbnail2.src = song2.snippet.thumbnails.maxres.url;

    thumbnail1.onload = () => {
        thumbnail2.onload = () => {
            drawThumbnail(ctx, thumbnail1, labelWidth, 0, thumbnailWidth, thumbnailHeight);
            drawThumbnail(ctx, thumbnail2, labelWidth, thumbnailHeight, thumbnailWidth, thumbnailHeight);
            generateAltText(song1, song2);
        };
    };
}

// Function to generate alt text and display it below the canvas
function generateAltText(song1, song2) {
    const altText = `Who I want to win: ${song1.snippet.title}. Who I think will win: ${song2.snippet.title}.`;
    document.getElementById('altText').textContent = altText;
}

// Function to copy alt text to clipboard
function copyAltText() {
    const altText = document.getElementById('altText').textContent;
    navigator.clipboard.writeText(altText).then(() => {
        alert('Alt text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function downloadCanvasImage() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'montesong.png';
        link.click();

        // Clean up the URL object to free memory
        URL.revokeObjectURL(link.href);
    }, 'image/png');
}


document.addEventListener('DOMContentLoaded', loadSongs);
