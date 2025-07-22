import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Download as DownloadIcon,
  ShowChart as ShowChartIcon,
  AccountBalanceWallet as WalletIcon,
  Group as GroupIcon,
  DateRange as DateRangeIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

const monthlyStats = [
  { month: "Jan", collected: 15000, due: 2000 },
  { month: "Feb", collected: 18000, due: 1500 },
  { month: "Mar", collected: 20000, due: 1000 },
  { month: "Apr", collected: 22000, due: 2500 },
  { month: "May", collected: 19000, due: 3000 },
  { month: "Jun", collected: 25000, due: 1800 },
  { month: "Jul", collected: 21000, due: 2200 },
  { month: "Aug", collected: 23000, due: 1900 },
];

const groupWise = [
  { group: "Batch A", value: 22000, color: "#22c55e" },
  { group: "Batch B", value: 12000, color: "#3b82f6" },
  { group: "Batch C", value: 15000, color: "#f59e0b" },
  { group: "Batch D", value: 18000, color: "#ec4899" },
  { group: "Batch E", value: 20000, color: "#8b5cf6" },
];

const summaryStats = {
  totalCollected: "₹1,35,000",
  totalDue: "₹15,400",
  paidStudents: "85%",
  activeGroups: "5",
  monthlyGrowth: "+12.5%",
  averageCollection: "₹21,500",
};

const Reports = () => {
  return (
    <Fade in timeout={500}>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Financial Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track revenue, collections, and payment trends
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Select
              size="small"
              defaultValue="2024"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="2024">Year 2024</MenuItem>
              <MenuItem value="2023">Year 2023</MenuItem>
            </Select>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{
                background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #16a34a, #15803d)',
                },
              }}
            >
              Export Report
            </Button>
          </Stack>
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Collections', value: summaryStats.totalCollected, icon: WalletIcon, color: '#22c55e' },
            { title: 'Total Due', value: summaryStats.totalDue, icon: ShowChartIcon, color: '#f59e0b' },
            { title: 'Paid Students', value: summaryStats.paidStudents, icon: GroupIcon, color: '#3b82f6' },
            { title: 'Monthly Growth', value: summaryStats.monthlyGrowth, icon: DateRangeIcon, color: '#8b5cf6' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${item.color}0a, ${item.color}1a)`,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${item.color}22`,
                      color: item.color,
                    }}
                  >
                    <item.icon />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Monthly Collections Chart */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="600">
                  Monthly Collections Trend
                </Typography>
                <Tooltip title="Download Chart">
                  <IconButton size="small">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="collected" name="Collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="due" name="Due" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Group-wise Collections */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                Group-wise Distribution
              </Typography>
              
              <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={groupWise}
                      dataKey="value"
                      nameKey="group"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label={(entry) => `${entry.group}: ₹${entry.value?.toLocaleString() || '0'}`}
                    >
                      {groupWise.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Reports;
