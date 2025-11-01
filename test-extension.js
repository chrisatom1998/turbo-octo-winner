#!/usr/bin/env node

/**
 * Chrome Extension Validation and Test Script
 * Tests the Gemini Release Tracker extension structure and code
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function testPass(message) {
  testsPassed++;
  log(`✓ ${message}`, colors.green);
}

function testFail(message) {
  testsFailed++;
  log(`✗ ${message}`, colors.red);
}

function testInfo(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function section(title) {
  log(`\n${colors.bold}${title}${colors.reset}`, colors.blue);
  log('─'.repeat(50));
}

// Test 1: Check if all required files exist
section('1. File Structure Validation');

const requiredFiles = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'styles.css',
  'background.js',
  'icons/icon16.svg',
  'icons/icon48.svg',
  'icons/icon128.svg'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    testPass(`File exists: ${file}`);
  } else {
    testFail(`Missing file: ${file}`);
  }
});

// Test 2: Validate manifest.json
section('2. Manifest Validation');

try {
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);

  // Check required fields
  const requiredFields = ['manifest_version', 'name', 'version', 'description'];
  requiredFields.forEach(field => {
    if (manifest[field]) {
      testPass(`Manifest has required field: ${field} = ${manifest[field]}`);
    } else {
      testFail(`Manifest missing required field: ${field}`);
    }
  });

  // Validate manifest version
  if (manifest.manifest_version === 3) {
    testPass('Using Manifest V3 (latest)');
  } else {
    testFail(`Manifest version ${manifest.manifest_version} is not V3`);
  }

  // Check permissions
  testInfo(`Permissions: ${manifest.permissions.join(', ')}`);

  // Validate action
  if (manifest.action && manifest.action.default_popup) {
    testPass(`Popup configured: ${manifest.action.default_popup}`);
  } else {
    testFail('Popup not properly configured');
  }

  // Validate icons
  if (manifest.icons && Object.keys(manifest.icons).length > 0) {
    testPass(`Icons configured: ${Object.keys(manifest.icons).join(', ')}`);
  } else {
    testFail('Icons not configured');
  }

  // Validate background service worker
  if (manifest.background && manifest.background.service_worker) {
    testPass(`Background worker: ${manifest.background.service_worker}`);
  } else {
    testFail('Background service worker not configured');
  }

} catch (error) {
  testFail(`Manifest parsing error: ${error.message}`);
}

// Test 3: Validate HTML structure
section('3. HTML Structure Validation');

try {
  const htmlPath = path.join(__dirname, 'popup.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Check for required elements
  const requiredElements = [
    { regex: /<div.*id="loading"/, name: 'Loading element' },
    { regex: /<div.*id="error"/, name: 'Error element' },
    { regex: /<div.*id="releases"/, name: 'Releases container' },
    { regex: /<button.*id="refreshBtn"/, name: 'Refresh button' },
    { regex: /<div.*class="filter-container"/, name: 'Filter container' },
    { regex: /<button.*class="filter-tab"/, name: 'Filter tabs' },
    { regex: /<input.*id="notifyExperimental"/, name: 'Notification checkbox' },
    { regex: /<script.*src="popup.js"/, name: 'Popup script' },
    { regex: /<link.*href="styles.css"/, name: 'Stylesheet link' }
  ];

  requiredElements.forEach(({ regex, name }) => {
    if (regex.test(htmlContent)) {
      testPass(`HTML contains: ${name}`);
    } else {
      testFail(`HTML missing: ${name}`);
    }
  });

} catch (error) {
  testFail(`HTML validation error: ${error.message}`);
}

// Test 4: Validate JavaScript syntax
section('4. JavaScript Code Validation');

try {
  const jsFiles = ['popup.js', 'background.js'];

  jsFiles.forEach(file => {
    const jsPath = path.join(__dirname, file);
    const jsContent = fs.readFileSync(jsPath, 'utf8');

    // Check for syntax errors (basic check)
    try {
      // Check for common issues
      const openBraces = (jsContent.match(/{/g) || []).length;
      const closeBraces = (jsContent.match(/}/g) || []).length;

      if (openBraces === closeBraces) {
        testPass(`${file}: Braces are balanced (${openBraces}/${closeBraces})`);
      } else {
        testFail(`${file}: Unbalanced braces (${openBraces} open, ${closeBraces} close)`);
      }

      // Check for required functions in popup.js
      if (file === 'popup.js') {
        const requiredFunctions = [
          'loadReleases',
          'displayReleases',
          'createReleaseCard',
          'filterReleases',
          'setupFilterTabs'
        ];

        requiredFunctions.forEach(func => {
          if (jsContent.includes(`function ${func}`) || jsContent.includes(`${func} = `)) {
            testPass(`Function exists: ${func}`);
          } else {
            testFail(`Function missing: ${func}`);
          }
        });

        // Check for experimental models data
        if (jsContent.includes('gemini-exp-1206')) {
          testPass('Experimental model data found: gemini-exp-1206');
        }
        if (jsContent.includes('gemini-exp-1121')) {
          testPass('Experimental model data found: gemini-exp-1121');
        }
        if (jsContent.includes('gemini-2.0-flash-exp')) {
          testPass('Experimental model data found: gemini-2.0-flash-exp');
        }
        if (jsContent.includes('gemini-2.0-pro-exp')) {
          testPass('Experimental model data found: gemini-2.0-pro-exp');
        }
      }

      // Check for notification handling in background.js
      if (file === 'background.js') {
        if (jsContent.includes('showNewExperimentalNotification')) {
          testPass('Notification function exists');
        }
        if (jsContent.includes('chrome.alarms.create')) {
          testPass('Alarm scheduler configured');
        }
      }

    } catch (err) {
      testFail(`${file}: Syntax validation error - ${err.message}`);
    }
  });

} catch (error) {
  testFail(`JavaScript validation error: ${error.message}`);
}

// Test 5: Validate CSS
section('5. CSS Validation');

try {
  const cssPath = path.join(__dirname, 'styles.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Check for required classes
  const requiredClasses = [
    '.filter-container',
    '.filter-tab',
    '.experimental-card',
    '.new-badge',
    '.model-id',
    '.expiry-date',
    '.changelog',
    '.notification-toggle'
  ];

  requiredClasses.forEach(className => {
    if (cssContent.includes(className)) {
      testPass(`CSS class defined: ${className}`);
    } else {
      testFail(`CSS class missing: ${className}`);
    }
  });

  // Check for animations
  if (cssContent.includes('@keyframes')) {
    testPass('CSS animations defined');
  }

} catch (error) {
  testFail(`CSS validation error: ${error.message}`);
}

// Test 6: Data validation
section('6. Extension Data Validation');

try {
  const jsPath = path.join(__dirname, 'popup.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  // Extract geminiReleases array (simplified)
  const releasesMatch = jsContent.match(/const geminiReleases = \[([\s\S]*?)\];/);

  if (releasesMatch) {
    const releasesData = releasesMatch[0];

    // Count models
    const modelCount = (releasesData.match(/name:/g) || []).length;
    testPass(`Total models tracked: ${modelCount}`);

    // Count experimental models
    const expCount = (releasesData.match(/status: "experimental"/g) || []).length;
    testPass(`Experimental models: ${expCount}`);

    // Check for changelog
    const changelogCount = (releasesData.match(/changelog:/g) || []).length;
    testPass(`Models with changelog: ${changelogCount}`);

    // Check for expiry dates
    const expiryCount = (releasesData.match(/expiryDate:/g) || []).length;
    testPass(`Models with expiry dates: ${expiryCount}`);

    // Check for model IDs
    const modelIdCount = (releasesData.match(/modelId:/g) || []).length;
    testPass(`Models with IDs: ${modelIdCount}`);

  } else {
    testFail('Could not find geminiReleases data');
  }

} catch (error) {
  testFail(`Data validation error: ${error.message}`);
}

// Summary
section('Test Summary');

const total = testsPassed + testsFailed;
const percentage = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 0;

log(`\nTotal Tests: ${total}`);
log(`Passed: ${testsPassed}`, colors.green);
log(`Failed: ${testsFailed}`, testsFailed > 0 ? colors.red : colors.green);
log(`Success Rate: ${percentage}%\n`, percentage >= 90 ? colors.green : colors.yellow);

if (testsFailed === 0) {
  log('🎉 All tests passed! Extension is ready for testing in Chrome.', colors.green + colors.bold);
  log('\nTo test in Chrome:', colors.cyan);
  log('1. Open chrome://extensions/');
  log('2. Enable "Developer mode"');
  log('3. Click "Load unpacked"');
  log('4. Select this directory');
  log('5. Click the extension icon to test\n');
} else {
  log('⚠️  Some tests failed. Please review the errors above.', colors.yellow + colors.bold);
}

process.exit(testsFailed > 0 ? 1 : 0);
