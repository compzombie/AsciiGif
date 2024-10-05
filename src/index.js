// src/index.js
import { parseGIF, decompressFrames } from 'gifuct-js';

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const asciiOutput = document.getElementById('ascii-output');

  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#333';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '';
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '';
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/gif')) {
      handleFile(file);
    } else {
      alert('Please drop a GIF file.');
    }
  });

  async function handleFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Step 1: Parse the GIF using parseGIF
      const gif = parseGIF(new Uint8Array(arrayBuffer));

      // Step 2: Decompress frames using decompressFrames
      const frames = decompressFrames(gif, true);

      let ascii = "";
      for (let i = 0; i < frames.length; i++) {
        ascii += `Frame ${i + 1}:\n`;
        ascii += await frameToAscii(frames[i]);
        ascii += "\n\n";
      }
      asciiOutput.textContent = ascii;
    } catch (error) {
      console.error('Error processing the GIF:', error);
    }
  }

  function frameToAscii(frame) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = frame.dims.width;
      canvas.height = frame.dims.height;
      const imageData = new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height);
      ctx.putImageData(imageData, 0, 0);
      const scaledCanvas = document.createElement('canvas');
      const scaledCtx = scaledCanvas.getContext('2d');
      scaledCanvas.width = 100; // Resize for simplicity
      scaledCanvas.height = (canvas.height / canvas.width) * 100;
      scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      const scaledImageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
      resolve(imageToAscii(scaledImageData));
    });
  }

  function imageToAscii(imageData) {
    const { data, width, height } = imageData;
    const asciiChars = " .:-=+*#%@";
    let ascii = "";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
        ascii += asciiChars[charIndex];
      }
      ascii += "\n";
    }
    return ascii;
  }
});
