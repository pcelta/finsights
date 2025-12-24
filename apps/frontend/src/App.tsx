import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/material-ui/dashboard/Dashboard';
import SignUpPage from './pages/Auth/SignUpPage';
import SignInPage from './pages/Auth/SignInPage';
import ActivatePage from './pages/Auth/ActivatePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AppTheme from './components/material-ui/shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/activate/:code" element={<ActivatePage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </AppTheme>
  );
}

export default App;
