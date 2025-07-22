import { Card, CardContent, Typography, TextField, Button, Grid, FormControlLabel, Switch, Chip, Box } from '@mui/material';

const PaymentSettings = () => {
  const paymentModes = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Payment Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Default Currency"
              defaultValue="INR"
              margin="normal"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Accepted Payment Modes</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {paymentModes.map((mode) => (
                <Chip
                  key={mode}
                  label={mode}
                  color="primary"
                  variant="outlined"
                  onDelete={() => {}}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable Payment Link Generation"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Allow Manual Payment Marking"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Payment Gateway API Key"
              margin="normal"
              type="password"
            />
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 3 }}>Update Payment Settings</Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
