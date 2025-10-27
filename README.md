# Gemini Release Tracker

A Chrome extension that lets you track upcoming and current Google Gemini AI model releases. Stay up-to-date with the latest Gemini models, their features, and availability status.

![Extension Preview](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Version](https://img.shields.io/badge/version-1.1.0-green)
![Experimental](https://img.shields.io/badge/Experimental_Models-4-purple)

## Features

- **Real-time Model Information**: View current and upcoming Gemini model releases
- **Experimental Model Tracking**: Dedicated tracking of experimental models with detailed changelog and expiry dates
- **Smart Filtering**: Filter models by status (All, Experimental, Available, Upcoming)
- **Detailed Model Cards**: See features, release dates, and status for each model
- **Experimental Model Details**:
  - Model IDs for API integration
  - Expiry dates for experimental models
  - Detailed changelog of improvements and features
  - "NEW" badges for recently released experimental models
- **Notification System**: Get notified when new experimental models are released
- **Clean UI**: Beautiful, modern interface with gradient background and smooth animations
- **Status Badges**: Quickly identify available, upcoming, experimental, and preview models
- **Direct Links**: Quick access to official documentation for each model
- **Smart Caching**: Efficient data caching to minimize unnecessary updates
- **One-Click Refresh**: Manually refresh the data whenever you want

## Models Tracked

### Available Models
- **Gemini 2.0 Flash Thinking** - Advanced reasoning with transparent thinking process
- **Gemini 2.0 Flash** - Next-gen multimodal with native tool use
- **Gemini 1.5 Pro** - Production model with 2M token context window
- **Gemini 1.5 Flash** - Fast and versatile with 1M token context
- **Gemini 1.5 Flash-8B** - Ultra-fast compact model

### Experimental Models
- **gemini-exp-1206** - Latest experimental with enhanced reasoning (Expires: March 6, 2025)
- **gemini-exp-1121** - Spatial reasoning and vision tasks (Expires: February 21, 2025)
- **gemini-2.0-flash-exp** - Experimental Gemini 2.0 Flash with cutting-edge features
- **gemini-2.0-pro-exp** - Experimental flagship model (Testing phase)

### Upcoming Models
- **Gemini 2.0 Pro** - Next-generation flagship (Expected Q1 2025)

## Installation

### Option 1: Load Unpacked (Development)

1. **Clone or Download** this repository:
   ```bash
   git clone <repository-url>
   cd turbo-octo-winner
   ```

2. **Generate Icons** (Optional - SVG icons are already included):
   ```bash
   node generate-icons.js
   ```

   Or open `icon-generator.html` in your browser to generate PNG icons.

3. **Open Chrome Extensions**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

4. **Load the Extension**:
   - Click "Load unpacked"
   - Select the extension directory
   - The extension icon should appear in your toolbar

5. **Pin the Extension** (Optional):
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Gemini Release Tracker"
   - Click the pin icon to keep it visible

### Option 2: Chrome Web Store (Coming Soon)

The extension will be published to the Chrome Web Store for easier installation.

## Usage

1. **Open the Extension**:
   - Click the Gemini Release Tracker icon in your Chrome toolbar
   - The popup will display all tracked Gemini models

2. **Filter Models**:
   - Use the filter tabs to view specific model types:
     - **All Models**: View all tracked models
     - **Experimental**: See only experimental models being tested
     - **Available**: Production-ready models
     - **Upcoming**: Models planned for future release

3. **View Model Details**:
   - Each card shows the model name, status, release date, description, and key features
   - Status badges indicate: Available, Upcoming, Experimental, or Preview
   - Experimental models display additional information:
     - Model ID for API usage
     - Expiry date (when the experimental model will be retired)
     - Detailed changelog of features and improvements
     - "NEW" badge for recently added models

4. **Enable Notifications**:
   - Check "Notify on new experimental models" to get alerts
   - Chrome will notify you when new experimental models are released
   - Click notification to open the extension

5. **Learn More**:
   - Click "Learn More →" on any model card to visit official documentation

6. **Refresh Data**:
   - Click the "Refresh" button to update the model information
   - Data is automatically cached for one hour
   - Experimental models are checked hourly for updates

## Development

### Project Structure

```
turbo-octo-winner/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI
├── popup.js              # UI logic and data management
├── styles.css            # Styling
├── background.js         # Background service worker
├── generate-icons.js     # Icon generator script
├── icon-generator.html   # Browser-based icon generator
├── icons/               # Extension icons
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md            # This file
```

### Customization

#### Adding New Models

Edit `popup.js` and add new model entries to the `geminiReleases` array:

```javascript
{
  name: "Model Name",
  status: "available|upcoming|preview|experimental",
  releaseDate: "Month Year",
  description: "Model description",
  features: ["Feature 1", "Feature 2"],
  learnMoreUrl: "https://..."
}
```

#### Styling

Modify `styles.css` to customize colors, fonts, and layout. Key CSS variables:
- Background gradient: `.container` background
- Primary color: `#4285F4` (Google Blue)
- Status badge colors: `.status-available`, `.status-upcoming`, etc.

#### Icon Design

To create custom icons:
1. Open `icon-generator.html` in a browser
2. Modify the `drawIcon()` function
3. Click "Download All Icons"
4. Replace the SVG icons in the `icons/` folder

Or edit `generate-icons.js` to customize the SVG design programmatically.

### Future Enhancements

- [x] ~~Notifications for new model releases~~ (Implemented for experimental models)
- [x] ~~Filter by model status~~ (Implemented)
- [ ] Auto-fetch from Google AI documentation/blog
- [ ] Search functionality across all models
- [ ] Model comparison view (side-by-side comparison)
- [ ] Export release timeline to calendar/JSON
- [ ] Dark/light theme toggle
- [ ] Performance benchmarks for models
- [ ] Pricing information per model
- [ ] API usage examples for experimental models

## Technology Stack

- **Manifest V3**: Latest Chrome extension format
- **Vanilla JavaScript**: No framework dependencies
- **Chrome Storage API**: For data persistence
- **Modern CSS**: Flexbox, animations, gradients

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## Data Sources

Model information is curated from:
- [Google AI for Developers](https://ai.google.dev/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Google AI Blog](https://blog.google/technology/ai/)

## License

MIT License - feel free to use and modify as needed.

## Disclaimer

This is an unofficial extension and is not affiliated with, endorsed by, or sponsored by Google LLC. Gemini is a trademark of Google LLC.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Made with ❤️ for the AI development community**
