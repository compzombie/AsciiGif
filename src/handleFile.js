// Function to handle the dropped GIF file

import { parseGIF, decompressFrames } from 'gifuct-js';

import { playAsciiGif } from './playAsciiGif';

export async function handleFile(file) {
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