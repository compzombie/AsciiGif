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

    // Function to handle file selection from file picker
    async function handleFilePicker() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/gif';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/gif')) {
                handleFile(file); // Call function to handle GIF file
                dropZone.style.visibility = "hidden";
            } else {
                alert('Please select a GIF file.'); // Alert if file is not a GIF
            }
        };
        input.click();
    }

    // Event listener to handle click on drop zone to open file picker
    dropZone.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        handleFilePicker();
    });

    // Event listener to handle touch on drop zone to open file picker
    dropZone.addEventListener('touchend', (event) => {
        event.preventDefault(); // Prevent default behavior
        handleFilePicker();
    });
}