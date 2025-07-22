import { Box, Typography, Card, Grid } from '@mui/material';
import ReminderForm from '../components/Reminders/ReminderForm';
import ReminderLog from '../components/Reminders/ReminderLog';
import { Notifications, CheckCircle, Warning } from '@mui/icons-material';

const statsData = [
  {
    title: 'Total Reminders',
    value: '124',
    icon: <Notifications sx={{ fontSize: 24 }} />,
    color: '#3b82f6',
  },
  {
    title: 'Successful',
    value: '98',
    icon: <CheckCircle sx={{ fontSize: 24 }} />,
    color: '#22c55e',
  },
  {
    title: 'Failed',
    value: '26',
    icon: <Warning sx={{ fontSize: 24 }} />,
    color: '#ef4444',
  },
];

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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  {stat.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reminder Form */}
      <ReminderForm />

      {/* Reminder Log */}
      <ReminderLog />
    </Box>
  );
};

export default Reminders;
