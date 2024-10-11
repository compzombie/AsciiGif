import { handleFile } from './handleFile';

export function dropZoneListeners(dropZone) {
    // Drop zone event listener to change styling when a file is dragged over it
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault(); // Prevent default behavior to allow drop
        dropZone.style.backgroundColor = '#333'; // Change background to indicate active drop zone
    });

    // Drop zone event listener to revert styling when the dragged file leaves the drop zone
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = ''; // Reset background color
    });

    // Drop event listener to handle file dropping
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.style.backgroundColor = ''; // Reset background color
        const file = event.dataTransfer.files[0]; // Get the dropped file
        // Check if the dropped file is a GIF
        if (file && file.type.startsWith('image/gif')) {
            handleFile(file); // Call function to handle GIF file
            dropZone.style.visibility = "hidden";
        } else {
            alert('Please drop a GIF file.'); // Alert if file is not a GIF
        }
    });

    // Function to handle reading GIF link from clipboard
    async function handleClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.endsWith('.gif')) {
                const corsProxy = 'https://proxy.cors.sh/';
                const decodedUrl = decodeURIComponent(text);
                const proxyUrl = corsProxy + decodedUrl;
                console.log('Proxy URL:', proxyUrl); // Log the proxy URL
                const response = await fetch(proxyUrl, {
                    headers: {
                        'x-cors-api-key': 'temp_da804e6fb5ac5913bf292de60827499f'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                if (blob.type.startsWith('image/gif')) {
                    handleFile(blob);
                    dropZone.style.visibility = "hidden";
                } else {
                    alert('Clipboard does not contain a valid GIF link.');
                }
            }
        } catch (error) {
            console.error('Error reading from clipboard:', error);
        }
    }

    // Event listener to handle click on drop zone to read GIF link from clipboard
    dropZone.addEventListener('click', handleClipboard);

    // Event listener to handle touch on drop zone to read GIF link from clipboard
    dropZone.addEventListener('touchend', (event) => {
        event.preventDefault();
        handleClipboard();
    });
}