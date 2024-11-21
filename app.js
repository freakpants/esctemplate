let songsData = [];

// Fetch songs data from the selected JSON file
async function loadSongs(contest = 'supernova') {
    try {
        const fileName = contest === 'montesongs' ? 'montesongs.json' : 'supernova.json';
        const response = await fetch(fileName);
        const data = await response.json();
        songsData = data.items;

        const song1Select = document.getElementById('song1');
        const song2Select = document.getElementById('song2');

        // Clear existing options
        song1Select.innerHTML = '';
        song2Select.innerHTML = '';

        // Populate dropdowns
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

// Function to load an image and return a Promise
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

// Function to generate the canvas image using local images
async function generateImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const song1Select = document.getElementById('song1');
    const song2Select = document.getElementById('song2');
    const contestSelector = document.getElementById('contestSelector');

    const song1Id = song1Select.value;
    const song2Id = song2Select.value;
    const selectedContest = contestSelector.value;

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

    try {
        // Load images using Promises
        const thumbnail1 = await loadImage(`images/${thumbnail1Filename}`);
        const thumbnail2 = await loadImage(`images/${thumbnail2Filename}`);

        if (selectedContest === 'supernova') {
            drawThumbnailWithText(ctx, thumbnail1, labelWidth, 0, thumbnailWidth, thumbnailHeight, song1.snippet.title);
            drawThumbnailWithText(ctx, thumbnail2, labelWidth, thumbnailHeight, thumbnailWidth, thumbnailHeight, song2.snippet.title);
        } else {
            drawThumbnail(ctx, thumbnail1, labelWidth, 0, thumbnailWidth, thumbnailHeight);
            drawThumbnail(ctx, thumbnail2, labelWidth, thumbnailHeight, thumbnailWidth, thumbnailHeight);
        }
        generateAltText(song1, song2);
    } catch (error) {
        console.error('Error loading images:', error);
    }
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

// Add contest selection logic
document.addEventListener('DOMContentLoaded', () => {
    const contestSelector = document.getElementById('contestSelector');
    contestSelector.addEventListener('change', (event) => {
        loadSongs(event.target.value);
    });

    // Load default contest songs
    loadSongs();
});

function drawThumbnailWithText(ctx, image, x, y, maxWidth, maxHeight, title) {
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

    // Draw the title on top of the image, ensuring text width matches image width
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';

    const textX = drawX + drawWidth / 2;
    const textY = drawY + drawHeight - 50; // Position near the bottom
    const maxTextWidth = drawWidth - 20; // Add padding to avoid edge clipping

    // Use canvas measureText to scale down font size if text exceeds width
    let fontSize = 36;
    ctx.font = `bold ${fontSize}px Arial`;
    while (ctx.measureText(title).width > maxTextWidth && fontSize > 10) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px Arial`;
    }

    ctx.strokeText(title, textX, textY); // Black border
    ctx.fillText(title, textX, textY);   // White text
}

