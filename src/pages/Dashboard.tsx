import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Mock data for charts
const monthlyRevenueData = [
  { name: 'Jan', amount: 220 },
  { name: 'Feb', amount: 240 },
  { name: 'Mar', amount: 280 },
  { name: 'Apr', amount: 250 },
  { name: 'May', amount: 310 },
  { name: 'Jun', amount: 350 },
  { name: 'Jul', amount: 450 },
  { name: 'Aug', amount: 410 },
  { name: 'Sep', amount: 380 },
  { name: 'Oct', amount: 420 },
  { name: 'Nov', amount: 390 },
  { name: 'Dec', amount: 450 },
];

const recentActivityData = [
  { 
    id: 1, 
    type: 'Total Notifications', 
    amount: '$0.9k', 
    increase: '+25%',
    color: '#22c55e' 
  },
  { 
    id: 2, 
    type: 'TNotifications', 
    amount: '$1.3k', 
    increase: '+35%',
    color: '#3b82f6' 
  },
  { 
    id: 3, 
    type: 'RNotifications', 
    amount: '$2.0k', 
    increase: '+45%',
    color: '#f59e0b' 
  }
];

// Dashboard component
const Dashboard = () => {
  const theme = useTheme();

  const statCards = [
    {
      title: 'Total Revenue',
      value: '$24.59',
      subtext: 'Tordue Paynent $10/mm',
      color: theme.palette.primary.main,
      bgcolor: theme.palette.primary.light,
    },
    {
      title: 'Active Groups',
      value: '$15.59',
      subtext: 'Needdue Payment $60/mm',
      color: theme.palette.success.main,
      bgcolor: theme.palette.success.light,
    },
    {
      title: 'Total Clients',
      value: '$350',
      subtext: 'Overdue Payment $10/mm',
      color: theme.palette.warning.main,
      bgcolor: theme.palette.warning.light,
    },
    {
      title: 'Overdue Payments',
      value: '$24.99',
      subtext: 'Total Reminder $10/mm',
      color: theme.palette.error.main,
      bgcolor: theme.palette.error.light,
    },
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {card.subtext}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Monthly Revenue</Typography>
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    component="span"
                    sx={{ 
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      fontWeight: 'medium',
                      fontSize: '0.75rem',
                      mr: 1
                    }}
                  >
                    +40%
                  </Typography>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Bar Chart */}
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={monthlyRevenueData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
                    <Bar 
                      dataKey="amount" 
                      fill={theme.palette.primary.main} 
                      radius={[4, 4, 0, 0]} 
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Recent Activity</Typography>
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>

              {/* Activity List */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {recentActivityData.map((item) => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2.5,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                        pb: 0,
                        mb: 0
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 2,
                          bgcolor: `${item.color}20`,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <TrendingUp />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">{item.type}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.amount}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'success.main',
                        bgcolor: 'success.lighter',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1
                      }}
                    >
                      {item.increase}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Payment Trends</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />} 
                  size="small"
                  sx={{ fontWeight: 'medium' }}
                >
                  View All
                </Button>
              </Box>

              {/* Line Chart */}
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={monthlyRevenueData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Revenue"
                      stroke={theme.palette.primary.main} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card 
            sx={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" mb={3}>Payment Status</Typography>
              
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {/* Progress Sections */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Total Received</Typography>
                    <Typography variant="body2" fontWeight="medium">68%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={68} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'primary.lighter',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                      }
                    }} 
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Pending</Typography>
                    <Typography variant="body2" fontWeight="medium">25%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={25} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'warning.lighter',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'warning.main',
                      }
                    }} 
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overdue</Typography>
                    <Typography variant="body2" fontWeight="medium">7%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={7} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'error.lighter',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'error.main',
                      }
                    }} 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;