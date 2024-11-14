async function loadSongs() {
    try {
        const response = await fetch('montesongs.json');
        const data = await response.json();
        const songs = data.items;
        const song1Select = document.getElementById('song1');
        const song2Select = document.getElementById('song2');

        songs.forEach(song => {
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

function generateImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const song1 = document.getElementById('song1').selectedOptions[0].text;
    const song2 = document.getElementById('song2').selectedOptions[0].text;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#712775';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Your Montesong Picks:', 20, 50);
    ctx.fillText(`1. ${song1}`, 20, 100);
    ctx.fillText(`2. ${song2}`, 20, 150);

    const shareBtn = document.getElementById('shareBtn');
    shareBtn.hidden = false;
}

document.addEventListener('DOMContentLoaded', loadSongs);
