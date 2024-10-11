
// Function to convert image data to ASCII characters
// This function maps pixel brightness to ASCII characters
export function imageToAscii(imageData) {
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