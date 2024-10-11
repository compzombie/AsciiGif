
// Function to play ASCII frames in a loop to simulate the GIF animation
export function playAsciiGif(frames) {
  const asciiOutput = document.getElementById('ascii-output');
  let currentFrame = 0;
  function displayNextFrame() {
    asciiOutput.textContent = frames[currentFrame]; // Display the current frame
    currentFrame = (currentFrame + 1) % frames.length; // Move to the next frame, loop back if needed
    setTimeout(displayNextFrame, 100); // Set delay between frames (100ms for 10 FPS)
  }
  displayNextFrame(); // Start the loop
}