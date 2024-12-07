import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Slide,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';

// Styled components for smooth animations
const StyledCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NotificationsPage = () => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');  // Change recipient to userId
  const [status, setStatus] = useState('');
  const [type, setType] = useState('custom'); // Default notification type is 'custom'
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Send a new notification
  const sendNotification = async () => {
    setLoading(true); // Start loading animation
    try {
      const response = await fetch('http://localhost:9000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,   // Sending userId instead of recipient
          message,
          type,     // Sending the selected type to the backend
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Notification sent successfully!');
        setStatus('Notification sent successfully!');
        setUserId('');  // Reset userId after sending
        setMessage('');  // Reset message after sending
        setType('custom'); // Reset type after sending
      } else {
        setSnackbarMessage('Failed to send notification.');
        setStatus('Failed to send notification.');
      }
    } catch (error) {
      setSnackbarMessage('Error sending notification.');
      setStatus('Error sending notification.');
    } finally {
      setLoading(false); // Stop loading animation
      setOpenSnackbar(true); // Show snackbar with status
    }
  };

  return (
    <Box m="2rem">
      <Typography variant="h4" color={theme.palette.text.primary} gutterBottom>
        Send a Notification
      </Typography>

      <StyledCard>
        <Box display="flex" flexDirection="column" gap="1.5rem" maxWidth="500px">
          <TextField
            label="User ID"  // Change label from "Recipient" to "User ID"
            variant="outlined"
            fullWidth
            value={userId}  // Bind to userId
            onChange={(e) => setUserId(e.target.value)}
            focused
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
              },
            }}
          />
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
              },
            }}
          />

          {/* Type selection dropdown */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Notification Type</InputLabel>
            <Select
              label="Notification Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <MenuItem value="custom">Custom</MenuItem>
              <MenuItem value="alert">Alert</MenuItem>
              <MenuItem value="reminder">Reminder</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={sendNotification}
            disabled={loading}
            sx={{
              padding: '0.8rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Notification'
            )}
          </Button>
        </Box>
      </StyledCard>

      <Divider sx={{ marginY: '2rem' }} />

      {/* Snackbar to show status message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      />
    </Box>
  );
};

export default NotificationsPage;
