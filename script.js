async function convertToMP3() {
    const url = document.getElementById('youtubeUrl').value;
    try {
        const response = await fetch(`/api/convert?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.success) {
            const videoTitle = data.videoTitle; // Assuming your API or service provides the video title
            const downloadUrl = data.downloadUrl;

            // Trigger download of the MP3 file with the video title as the file name
            downloadFile(downloadUrl, `${videoTitle}.mp3`);
        } else {
            alert('Conversion failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error converting video');
    }
}

function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
