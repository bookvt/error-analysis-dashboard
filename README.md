# Error Analysis Dashboard

A React-based dashboard for error analysis built with Vite and Tailwind CSS.

## 🚀 Live Demo

Visit the live application: [https://bookvt.github.io/error-analysis-dashboard](https://bookvt.github.io/error-analysis-dashboard)

## 📦 Development

### Prerequisites
- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

The deployment workflow is triggered automatically when:
- Code is pushed to the `main` branch
- You can also manually trigger the deployment from the Actions tab

### Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

This will build and deploy to the `gh-pages` branch.

### GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings → Pages
2. Under "Build and deployment", select:
   - Source: **GitHub Actions**
3. The site will be deployed to: `https://bookvt.github.io/error-analysis-dashboard`

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **Recharts** - Charting library
- **Lucide React** - Icon library

## 📝 Project Structure

```
error-analysis-dashboard/
├── src/              # Source code
├── public/           # Static assets
├── dist/             # Production build (generated)
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions deployment workflow
└── vite.config.js    # Vite configuration
```

## 🔧 Configuration

The project is configured with:
- Base path set to `/error-analysis-dashboard/` for GitHub Pages
- ESLint for code quality
- PostCSS with Autoprefixer

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
