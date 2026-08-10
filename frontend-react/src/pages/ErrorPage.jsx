import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function ErrorPage() {
  const error = useRouteError();

  let status = 500;
  let title = 'Something went wrong';
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.statusText || 'Error';
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const friendlyMessages = {
    404: "Oops! This page doesn't exist.",
    403: "You don't have permission to access this page.",
    401: "Please sign in to continue.",
  };

  const displayMessage = friendlyMessages[status] || message;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          {/* Icon + Status */}
          <Box sx={{ mb: 3 }}>
            <ErrorOutlineIcon
              sx={{
                fontSize: { xs: 80, sm: 100 },
                color: status >= 500 ? 'red' : 'orange',
              }}
            />
            <Typography
              variant="h2"
              component="div"
              fontWeight={800}
              sx={{
                mt: 1,
                color: status >= 500 ? 'red' : 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              {status}
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            component="h1"
            fontWeight={700}
            gutterBottom
          >
            {title}
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              maxWidth: 480,
              mx: 'auto',
              color: 'text.secondary',
            }}
          >
            {displayMessage}
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeRoundedIcon />}
              onClick={() => window.location.href = '/'}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Back to Home
            </Button>

            {status >= 500 && (
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => window.location.reload()}
                sx={{
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                }}
              >
                Try Again
              </Button>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{ mt: 5, display: 'block', color: 'text.disabled' }}
          >
            If the problem persists, please contact support.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
