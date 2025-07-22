import { Card, CardContent, Typography, TextField, Button, Grid, FormControlLabel, Switch, Box } from '@mui/material';
import { Upload } from '@mui/icons-material';

const InvoiceSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Invoice Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Invoice Footer Text</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              margin="normal"
              defaultValue="Thank you for your business!"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>Digital Signature</Typography>
              <Button startIcon={<Upload />}>Upload Signature</Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-generate receipt after payment"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include logo on invoice"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include contact information"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Starting Invoice Number"
              margin="normal"
              defaultValue="INV-001"
            />
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 3 }}>Save Invoice Settings</Button>
      </CardContent>
    </Card>
  );
};

export default InvoiceSettings;
