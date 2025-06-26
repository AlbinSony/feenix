import { Box, Typography, Card } from '@mui/material';
import ReminderForm from '../components/Reminders/ReminderForm';
import ReminderLog from '../components/Reminders/ReminderLog';

const Reminders = () => {
  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          background: 'linear-gradient(45deg, #22c55e0a, #3b82f60a)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          WhatsApp Reminders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Send payment reminders to individuals or groups via WhatsApp
        </Typography>
      </Card>

      {/* Reminder Form */}
      <ReminderForm />

      {/* Reminder Log */}
      <ReminderLog />
    </Box>
  );
};

export default Reminders;
