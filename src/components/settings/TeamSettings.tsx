import { Card, CardContent, Typography, Button, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const TeamSettings = () => {
  const teamMembers = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Team Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ mb: 3 }}
            >
              Invite Team Member
            </Button>

            <List>
              {teamMembers.map((member, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={member.name}
                    secondary={`${member.email} • ${member.role}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Default Permissions</Typography>
            <TextField
              select
              fullWidth
              label="Default Role for New Members"
              defaultValue="viewer"
              margin="normal"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="viewer">Viewer</option>
            </TextField>
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 3 }}>Save Team Settings</Button>
      </CardContent>
    </Card>
  );
};

export default TeamSettings;
