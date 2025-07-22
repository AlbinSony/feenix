import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  Button,
  Fade,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const revenueData = [
    { name: 'Jan', value: 200 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 250 },
    { name: 'Apr', value: 500 },
    { name: 'May', value: 400 },
    { name: 'Jun', value: 350 },
  ];

  const paymentStatusData = [
    { name: 'Paid', value: 70, color: '#22c55e' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
    { name: 'Overdue', value: 10, color: '#ef4444' },
  ];

  const groupPerformanceData = [
    { name: 'Group A', value: 45 },
    { name: 'Group B', value: 35 },
    { name: 'Group C', value: 30 },
    { name: 'Group D', value: 40 },
    { name: 'Group E', value: 25 },
  ];

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Reports & Analytics</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Select size="small" defaultValue="date" sx={{ minWidth: 200 }}>
              <MenuItem value="date">Date Range Select</MenuItem>
            </Select>
            <Button variant="contained" color="primary">
              Export Report
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { title: 'Total Revenue', value: '$78400K', subtitle: 'Transactions' },
            { title: '$224 kh', value: '$6130 kh', subtitle: 'Transactions' },
            { title: '$8620V', value: '$732.0kh', subtitle: 'Average Payment time' },
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ my: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Growth Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Status Breakdown
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Top Performing Groups
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={groupPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Reports;
