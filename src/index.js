// src/index.js

// Import functions from gifuct-js for parsing and decompressing GIF files
import { dropZoneListeners } from './dropZoneListeners';
import { handleFile } from './handleFile';
import { playAsciiGif } from './playAsciiGif';

// DOMContentLoaded event ensures that the HTML is fully loaded before running JavaScript code
// This helps in getting elements like 'drop-zone' and 'ascii-output' safely

document.addEventListener('DOMContentLoaded', () => {
  // Getting references to drop zone and ASCII output div

  const dropZone = document.getElementById('drop-zone');
  const asciiOutput = document.getElementById('ascii-output');

  dropZoneListeners(dropZone, handleFile, playAsciiGif);
});