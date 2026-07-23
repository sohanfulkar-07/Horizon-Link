// Simple interaction logic for the UI placeholder
const startBtn = document.getElementById('startSharingBtn');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.querySelector('.status-indicator .text');
let isSharing = false;

startBtn.addEventListener('click', () => {
  isSharing = !isSharing;
  
  if (isSharing) {
    // Transition to streaming state
    startBtn.textContent = 'Stop Sharing';
    startBtn.classList.add('active');
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
    statusText.textContent = 'Connected & Streaming';
  } else {
    // Revert to idle state
    startBtn.textContent = 'Start Sharing';
    startBtn.classList.remove('active');
    statusIndicator.classList.remove('online');
    statusIndicator.classList.add('offline');
    statusText.textContent = 'Disconnected';
  }
});
