import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Group,
  Notifications,
  WhatsApp,
  Email,
  Add,
  AssessmentOutlined,
  AccountBalanceWallet,
  WarningAmber,
  CheckCircleOutline,
} from '@mui/icons-material';

// Mock data
const dashboardStats = {
  totalCollected: 52000,
  totalDues: 13500,
  totalBatches: 3,
  totalReminders: 18,
};

const reminders = [
  { 
    id: 1,
    name: "Ananya", 
    group: "Batch A", 
    method: "WhatsApp", 
    status: "Sent", 
    time: "Today, 9:30AM" 
  },
  { 
    id: 2,
    name: "Rahul", 
    group: "Batch B", 
    method: "Email", 
    status: "Failed", 
    time: "Today, 9:15AM" 
  },
  { 
    id: 3,
    name: "Priya", 
    group: "Batch A", 
    method: "WhatsApp", 
    status: "Delivered", 
    time: "Yesterday, 4:30PM" 
  },
];

const Dashboard = () => {
  const theme = useTheme();

  const statCards = [
    {
      title: 'Total Collected',
      value: `₹${dashboardStats.totalCollected.toLocaleString()}`,
      icon: <AccountBalanceWallet />,
      color: theme.palette.success.main,
      bgcolor: theme.palette.success.light,
    },
    {
      title: 'Total Dues',
      value: `₹${dashboardStats.totalDues.toLocaleString()}`,
      icon: <WarningAmber />,
      color: theme.palette.error.main,
      bgcolor: theme.palette.error.light,
    },
    {
      title: 'Total Batches',
      value: dashboardStats.totalBatches,
      icon: <Group />,
      color: theme.palette.primary.main,
      bgcolor: theme.palette.primary.light,
    },
    {
      title: 'Reminders Sent',
      value: dashboardStats.totalReminders,
      icon: <Notifications />,
      color: theme.palette.warning.main,
      bgcolor: theme.palette.warning.light,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent': return 'primary';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => alert('Send New Reminder clicked')}
        >
          Send New Reminder
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssessmentOutlined />}
          onClick={() => alert('View Full Report clicked')}
        >
          View Full Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
              onClick={() => alert(`Clicked on ${card.title}`)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: card.bgcolor,
                      color: card.color,
                      mr: 2
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reminders Table */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3}>Recent Reminders</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reminders.map((reminder) => (
                  <TableRow 
                    key={reminder.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer'
                    }}
                    onClick={() => alert(`Clicked on reminder for ${reminder.name}`)}
                  >
                    <TableCell>{reminder.name}</TableCell>
                    <TableCell>{reminder.group}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {reminder.method === 'WhatsApp' ? 
                          <WhatsApp color="success" sx={{ mr: 1 }} /> : 
                          <Email color="primary" sx={{ mr: 1 }} />
                        }
                        {reminder.method}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={reminder.status}
                        size="small"
                        color={getStatusColor(reminder.status)}
                      />
                    </TableCell>
                    <TableCell>{reminder.time}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Resend reminder to ${reminder.name}`);
                        }}
                      >
                        <CheckCircleOutline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;