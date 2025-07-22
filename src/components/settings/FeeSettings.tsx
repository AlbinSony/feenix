import { Card, CardContent, Typography, TextField, Button, Grid, FormControlLabel, Switch } from '@mui/material';

const FeeSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Fee Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Default Fee Plans</Typography>
            <TextField
              fullWidth
              label="Monthly Fee Amount"
              type="number"
              margin="normal"
              InputProps={{ startAdornment: <Typography color="textSecondary">₹</Typography> }}
            />
            <TextField
              fullWidth
              label="Registration Fee"
              type="number"
              margin="normal"
              InputProps={{ startAdornment: <Typography color="textSecondary">₹</Typography> }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Late Fee Policy</Typography>
            <TextField
              fullWidth
              label="Late Fee Percentage"
              type="number"
              margin="normal"
              InputProps={{ endAdornment: <Typography color="textSecondary">%</Typography> }}
            />
            <TextField
              fullWidth
              label="Grace Period (Days)"
              type="number"
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Due Date Settings</Typography>
            <TextField
              fullWidth
              label="Default Due Date"
              type="number"
              margin="normal"
              helperText="Day of month (1-31)"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Tax Settings</Typography>
            <TextField
              fullWidth
              label="GST Percentage"
              type="number"
              margin="normal"
              InputProps={{ endAdornment: <Typography color="textSecondary">%</Typography> }}
            />
            <FormControlLabel
              control={<Switch />}
              label="Include GST in Invoices"
            />
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 3 }}>Save Fee Settings</Button>
      </CardContent>
    </Card>
  );
};

export default FeeSettings;
