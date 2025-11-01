# Testing Guide

This document explains how to test the Gemini Release Tracker Chrome extension.

## Quick Test

Run the automated test suite:

```bash
node test-extension.js
```

This will validate:
- ✅ File structure
- ✅ Manifest configuration
- ✅ HTML structure
- ✅ JavaScript code
- ✅ CSS styling
- ✅ Extension data

**Expected Result**: All 52 tests should pass

## UI Preview (No Chrome Required)

Open the standalone test page in any browser:

```bash
# Linux/Mac
open test-ui.html

# Windows
start test-ui.html

# Or use Python's built-in server
python3 -m http.server 8000
# Then visit: http://localhost:8000/test-ui.html
```

This page simulates the extension UI without requiring Chrome's extension APIs.

## Full Chrome Extension Test

### 1. Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the extension directory (`/home/user/turbo-octo-winner`)
5. The extension should appear in your extensions list

### 2. Test Core Features

#### Basic Functionality
- [ ] Click the extension icon in the toolbar
- [ ] Popup opens with Gemini Release Tracker interface
- [ ] All 10 models are displayed
- [ ] Model cards show: name, status, date, description, features
- [ ] "Learn More" links work

#### Filter Testing
- [ ] Click "All Models" tab - shows all 10 models
- [ ] Click "Experimental" tab - shows only 4 experimental models
- [ ] Click "Available" tab - shows 5 available models
- [ ] Click "Upcoming" tab - shows 1 upcoming model
- [ ] Experimental count badge shows "4"

#### Experimental Model Features
- [ ] Experimental cards have purple border
- [ ] "NEW" badges appear on 3 models
- [ ] Model IDs are displayed in code format
- [ ] Expiry dates shown on 2 models
- [ ] Changelog sections visible with bullet points
- [ ] Special gradient background on experimental cards

#### Notification Features
- [ ] Notification toggle checkbox is visible
- [ ] Checking the box requests notification permission
- [ ] Background script is active (check Service Worker in dev tools)

#### UI/UX
- [ ] Refresh button works (disable/re-enable after 2s)
- [ ] Last updated timestamp shows current time
- [ ] Cards have smooth hover effects
- [ ] Animations work (slide-in, pulse on NEW badge)
- [ ] Scrolling works smoothly
- [ ] Footer link works

### 3. Test Storage

Open Chrome DevTools:
1. Right-click the extension popup
2. Select "Inspect"
3. Go to "Application" tab
4. Find "Storage" > "Extension" > "Local Storage"
5. Verify stored data:
   - `releases` - Array of model data
   - `lastFetch` - Timestamp
   - `knownExperimentalModels` - Array of model IDs
   - `notifyExperimental` - Boolean

### 4. Test Background Script

1. Go to `chrome://extensions/`
2. Find "Gemini Release Tracker"
3. Click "Service Worker" under "Inspect views"
4. Check Console for:
   - "Gemini Release Tracker installed" (on first install)
   - Alarm registration
   - No errors

### 5. Test Notifications (if enabled)

1. Enable notifications in the popup
2. Wait for background check (hourly) OR
3. Simulate by clearing storage and refreshing
4. New experimental models should trigger notification
5. Click notification to open popup

## Performance Testing

### Load Time
- Initial popup open: Should be < 200ms
- Filter switching: Should be instant
- Card rendering: Should be smooth

### Memory Usage
1. Open Chrome Task Manager (Shift+Esc)
2. Find "Extension: Gemini Release Tracker"
3. Memory usage should be < 20MB
4. CPU should be minimal when idle

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Screen Reader
- [ ] Headings are properly structured
- [ ] Buttons have descriptive labels
- [ ] Status information is announced
- [ ] Links are descriptive

## Browser Console Testing

Open the popup and check console for:
- ✅ No errors
- ✅ No warnings
- ✅ Expected logs only
- ✅ No blocked resources

## Common Issues & Solutions

### Issue: Extension won't load
**Solution**:
- Check that all files are present
- Run `node test-extension.js` to validate
- Check manifest.json for errors

### Issue: Popup doesn't open
**Solution**:
- Check Service Worker for errors
- Reload the extension
- Check popup.html for syntax errors

### Issue: Filters don't work
**Solution**:
- Check browser console for JavaScript errors
- Verify popup.js loaded correctly

### Issue: Notifications not working
**Solution**:
- Grant notification permission
- Check that background.js is running
- Verify alarms permission in manifest

### Issue: Styling issues
**Solution**:
- Clear browser cache
- Check styles.css loaded
- Inspect elements in DevTools

## Test Checklist

### Pre-Flight
- [ ] All files present
- [ ] `node test-extension.js` passes
- [ ] No console errors in test-ui.html

### Installation
- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Service worker is active

### Core Features
- [ ] Popup opens and displays
- [ ] All 10 models visible
- [ ] Filters work correctly
- [ ] Experimental features visible

### Advanced Features
- [ ] Notification toggle works
- [ ] Storage persists data
- [ ] Background checks run
- [ ] Links open correctly

### Polish
- [ ] Animations smooth
- [ ] Hover effects work
- [ ] No visual glitches
- [ ] Responsive design works

## Automated Test Results

Last run: 2025-11-01

```
Total Tests: 52
Passed: 52
Failed: 0
Success Rate: 100.0%
```

## Test Environment

- **Node.js**: v22.20.0
- **npm**: 10.9.3
- **OS**: Linux 4.4.0
- **Chrome**: 88+ (Manifest V3 required)

## Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Chrome Notifications API](https://developer.chrome.com/docs/extensions/reference/notifications/)

## Reporting Issues

If you find any issues during testing:
1. Note the exact steps to reproduce
2. Include browser console output
3. Check TEST-REPORT.md for known limitations
4. Create detailed bug report

---

**Happy Testing!** 🎉
