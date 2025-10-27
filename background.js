// Background service worker for Gemini Release Tracker

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Gemini Release Tracker installed');

    // Set initial data
    chrome.storage.local.set({
      lastFetch: 0,
      releases: [],
      knownExperimentalModels: [],
      notifyExperimental: false
    });
  } else if (details.reason === 'update') {
    console.log('Gemini Release Tracker updated');
  }
});

// Set up periodic updates to check for new experimental models
chrome.alarms.create('checkExperimentalModels', {
  periodInMinutes: 60  // Check every hour
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkExperimentalModels') {
    checkForNewExperimentalModels();
  }
});

// Check for new experimental models
async function checkForNewExperimentalModels() {
  try {
    const result = await chrome.storage.local.get(['notifyExperimental']);

    // Only check if notifications are enabled
    if (!result.notifyExperimental) {
      return;
    }

    console.log('Checking for new experimental models...');

    // In a real implementation, this would fetch from an API
    // For now, we'll just log that we're checking
    // The actual checking happens in the popup when refreshed

  } catch (error) {
    console.error('Error checking for experimental models:', error);
  }
}

// Handle messages from popup or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchReleases') {
    // Future: implement fetching logic here
    sendResponse({ success: true });
  } else if (request.action === 'enableNotifications') {
    handleNotificationToggle(request.enabled);
    sendResponse({ success: true });
  } else if (request.action === 'notifyNewExperimental') {
    showNewExperimentalNotification(request.models);
    sendResponse({ success: true });
  }
  return true;
});

// Handle notification toggle
async function handleNotificationToggle(enabled) {
  await chrome.storage.local.set({ notifyExperimental: enabled });

  if (enabled) {
    console.log('Experimental model notifications enabled');
    // Immediately check for new models
    checkForNewExperimentalModels();
  } else {
    console.log('Experimental model notifications disabled');
  }
}

// Show notification for new experimental models
function showNewExperimentalNotification(models) {
  if (!models || models.length === 0) return;

  const title = models.length === 1
    ? 'New Experimental Gemini Model!'
    : `${models.length} New Experimental Gemini Models!`;

  const message = models.length === 1
    ? `${models[0].name} is now available for testing`
    : models.map(m => m.name).join(', ') + ' are now available';

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.svg',
    title: title,
    message: message,
    priority: 2,
    requireInteraction: false
  }, (notificationId) => {
    console.log('Notification shown:', notificationId);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      chrome.notifications.clear(notificationId);
    }, 10000);
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open the extension popup when notification is clicked
  chrome.action.openPopup();
});
