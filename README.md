# Sunset Hills

Interactive visualization of the classic Sunset Hills coding challenge.

## About

The Sunset Hills problem asks: Given an array of building heights arranged from **west to east**, which buildings can see the sunset to the **west**? The sun sets in the west (the left side of the array). A building can see the sunset if all buildings to its **left** (west) are strictly shorter than it.

This project provides an interactive, visual solution where you can:
- Adjust building heights using controls and presets
- See real-time updates of which buildings have a sunset view
- Explore the O(n) algorithm with detailed code explanations in 4 languages

## Tech Stack

### Core Libraries
- **Bootstrap 5.3.8** - Responsive UI framework
- **Chart.js 4.5.0** - Interactive data visualization
- **Prism.js 1.30.0** - Syntax highlighting for code examples
- **Font Awesome 7.1.0** - Icon library

### Build Tools
- **Yarn 4.10.3** - Package management
- **Parcel 2.16.0** - Zero-config bundler
- **ESLint 9.17** - Code linting
- **Prettier 3.4** - Code formatting

### Standards
- **WCAG 2.1 AA** - Accessibility compliance
- **ES6+ JavaScript** - Modern, modular code

## Installation

1. **Install Yarn 4.10.3** (if not already installed):
   ```bash
   corepack enable
   yarn set version 4.10.3
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

## Development

Start the development server with hot reload:

```bash
yarn dev
```

Visit `http://localhost:1234` in your browser.

## Build

Create a production build:

```bash
yarn build
```

The output will be in the `dist/` directory, ready for deployment.

## Scripts

- `yarn dev` - Start development server on localhost:1234
- `yarn build` - Build for production
- `yarn clean` - Remove dist/ directory
- `yarn lint` - Lint JavaScript files with ESLint
- `yarn format` - Format code with Prettier

## Features

### Interactive Solver
- Real-time chart visualization with Chart.js
- Color-coded buildings (orange = sunset view, gray = no view)
- 12 preset scenarios
- Manual height input with validation
- Add/Remove building controls (1-20 buildings)
- Reset and randomize functions
- Live statistics (6 metrics)
- Toast notifications

### Code Display
- Algorithm explanation with complexity analysis
- Code examples in 4 languages: JavaScript, Python, Java, C#
- Syntax highlighting with Prism.js
- Copy to clipboard functionality
- Step-by-step walkthrough with example

### Algorithm
- **Time Complexity:** O(n) - Single pass through array
- **Space Complexity:** O(1) - Constant extra space
- **Method:** Left-to-right scan with running maximum

## Accessibility

This project follows WCAG 2.1 AA standards:
- Semantic HTML5 elements
- WAI-ARIA landmarks and labels
- Keyboard navigation support
- Skip to main content link
- Sufficient color contrast ratios
- Focus indicators
- Screen reader friendly
- Reduced motion support

## Project Structure

```
SunsetHills/
??? src/
?   ??? index.html          # Home page
?   ??? solve.html          # Interactive solver
?   ??? code.html           # Algorithm explanation
?   ??? images/             # Favicons
?   ??? js/
?   ?   ??? main.js         # Entry point
?   ?   ??? sunsetHills.js  # Core algorithm
?   ?   ??? chartSetup.js   # Chart.js configuration
?   ?   ??? statistics.js   # Stats calculations
?   ?   ??? presets.js      # Preset scenarios
?   ?   ??? toast.js        # Toast notifications
?   ?   ??? codeDisplay.js  # Prism.js integration
?   ?   ??? resultsDisplay.js
?   ??? styles/
?       ??? custom.css      # Custom styles with CSS variables
??? dist/                   # Production build (generated)
??? package.json            # Dependencies and scripts
??? README.md
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Author

**ValhallaTech**
- GitHub: [@ValhallaTech](https://github.com/ValhallaTech)

## Changelog

See commit history for detailed changes.

### Bug Fixes & Design Changes
- Fixed missing Bootstrap CSS import in main.js
- Fixed Chart.js syntax errors (missing closing parentheses)
- Removed chartjs-plugin-dragdata due to compatibility issues
- Corrected algorithm direction (left-to-right scan, sunset to west)
- Updated all code examples to reflect correct algorithm
- Fixed chart legend and axis label emoji rendering issues
- Updated all text throughout app for correct directional logic
- Reordered solve page sections for better UX
- Enhanced hero section with white circular icon background
- Restored vibrant sunset gradient background
