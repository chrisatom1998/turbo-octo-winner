// Gemini model releases data
const geminiReleases = [
  {
    name: "Gemini 2.0 Flash Thinking",
    status: "available",
    releaseDate: "December 2024",
    description: "Advanced thinking model with enhanced reasoning capabilities. Uses explicit thinking process to solve complex problems with improved accuracy.",
    features: ["Advanced Reasoning", "Transparent Thinking", "Complex Problem Solving", "Multimodal"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/thinking-mode"
  },
  {
    name: "Gemini 2.0 Flash",
    status: "available",
    releaseDate: "December 2024",
    description: "Next-generation multimodal model with native tool use, multimodal live streaming API, and improved speed and quality.",
    features: ["Native Tool Use", "Multimodal Live API", "Spatial Understanding", "Image Generation"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/gemini-v2"
  },
  {
    name: "Gemini 1.5 Pro",
    status: "available",
    releaseDate: "May 2024",
    description: "Production-ready model with 2M token context window. Best for complex reasoning tasks and long-context understanding.",
    features: ["2M Context Window", "Complex Reasoning", "Code Generation", "Multimodal"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/gemini-v1_5"
  },
  {
    name: "Gemini 1.5 Flash",
    status: "available",
    releaseDate: "May 2024",
    description: "Fast and versatile multimodal model optimized for speed and efficiency with 1M token context window.",
    features: ["1M Context Window", "Fast Response", "Cost Efficient", "Multimodal"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/gemini-v1_5"
  },
  {
    name: "Gemini 1.5 Flash-8B",
    status: "available",
    releaseDate: "October 2024",
    description: "Smaller, faster model optimized for high-frequency tasks with excellent speed-to-intelligence ratio.",
    features: ["Ultra Fast", "Cost Effective", "High Volume Tasks", "Compact Size"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/gemini-v1_5"
  },
  // Experimental Models
  {
    name: "gemini-exp-1206",
    modelId: "gemini-exp-1206",
    status: "experimental",
    releaseDate: "December 6, 2024",
    expiryDate: "March 6, 2025",
    description: "Latest experimental model with enhanced reasoning and multimodal capabilities. Features improved code generation and complex problem solving.",
    features: ["Enhanced Reasoning", "Improved Coding", "Advanced Multimodal", "Extended Context"],
    changelog: [
      "Improved accuracy on complex reasoning tasks",
      "Better code generation for multiple languages",
      "Enhanced image understanding",
      "Experimental long-context support"
    ],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/experimental-models",
    isNew: true
  },
  {
    name: "gemini-exp-1121",
    modelId: "gemini-exp-1121",
    status: "experimental",
    releaseDate: "November 21, 2024",
    expiryDate: "February 21, 2025",
    description: "Experimental model focusing on multimodal understanding and spatial reasoning with improved performance on vision tasks.",
    features: ["Spatial Reasoning", "Vision Tasks", "Multimodal", "Fast Inference"],
    changelog: [
      "Enhanced spatial understanding",
      "Improved vision-language alignment",
      "Better performance on diagram understanding",
      "Faster inference times"
    ],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/experimental-models"
  },
  {
    name: "gemini-2.0-flash-exp",
    modelId: "gemini-2.0-flash-exp",
    status: "experimental",
    releaseDate: "December 2024",
    description: "Experimental version of Gemini 2.0 Flash with cutting-edge features being tested before stable release. Includes native tool calling improvements.",
    features: ["Native Tools", "Multimodal Live", "Experimental Features", "High Performance"],
    changelog: [
      "Testing improved tool calling accuracy",
      "Enhanced multimodal streaming",
      "Experimental function calling syntax",
      "Performance optimizations"
    ],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/experimental-models",
    isNew: true
  },
  {
    name: "gemini-2.0-pro-exp",
    modelId: "gemini-2.0-pro-exp",
    status: "experimental",
    releaseDate: "January 2025 (Testing)",
    description: "Experimental flagship model being tested for upcoming release. Features state-of-the-art reasoning and coding capabilities.",
    features: ["SOTA Reasoning", "Advanced Coding", "Large Context", "Multimodal Excellence"],
    changelog: [
      "Under active development",
      "Testing enhanced reasoning algorithms",
      "Experimental context window expansion",
      "Advanced code understanding"
    ],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/experimental-models",
    isNew: true
  },
  {
    name: "Gemini 2.0 Pro",
    status: "upcoming",
    releaseDate: "Q1 2025 (Expected)",
    description: "Next-generation flagship model expected to bring significant improvements in reasoning, coding, and multimodal understanding.",
    features: ["Enhanced Reasoning", "Advanced Coding", "Improved Multimodal", "Extended Context"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs"
  }
];

// DOM elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessageEl = document.getElementById('errorMessage');
const releasesEl = document.getElementById('releases');
const refreshBtn = document.getElementById('refreshBtn');
const retryBtn = document.getElementById('retryBtn');
const lastUpdatedEl = document.getElementById('lastUpdated');
const experimentalCountEl = document.getElementById('experimentalCount');
const notifyCheckbox = document.getElementById('notifyExperimental');

// State
let currentFilter = 'all';
let allReleases = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadReleases();
  loadLastUpdated();
  loadNotificationPreference();
  setupFilterTabs();

  refreshBtn.addEventListener('click', () => {
    refreshBtn.disabled = true;
    loadReleases();
    setTimeout(() => {
      refreshBtn.disabled = false;
    }, 2000);
  });

  retryBtn.addEventListener('click', loadReleases);

  notifyCheckbox.addEventListener('change', saveNotificationPreference);
});

// Setup filter tabs
function setupFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      filterReleases();
    });
  });
}

