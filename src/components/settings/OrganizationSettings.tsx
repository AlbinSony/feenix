import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { Upload } from '@mui/icons-material';

const OrganizationSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Organization Settings</Typography>
        
        <Box sx={{ mb: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
          <Button startIcon={<Upload />}>Upload Logo</Button>
        </Box>

        <TextField fullWidth label="Tuition Center Name" margin="normal" />
        <TextField fullWidth label="Address" margin="normal" multiline rows={3} />
        <TextField fullWidth label="Business Email" margin="normal" />
        <TextField fullWidth label="Business Phone" margin="normal" />
        <TextField fullWidth label="WhatsApp Business Number" margin="normal" />
        
        <Button variant="contained" sx={{ mt: 2 }}>Update Organization Info</Button>
      </CardContent>
    </Card>
  );
};

export default OrganizationSettings;
