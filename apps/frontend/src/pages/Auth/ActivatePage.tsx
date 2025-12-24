import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Container,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ActivatePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (!code) {
        setError('Invalid activation link');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user-account/activate/${code}`,
          {
            method: 'GET',
            redirect: 'manual',
          }
        );

        if (response.type === 'opaqueredirect' || response.status === 302 || response.ok) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/sign-in');
          }, 3000);
        } else {
          const data = await response.json().catch(() => ({}));
          setError(data.message || 'Failed to activate account');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to activate account. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [code, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {loading && (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h5" component="h1" gutterBottom>
                Activating Your Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we activate your account...
              </Typography>
            </>
          )}

          {success && !loading && (
            <>
              <CheckCircleOutlineIcon
                color="success"
                sx={{ fontSize: 60, mb: 2 }}
              />
              <Typography variant="h5" component="h1" gutterBottom>
                Account Activated!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your account has been successfully activated.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Redirecting you to sign in...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/sign-in')}
                fullWidth
              >
                Go to Sign In
              </Button>
            </>
          )}

          {error && !loading && (
            <>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h1" gutterBottom>
                Activation Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The activation link may have expired or is invalid.
                Please try signing up again or contact support.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/sign-up')}
                fullWidth
              >
                Back to Sign Up
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
