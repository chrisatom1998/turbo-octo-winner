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
  {
    name: "Gemini Experimental",
    status: "experimental",
    releaseDate: "Rolling Updates",
    description: "Experimental models with cutting-edge features. Updated regularly with latest capabilities and improvements.",
    features: ["Bleeding Edge", "Latest Features", "Frequent Updates", "Early Access"],
    learnMoreUrl: "https://ai.google.dev/gemini-api/docs/models/experimental-models"
  },
  {
    name: "Gemini 2.0 Pro",
    status: "upcoming",
    releaseDate: "Q1 2025 (Expected)",
    description: "Next-generation flagship model expected to bring significant improvements in reasoning, coding, and multimodal understanding.",
    features: ["Enhanced Reasoning", "Advanced Coding", "Improved Multimodal", "TBD"],
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadReleases();
  loadLastUpdated();

  refreshBtn.addEventListener('click', () => {
    refreshBtn.disabled = true;
    loadReleases();
    setTimeout(() => {
      refreshBtn.disabled = false;
    }, 2000);
  });

  retryBtn.addEventListener('click', loadReleases);
});

// Load releases from storage or use default data
async function loadReleases() {
  try {
    showLoading();

    // Try to fetch latest data from storage
    const result = await chrome.storage.local.get(['releases', 'lastFetch']);

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

      // Save to storage
      await chrome.storage.local.set({
        releases: releases,
        lastFetch: now
      });
    }

    displayReleases(releases);
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
  card.style.animationDelay = `${index * 0.05}s`;

  const statusClass = `status-${release.status}`;
  const statusText = release.status.charAt(0).toUpperCase() + release.status.slice(1);

  const featuresHTML = release.features
    .map(feature => `<span class="feature-tag">${feature}</span>`)
    .join('');

  card.innerHTML = `
    <div class="release-header">
      <div>
        <div class="model-name">${release.name}</div>
      </div>
      <span class="status-badge ${statusClass}">${statusText}</span>
    </div>
    <div class="release-date">${release.releaseDate}</div>
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
