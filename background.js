// Background service worker for Gemini Release Tracker

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Gemini Release Tracker installed');

    // Set initial data
    chrome.storage.local.set({
      lastFetch: 0,
      releases: []
    });
  } else if (details.reason === 'update') {
    console.log('Gemini Release Tracker updated');
  }
});

// Optional: Set up periodic updates (uncomment to enable)
// chrome.alarms.create('updateReleases', { periodInMinutes: 60 });

// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'updateReleases') {
//     updateReleasesData();
//   }
// });

// async function updateReleasesData() {
//   try {
//     // Fetch latest releases data
//     // This could be implemented to periodically check for updates
//     console.log('Checking for updates...');
//   } catch (error) {
//     console.error('Error updating releases:', error);
//   }
// }

// Handle messages from popup or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchReleases') {
    // Future: implement fetching logic here
    sendResponse({ success: true });
  }
  return true;
});
