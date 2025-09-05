import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Avatar,
  Skeleton,
  Fade,
  alpha,
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
  Person,
  Refresh,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  dashboardApi, 
  DashboardStats, 
  RecentActivity, 
  ReminderActivity 
} from '../services/dashboardApi';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recentReminders, setRecentReminders] = useState<ReminderActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      // Fetch all dashboard data in parallel using real APIs
      const [statsData, activitiesData, remindersData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivities(5),
        dashboardApi.getRecentReminders(10),
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
      setRecentReminders(remindersData);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Only show error message, don't set fallback data
      // This way users know there's an actual connection issue
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleResendReminder = async (reminderId: string, studentName: string) => {
    try {
      await dashboardApi.resendReminder(reminderId);
      toast.success(`Reminder resent to ${studentName}`);
      fetchDashboardData(true);
    } catch (err: any) {
      toast.error('Failed to resend reminder');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent': return 'primary';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <AccountBalanceWallet />;
      case 'reminder': return <Notifications />;
      case 'student_added': return <Person />;
      case 'group_created': return <Group />;
      default: return <CheckCircleOutline />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Grid container spacing={3} mb={4}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  // Show error state if no data could be loaded
  if (error && !stats) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => fetchDashboardData()} 
          startIcon={<Refresh />}
        >
          Retry Loading Dashboard
        </Button>
      </Box>
    );
  }

  const statCards = stats ? [
    {
      title: 'Total Collected',
      value: `₹${stats.totalCollected.toLocaleString()}`,
      icon: <AccountBalanceWallet />,
      color: theme.palette.success.main,
      bgcolor: alpha(theme.palette.success.main, 0.1),
      trend: stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth}%` : `${stats.monthlyGrowth}%`,
      trendColor: stats.monthlyGrowth > 0 ? theme.palette.success.main : theme.palette.error.main,
    },
    {
      title: 'Total Dues',
      value: `₹${stats.totalDues.toLocaleString()}`,
      icon: <WarningAmber />,
      color: theme.palette.error.main,
      bgcolor: alpha(theme.palette.error.main, 0.1),
      subtitle: `${stats.overdueStudents} overdue`,
      trendColor: theme.palette.error.main,
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <Person />,
      color: theme.palette.info.main,
      bgcolor: alpha(theme.palette.info.main, 0.1),
      subtitle: `${stats.paidStudents} paid`,
      trendColor: theme.palette.info.main,
    },
    {
      title: 'Active Groups',
      value: stats.totalGroups,
      icon: <Group />,
      color: theme.palette.primary.main,
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      subtitle: `${stats.totalReminders} requests sent`,
      trendColor: theme.palette.primary.main,
    },
  ] : [];

  return (
    <Fade in timeout={500}>
      <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Header with Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your payments.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
              size="small"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/reminders')}
              sx={{
                background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #16a34a, #15803d)',
                },
              }}
            >
              Send Reminder
            </Button>
            <Button
              variant="outlined"
              startIcon={<AssessmentOutlined />}
              onClick={() => navigate('/reports')}
            >
              View Reports
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => {
                  if (index === 0) navigate('/payments');
                  else if (index === 1) navigate('/payments');
                  else if (index === 2) navigate('/students');
                  else if (index === 3) navigate('/groups');
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: card.bgcolor,
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                    {card.trend && (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: card.trendColor }}>
                        <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" fontWeight="600">
                          {card.trend}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  
                  <Typography variant="h4" fontWeight="bold" mb={1}>
                    {card.value}
                  </Typography>
                  
                  {card.subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Recent Reminders */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="600">
                    Recent Payment Requests
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/payments')}
                    endIcon={<Schedule />}
                  >
                    View All
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Group</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentReminders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No recent payment requests found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentReminders.map((reminder) => (
                          <TableRow 
                            key={reminder._id}
                            sx={{ 
                              '&:hover': { bgcolor: 'action.hover' },
                              cursor: 'pointer'
                            }}
                            onClick={() => navigate('/payments')}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.875rem' }}>
                                  {reminder.student.name.charAt(0)}
                                </Avatar>
                                {reminder.student.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={reminder.student.group.name}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {reminder.method === 'WhatsApp' ? 
                                  <WhatsApp color="success" sx={{ mr: 1, fontSize: 18 }} /> : 
                                  <Email color="primary" sx={{ mr: 1, fontSize: 18 }} />
                                }
                                Payment Request
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={reminder.status}
                                size="small"
                                color={getStatusColor(reminder.status)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {format(new Date(reminder.sentAt), 'MMM dd, HH:mm')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              {reminder.status === 'Failed' && (
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResendReminder(reminder._id, reminder.student.name);
                                  }}
                                  color="primary"
                                >
                                  <Refresh />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions & Recent Activities */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              {/* Quick Actions */}
              <Card sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                    Quick Actions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => navigate('/payments')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Create Payment Request
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Person />}
                      onClick={() => navigate('/students')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Add New Student
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Group />}
                      onClick={() => navigate('/groups')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Create New Group
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<WhatsApp />}
                      onClick={() => navigate('/reminders')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Send WhatsApp Reminder
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                flex: 1,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                    Recent Activities
                  </Typography>
                  
                  {recentActivities.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                      No recent activities
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {recentActivities.map((activity) => (
                        <Box key={activity._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="500">
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;