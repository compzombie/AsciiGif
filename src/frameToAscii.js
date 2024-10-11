
import { imageToAscii } from './imageToAscii';

// Function to convert a GIF frame to ASCII
  // This function draws the frame on a canvas, scales it down, and passes the pixel data to imageToAscii
  export function frameToAscii(frame) {
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