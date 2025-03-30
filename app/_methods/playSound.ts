export const playSound = () => {
    // Create audio element
    const audio = new Audio('/sounds/beep.mp3');
    
    // Play the sound
    audio.play().catch(error => {
      console.log("Audio play failed:", error);
    });
  };