// Filter releases based on current filter
function filterReleases() {
  const filteredReleases = currentFilter === 'all'
    ? allReleases
    : allReleases.filter(r => r.status === currentFilter);

  displayReleases(filteredReleases);
}

// Load and save notification preference
async function loadNotificationPreference() {
  const result = await chrome.storage.local.get(['notifyExperimental']);
  if (result.notifyExperimental !== undefined) {
    notifyCheckbox.checked = result.notifyExperimental;
  }
}

async function saveNotificationPreference() {
  const enabled = notifyCheckbox.checked;
  await chrome.storage.local.set({ notifyExperimental: enabled });

  if (enabled) {
    // Request notification permission
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    // Send message to background script to enable monitoring
    chrome.runtime.sendMessage({
      action: 'enableNotifications',
      enabled: true
    });
  }
}

// Load releases from storage or use default data
async function loadReleases() {
  try {
    showLoading();

    // Try to fetch latest data from storage
    const result = await chrome.storage.local.get(['releases', 'lastFetch', 'knownExperimentalModels']);

    let releases = geminiReleases;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Use cached data if it's less than 1 hour old
    if (result.releases && result.lastFetch && (now - result.lastFetch < oneHour)) {
      releases = result.releases;
    } else {
      // Try to fetch fresh data
      try {
        const freshReleases = await fetchLatestReleases();
        if (freshReleases && freshReleases.length > 0) {
          releases = freshReleases;
        }
      } catch (e) {
        console.log('Using cached/default data:', e);
      }

      // Check for new experimental models
      const experimentalModels = releases.filter(r => r.status === 'experimental');
      const knownModels = result.knownExperimentalModels || [];
      const newModels = experimentalModels.filter(
        model => model.modelId && !knownModels.includes(model.modelId)
      );

      // Notify about new experimental models
      if (newModels.length > 0 && result.notifyExperimental) {
        chrome.runtime.sendMessage({
          action: 'notifyNewExperimental',
          models: newModels
        });
      }

      // Update known models
      const allKnownModels = experimentalModels
        .filter(m => m.modelId)
        .map(m => m.modelId);

      // Save to storage
      await chrome.storage.local.set({
        releases: releases,
        lastFetch: now,
        knownExperimentalModels: allKnownModels
      });
    }

    allReleases = releases;

    // Update experimental count
    const experimentalCount = releases.filter(r => r.status === 'experimental').length;
    experimentalCountEl.textContent = experimentalCount;

    filterReleases();
    updateLastUpdated();
    hideLoading();
  } catch (error) {
    console.error('Error loading releases:', error);
    showError('Failed to load releases. Please try again.');
  }
}

