import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // blue-500
    },
    secondary: {
      main: '#ec4899', // pink-500
    },
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b',   // slate-800
    },
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#94a3b8', // slate-400
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 }, // 32px
    h2: { fontSize: '1.5rem', fontWeight: 700 }, // 24px
    h3: { fontSize: '1.25rem', fontWeight: 700 }, // 20px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem', // rounded-lg
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem', // rounded-xl
          backgroundImage: 'none',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
          border: '1px solid #334155', // border-slate-700
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
            }
        }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#334155 #0f172a",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#0f172a",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#334155",
            minHeight: 24,
            border: "3px solid #0f172a",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#475569",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#475569",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#475569",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});

export default theme;
