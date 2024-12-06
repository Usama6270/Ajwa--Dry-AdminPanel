// scenes/settings.js

import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

function Settings() {
  const handleSave = () => {
    // Logic to save settings, e.g., change password, theme settings, etc.
    alert('Settings saved!');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>
      
      <TextField label="Change Username" fullWidth margin="normal" />
      <TextField label="Change Email" fullWidth margin="normal" />
      <TextField label="Change Password" type="password" fullWidth margin="normal" />

      <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
        Save Settings
      </Button>
    </Container>
  );
}

export default Settings;
