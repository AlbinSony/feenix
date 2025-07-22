import { Card, CardContent, Typography, TextField, Button, Grid, FormControlLabel, Switch } from '@mui/material';

const ReminderSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Reminder Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>WhatsApp Message Template</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              defaultValue="Dear {name}, Your fee payment of ₹{amount} is due on {due_date}. Please make the payment to avoid late fees."
              helperText="Use {name}, {amount}, {due_date} as placeholders"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Reminder Schedule</Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send reminder 1 day before due date"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send reminder on due date"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send reminder 3 days after due date"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable Automatic Reminders"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Maximum Reminders per Month"
              type="number"
              margin="normal"
            />
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 3 }}>Save Reminder Settings</Button>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;
