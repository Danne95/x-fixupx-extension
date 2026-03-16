// FixupX Link Copier - Popup Script
// Made by fromepicbrain

const toggle = document.getElementById('toggleSwitch');
const statusText = document.getElementById('statusText');

function updateUI(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled ? 'ON' : 'OFF';
  statusText.className = 'status-text ' + (enabled ? 'on' : 'off');
}

// Load current state
chrome.storage.sync.get(['enabled'], (result) => {
  const enabled = result.enabled !== undefined ? result.enabled : true;
  updateUI(enabled);
});

// Handle toggle changes
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled });
  updateUI(enabled);

  // Notify all X.com tabs
  chrome.tabs.query({ url: ['https://x.com/*', 'https://twitter.com/*'] }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE', enabled }).catch(() => {});
    });
  });
});
