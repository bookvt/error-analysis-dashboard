import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ErrorDashboard from './components/ErrorDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorDashboard />
    </ThemeProvider>
  );
}

export default App;
