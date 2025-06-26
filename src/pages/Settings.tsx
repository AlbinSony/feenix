import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fade,
} from '@mui/material';

const Settings = () => {
  return (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <TextField
                  fullWidth
                  label="Business Name"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="normal"
                  variant="outlined"
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="WhatsApp Notifications" />
                    <ListItemSecondaryAction>
                      <Switch edge="end" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email Notifications" />
                    <ListItemSecondaryAction>
                      <Switch edge="end" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Payment Reminders" />
                    <ListItemSecondaryAction>
                      <Switch edge="end" />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  WhatsApp Integration
                </Typography>
                <TextField
                  fullWidth
                  label="WhatsApp Business Number"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="API Key"
                  margin="normal"
                  variant="outlined"
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Update WhatsApp Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Settings
                </Typography>
                <TextField
                  fullWidth
                  label="Default Currency"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Payment Gateway API Key"
                  margin="normal"
                  variant="outlined"
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Update Payment Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Settings; 