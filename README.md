# Sunset Hills

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/sunsethills69/deploys)

> Interactive visualization of the classic Sunset Hills coding challenge.

**Live Demo:** [https://sunsethills69.netlify.app](https://sunsethills69.netlify.app)

## About

The Sunset Hills problem asks: Given an array of building heights arranged from **west to east**, which buildings can see the sunset to the **west**? The sun sets in the west (the left side of the array). A building can see the sunset if all buildings to its **left** (west) are strictly shorter than it.

This project provides an interactive, visual solution where you can:
- Drag building bars to adjust heights in real-time
- See instant visualization of which buildings have a sunset view
- Toggle between light and dark themes
- Explore the O(n) algorithm with code in JavaScript, Python, Java, and C#
- Use on any device with responsive design

## Features

### Interactive Solver
- **Drag-and-Drop Chart** - Adjust building heights by dragging bars up/down
- **Color-Coded Buildings** - Orange = sunset view, Gray = blocked
- **12 Preset Scenarios** - Test edge cases and common patterns
- **Manual Input** - Enter custom heights (comma-separated)
- **Dynamic Controls** - Add/remove buildings (1-20 range)
- **Live Statistics** - 6 real-time metrics
- **Smart Validation** - Heights constrained to 10-100 units
- **Toast Notifications** - Clear user feedback

### Dark Mode
- System preference detection
- LocalStorage persistence
- Smooth color transitions
- Chart theme adaptation
- Monokai code theme

### Code Display
- **4 Languages** - JavaScript, Python, Java, C#
- **Syntax Highlighting** - Monokai theme via Prism.js
- **Dynamic Loading** - Code examples auto-update from source files
- **Copy to Clipboard** - One-click code copying
- **Complexity Analysis** - O(n) time, O(1) space explained

### Algorithm
- **Time Complexity:** O(n) - Single pass through array
- **Space Complexity:** O(1) - Constant extra space
- **Method:** Left-to-right scan with running maximum

## Quick Start

### Prerequisites
- Node.js 22.20.0 LTS (or compatible version)
- Yarn 4.10.3

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ValhallaTech/SunsetHills.git
   cd SunsetHills
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start development server:**
   ```bash
   yarn dev
   ```

4. **Open in browser:**
   ```
   http://localhost:1234
   ```

## Build & Deploy

### Local Production Build

```bash
# Clean previous builds
yarn clean

# Create production build
yarn build

# Preview production build
npx serve dist
```

### Deploy to Netlify

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick deploy:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify init
netlify deploy --prod
```

## Tech Stack

### Frontend
- **Bootstrap 5.3.8** - Responsive UI framework
- **Chart.js 4.5.0** - Interactive data visualization
- **chartjs-plugin-dragdata 2.3.1** - Drag-and-drop functionality
- **Prism.js 1.30.0** - Syntax highlighting (Monokai theme)
- **Font Awesome 7.1.0** - Icon library

### Build Tools
- **Yarn 4.10.3** - Package management
- **Parcel 2.16.0** - Zero-config bundler
- **ESLint 9.17** - Code linting
- **Prettier 3.4** - Code formatting

### Deployment
- **Netlify** - Hosting with CDN
- **Node.js 22.20.0** - Build environment

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server on localhost:1234 |
| `yarn build` | Build for production (outputs to `dist/`) |
| `yarn clean` | Remove dist/ and .parcel-cache/ |
| `yarn lint` | Lint JavaScript files with ESLint |
| `yarn format` | Format code with Prettier |

## Accessibility

This project follows **WCAG 2.1 AA** standards:
- Semantic HTML5 elements
- WAI-ARIA landmarks and labels
- Keyboard navigation support
- Skip to main content link
- Sufficient color contrast (4.5:1+ ratio)
- Focus indicators on all interactive elements
- Screen reader friendly
- Reduced motion support (`prefers-reduced-motion`)

## Project Structure

```
SunsetHills/
??? src/
?   ??? index.html              # Home page
?   ??? solve.html              # Interactive solver
?   ??? code.html               # Algorithm explanation
?   ??? images/                 # Favicons
?   ??? js/
?   ?   ??? main.js             # Entry point
?   ?   ??? sunsetHills.js      # Core algorithm
?   ?   ??? chartSetup.js       # Chart.js with drag support
?   ?   ??? themeToggle.js      # Dark mode functionality
?   ?   ??? statistics.js       # Stats calculations
?   ?   ??? presets.js          # Preset scenarios
?   ?   ??? toast.js            # Toast notifications
?   ?   ??? codeDisplay.js      # Prism.js integration
?   ?   ??? resultsDisplay.js   # Results rendering
?   ??? styles/
?   ?   ??? custom.css          # Custom styles with CSS variables
?   ??? code-examples/
?       ??? javascript.txt      # JavaScript example
?       ??? python.txt          # Python example
?       ??? java.txt            # Java example
?       ??? csharp.txt          # C# example
??? dist/                       # Production build (generated)
??? netlify.toml                # Netlify configuration
??? .nvmrc                      # Node version (22.20.0)
??? package.json                # Dependencies and scripts
??? DEPLOYMENT.md               # Deployment guide
??? README.md
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Author

**ValhallaTech**
- GitHub: [@ValhallaTech](https://github.com/ValhallaTech)
- Repository: [SunsetHills](https://github.com/ValhallaTech/SunsetHills)

## Acknowledgments

- Bootstrap team for the amazing UI framework
- Chart.js for the powerful charting library
- Prism.js for beautiful syntax highlighting
- Font Awesome for the icon set

## Changelog

### v1.0.0 - Initial Release
- Interactive Chart.js visualization with drag-and-drop
- Dark mode with theme persistence
- Dynamic code examples in 4 languages
- 12 preset scenarios
- Real-time statistics
- Mobile responsive design
- WCAG 2.1 AA accessibility
- Netlify deployment ready

---

**Built with love using modern web technologies**
