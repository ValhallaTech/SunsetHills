# Sunset Hills

Interactive visualization of the classic Sunset Hills coding challenge.

## ?? About

The Sunset Hills problem asks: Given an array of building heights, which buildings can see the sunset? A building can see the sunset if all buildings to its right (west direction) are strictly shorter than it.

This project provides an interactive, visual solution where you can:
- Drag buildings to adjust their heights
- See real-time updates of which buildings have a sunset view
- Explore the algorithm with detailed code explanations

## ?? Tech Stack

- **Parcel.js 2.16.0** - Zero-config bundler
- **Bootstrap 5.3.8** - Responsive UI framework
- **Chart.js 4.5.0** - Interactive data visualization
- **Font Awesome 7.1.0** - Icons
- **Prism.js 1.30.0** - Syntax highlighting
- **Yarn 4.10.3** - Package management
- **SCSS** - Styling with variables and modules

## ?? Installation

1. **Install Yarn 4.10.3** (if not already installed):
   ```bash
   corepack enable
   yarn set version 4.10.3
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

## ??? Development

Start the development server with hot reload:

```bash
yarn dev
```

Visit `http://localhost:1234` in your browser.

## ??? Build

Create a production build:

```bash
yarn build
```

The output will be in the `dist/` directory.

## ?? Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn clean` - Remove build artifacts
- `yarn lint` - Lint JavaScript files
- `yarn format` - Format code with Prettier

## ? Accessibility

This project follows WCAG 2.1 AA standards:
- Semantic HTML5
- WAI-ARIA landmarks and labels
- Keyboard navigation support
- Skip to main content link
- Sufficient color contrast

## ?? Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## ?? License

MIT License - see LICENSE file for details

## ?? Author

**ValhallaTech**
- GitHub: [@ValhallaTech](https://github.com/ValhallaTech)

## ?? Related Projects

- [TacoCat Radar](https://github.com/ValhallaTech/TacoCatRadar) - Similar project structure and design patterns
