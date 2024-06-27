// script.js

document.getElementById('downloadBtn').addEventListener('click', function() {
    const url = document.getElementById('youtubeUrl').value;
    if (isValidYouTubeUrl(url)) {
        document.getElementById('loading').style.display = 'block';
        downloadMp3(url);
    } else {
        document.getElementById('message').textContent = 'Please enter a valid YouTube URL.';
    }
});

document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('youtubeUrl').value = ''; // Clear the input field
    document.getElementById('message').textContent = ''; // Clear any error or success message
    document.getElementById('message').classList.remove('green'); // Remove green color from message
});

function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
}

function downloadMp3(url) {
    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(response => {
        document.getElementById('loading').style.display = 'none';
        if (response.ok) {
            document.getElementById('message').textContent = 'Download started!';
            document.getElementById('message').classList.add('green');
            return response.blob()
                .then(blob => {
                    const contentDisposition = response.headers.get('content-disposition');
                    let filename = 'audio.mp3'; // Default filename
                    if (contentDisposition) {
                        filename = contentDisposition.split('filename=')[1].trim();
                        // Remove surrounding double quotes if present
                        if (filename.startsWith('"') && filename.endsWith('"')) {
                            filename = filename.substring(1, filename.length - 1);
                        }
                    }
                    return { blob, filename };
                });
        } else {
            throw new Error('Error downloading MP3');
        }
    })
    .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Error: ' + error.message;
    });
}