// Fetch latest releases (placeholder for future API integration)
async function fetchLatestReleases() {
  // This could be enhanced to scrape Google AI blog or docs
  // For now, return null to use default data
  return null;
}

// Display releases in the UI
function displayReleases(releases) {
  releasesEl.innerHTML = '';

  if (!releases || releases.length === 0) {
    releasesEl.innerHTML = `
      <div class="no-releases">
        <p>No releases found</p>
      </div>
    `;
    return;
  }

  // Sort releases: available first, then upcoming, then experimental
  const statusOrder = { available: 0, preview: 1, upcoming: 2, experimental: 3 };
  releases.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  releases.forEach((release, index) => {
    const card = createReleaseCard(release, index);
    releasesEl.appendChild(card);
  });
}

// Create a release card element
function createReleaseCard(release, index) {
  const card = document.createElement('div');
  card.className = 'release-card';
  if (release.status === 'experimental') {
    card.classList.add('experimental-card');
  }
  card.style.animationDelay = `${index * 0.05}s`;

  const statusClass = `status-${release.status}`;
  const statusText = release.status.charAt(0).toUpperCase() + release.status.slice(1);

  const featuresHTML = release.features
    .map(feature => `<span class="feature-tag">${feature}</span>`)
    .join('');

  // Build experimental-specific content
  let experimentalContent = '';
  if (release.status === 'experimental') {
    const newBadge = release.isNew ? '<span class="new-badge">NEW</span>' : '';
    const modelIdHTML = release.modelId ? `<div class="model-id">Model ID: <code>${release.modelId}</code></div>` : '';
    const expiryHTML = release.expiryDate ? `<div class="expiry-date">⏰ Expires: ${release.expiryDate}</div>` : '';

    let changelogHTML = '';
    if (release.changelog && release.changelog.length > 0) {
      const changelogItems = release.changelog
        .map(item => `<li>${item}</li>`)
        .join('');
      changelogHTML = `
        <div class="changelog">
          <div class="changelog-header">
            <strong>🔬 What's New:</strong>
          </div>
          <ul class="changelog-list">${changelogItems}</ul>
        </div>
      `;
    }

    experimentalContent = `
      ${newBadge}
      ${modelIdHTML}
      ${expiryHTML}
      ${changelogHTML}
    `;
  }

  card.innerHTML = `
    <div class="release-header">
      <div>
        <div class="model-name">${release.name}</div>
      </div>
      <span class="status-badge ${statusClass}">${statusText}</span>
    </div>
    <div class="release-date">${release.releaseDate}</div>
    ${experimentalContent}
    <div class="description">${release.description}</div>
    <div class="features">${featuresHTML}</div>
    <a href="${release.learnMoreUrl}" target="_blank" class="learn-more">
      Learn More →
    </a>
  `;

  return card;
}

// UI state management
function showLoading() {
  loadingEl.style.display = 'flex';
  errorEl.style.display = 'none';
  releasesEl.style.display = 'none';
}

function hideLoading() {
  loadingEl.style.display = 'none';
  releasesEl.style.display = 'block';
}

function showError(message) {
  loadingEl.style.display = 'none';
  releasesEl.style.display = 'none';
  errorEl.style.display = 'block';
  errorMessageEl.textContent = message;
}

// Update last updated timestamp
function updateLastUpdated() {
  const now = new Date();
  lastUpdatedEl.textContent = `Updated: ${now.toLocaleTimeString()}`;
  chrome.storage.local.set({ lastUpdated: now.toISOString() });
}

async function loadLastUpdated() {
  const result = await chrome.storage.local.get(['lastUpdated']);
  if (result.lastUpdated) {
    const date = new Date(result.lastUpdated);
    lastUpdatedEl.textContent = `Updated: ${date.toLocaleTimeString()}`;
  }
}
