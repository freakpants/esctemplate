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

// Function to extract the filename from the maxres URL
function extractFilenameFromUrl(url) {
    const parts = url.split('/');
    return `${parts[4]}.jpg`; // Extracts the video ID and appends .jpg
}

// Function to generate the canvas image using local images
function generateImage() {
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

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const labelWidth = canvasWidth / 2;
    const thumbnailWidth = canvasWidth / 2;
    const thumbnailHeight = canvasHeight / 2;

    drawCenteredText(ctx, 'Who I want to win:', 0, 0, labelWidth, canvasHeight / 2);
    drawCenteredText(ctx, 'Who I think will win:', 0, canvasHeight / 2, labelWidth, canvasHeight / 2);

    // Extract filenames for the local images
    const thumbnail1Filename = extractFilenameFromUrl(song1.snippet.thumbnails.maxres.url);
    const thumbnail2Filename = extractFilenameFromUrl(song2.snippet.thumbnails.maxres.url);

    // Load local images based on extracted filenames
    const thumbnail1 = new Image();
    const thumbnail2 = new Image();

    thumbnail1.src = `images/${thumbnail1Filename}`;
    thumbnail2.src = `images/${thumbnail2Filename}`;

    thumbnail1.onload = () => {
        thumbnail2.onload = () => {
            drawThumbnail(ctx, thumbnail1, labelWidth, 0, thumbnailWidth, thumbnailHeight);
            drawThumbnail(ctx, thumbnail2, labelWidth, thumbnailHeight, thumbnailWidth, thumbnailHeight);
            generateAltText(song1, song2);
        };
    };
}

// Function to draw centered text
function drawCenteredText(ctx, text, x, y, width, height) {
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.fillText(text, centerX, centerY);
}

// Function to draw thumbnails
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

// Function to generate alt text
function generateAltText(song1, song2) {
    const altText = `Who I want to win: ${song1.snippet.title}. Who I think will win: ${song2.snippet.title}.`;
    document.getElementById('altText').textContent = altText;
}


// Function to download the canvas image
function downloadCanvasImage() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'montesong.png';
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/png');
}


document.addEventListener('DOMContentLoaded', loadSongs);
