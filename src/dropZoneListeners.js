import { handleFile } from './handleFile';

export function dropZoneListeners(dropZone) {

    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Function to trigger file input click
    const triggerFileInput = () => {
        fileInput.click();
    };

    // Event listener to open file picker when drop zone is clicked
    dropZone.addEventListener('click', triggerFileInput);

    // Event listener to open file picker when drop zone is touched (for mobile)
    dropZone.addEventListener('touchend', triggerFileInput);

    // Event listener to handle file selection from file picker
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/gif')) {
            handleFile(file);
            dropZone.style.visibility = "hidden";
        }
    });

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
}