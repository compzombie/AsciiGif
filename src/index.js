// src/index.js

// Import functions from gifuct-js for parsing and decompressing GIF files
import { parseGIF, decompressFrames } from 'gifuct-js';

// DOMContentLoaded event ensures that the HTML is fully loaded before running JavaScript code
// This helps in getting elements like 'drop-zone' and 'ascii-output' safely

document.addEventListener('DOMContentLoaded', () => {
  // Getting references to drop zone and ASCII output div
  const dropZone = document.getElementById('drop-zone');
  const asciiOutput = document.getElementById('ascii-output');

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
    } else {
      alert('Please drop a GIF file.'); // Alert if file is not a GIF
    }
  });

  // Function to handle the dropped GIF file
  // This function parses the GIF, decompresses frames, and converts them to ASCII
  async function handleFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer(); // Read the file as an ArrayBuffer
      
      // Step 1: Parse the GIF using parseGIF
      const gif = parseGIF(new Uint8Array(arrayBuffer)); // Parse the GIF data into a usable format

      // Step 2: Decompress frames using decompressFrames
      const frames = decompressFrames(gif, true); // Decompress all frames from the GIF

      // Step 3: Convert each frame to ASCII and store results
      const asciiFrames = [];
      for (let i = 0; i < frames.length; i++) {
        const asciiFrame = await frameToAscii(frames[i]); // Convert frame to ASCII
        asciiFrames.push(asciiFrame); // Store ASCII representation of each frame
      }

      // Step 4: Play the ASCII frames in a loop
      playAsciiGif(asciiFrames);
    } catch (error) {
      console.error('Error processing the GIF:', error); // Log errors to the console
    }
  }

  // Function to play ASCII frames in a loop to simulate the GIF animation
  function playAsciiGif(frames) {
    let currentFrame = 0;
    function displayNextFrame() {
      asciiOutput.textContent = frames[currentFrame]; // Display the current frame
      currentFrame = (currentFrame + 1) % frames.length; // Move to the next frame, loop back if needed
      setTimeout(displayNextFrame, 100); // Set delay between frames (100ms for 10 FPS)
    }
    displayNextFrame(); // Start the loop
  }

  // Function to convert a GIF frame to ASCII
  // This function draws the frame on a canvas, scales it down, and passes the pixel data to imageToAscii
  function frameToAscii(frame) {
    return new Promise((resolve) => {
      // Create a canvas to draw the GIF frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = frame.dims.width;
      canvas.height = frame.dims.height;
      // Put the frame image data onto the canvas
      const imageData = new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height);
      ctx.putImageData(imageData, 0, 0);

      // Create a second canvas to scale down the frame for ASCII conversion
      const scaledCanvas = document.createElement('canvas');
      const scaledCtx = scaledCanvas.getContext('2d');
      scaledCanvas.width = 100; // Set a fixed width to simplify the ASCII conversion
      scaledCanvas.height = (canvas.height / canvas.width) * 100; // Maintain the aspect ratio
      scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height); // Draw scaled frame onto the second canvas

      // Get the image data from the scaled canvas
      const scaledImageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
      resolve(imageToAscii(scaledImageData)); // Convert the scaled image data to ASCII
    });
  }

  // Function to convert image data to ASCII characters
  // This function maps pixel brightness to ASCII characters
  function imageToAscii(imageData) {
    const { data, width, height } = imageData;
    const asciiChars = " .:-=+*#%@"; // Define a set of ASCII characters from light to dark
    let ascii = "";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4; // Get the pixel's RGBA values (4 bytes per pixel)
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const brightness = (r + g + b) / 3; // Calculate average brightness
        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1)); // Map brightness to an ASCII character
        ascii += asciiChars[charIndex]; // Add the corresponding character to the ASCII string
      }
      ascii += "\n"; // Add a line break after each row of pixels
    }
    return ascii; // Return the final ASCII representation
  }
});