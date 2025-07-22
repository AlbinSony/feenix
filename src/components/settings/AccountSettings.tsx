import { Box, Card, CardContent, Typography, TextField, Button, Avatar, Switch, FormControlLabel } from '@mui/material';

const AccountSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Account Settings</Typography>
        
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 80, height: 80 }} />
          <Button variant="outlined">Change Picture</Button>
        </Box>

        <TextField fullWidth label="Full Name" margin="normal" />
        <TextField fullWidth label="Email" margin="normal" type="email" />
        <TextField fullWidth label="Phone Number" margin="normal" />
        <TextField fullWidth label="New Password" type="password" margin="normal" />
        
        <FormControlLabel
          control={<Switch />}
          label="Enable Two-Factor Authentication"
          sx={{ my: 2 }}
        />

        <Button variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
