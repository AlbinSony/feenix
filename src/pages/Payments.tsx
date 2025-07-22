import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Tab,
  Tabs,
} from '@mui/material';
import { useState } from 'react';
import {
  Add,
  Edit,
  Delete,
  Receipt,
  AttachMoney,
  Search,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';

// Mock data for fee plans
const feePlans = [
  {
    id: 1,
    name: 'Basic Monthly Fee',
    amount: 50,
    type: 'Recurring',
    frequency: 'Monthly',
    assignedTo: 'All Students',
  },
  {
    id: 2,
    name: 'Registration Fee',
    amount: 100,
    type: 'One-time',
    frequency: '-',
    assignedTo: 'New Students',
  },
];

// Enhanced mock data
const groups = [
  { id: 1, name: 'Batch A' },
  { id: 2, name: 'Batch B' },
  { id: 3, name: 'Batch C' },
];

const students = [
  { id: 1, name: 'Aarav Kumar', group: 'Batch A' },
  { id: 2, name: 'Zara Patel', group: 'Batch A' },
  { id: 3, name: 'Riya Singh', group: 'Batch B' },
  { id: 4, name: 'Arjun Sharma', group: 'Batch B' },
  { id: 5, name: 'Anaya Mehta', group: 'Batch C' },
];

const paymentRecords = [
  {
    id: 1,
    student: "Aarav Kumar",
    group: "Batch A",
    amount: 1500,
    dueDate: "2024-06-10",
    status: "Unpaid",
    feeType: "Monthly Fee",
  },
  {
    id: 2,
    student: "Zara Patel",
    group: "Batch A",
    amount: 1500,
    dueDate: "2024-06-10",
    status: "Paid",
    paidDate: "2024-06-08",
    method: "Credit Card",
    feeType: "Monthly Fee",
  },
  {
    id: 3,
    student: "Riya Singh",
    group: "Batch B",
    amount: 2000,
    dueDate: "2024-06-15",
    status: "Overdue",
    feeType: "Registration Fee",
  },
];

const Payments = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openNewFee, setOpenNewFee] = useState(false);
  const [openPaymentUpdate, setOpenPaymentUpdate] = useState(false);
  const [openAssignFee, setOpenAssignFee] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {/* Enhanced Header Section */}
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
          Payments Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage fee plans and track payment records efficiently
        </Typography>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAssignFee(true)}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 2,
            background: 'linear-gradient(45deg, #22c55e, #16a34a)',
            '&:hover': {
              background: 'linear-gradient(45deg, #16a34a, #15803d)',
            },
          }}
        >
          Assign New Fee
        </Button>
        <Button
          variant="outlined"
          startIcon={<Receipt />}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Generate Reports
        </Button>
      </Box>

      {/* Enhanced Tabs Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              fontWeight: 600,
            },
          }}
        >
          <Tab
            label="Fee Plans"
            icon={<Receipt sx={{ mb: 0.5 }} />}
            iconPosition="start"
          />
          <Tab
            label="Payment Records"
            icon={<AttachMoney sx={{ mb: 0.5 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Fee Plans Tab */}
      {tabValue === 0 && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Active Fee Plans</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenNewFee(true)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              New Fee Plan
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feePlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>${plan.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={plan.type}
                        color={
                          plan.type === 'Recurring' ? 'primary' : 'secondary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{plan.frequency}</TableCell>
                    <TableCell>{plan.assignedTo}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Payment Records Tab */}
      {tabValue === 1 && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Payment History</Typography>
            <TextField
              size="small"
              placeholder="Search payments..."
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Box>

          <TableContainer component={Card} sx={{ mt: 3, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.student}</TableCell>
                    <TableCell>{record.group}</TableCell>
                    <TableCell>{record.feeType}</TableCell>
                    <TableCell>₹{record.amount}</TableCell>
                    <TableCell>{format(new Date(record.dueDate), 'PP')}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={
                          record.status === 'Paid'
                            ? 'success'
                            : record.status === 'Overdue'
                            ? 'error'
                            : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color={record.status === 'Paid' ? 'success' : 'primary'}
                        onClick={() => setOpenPaymentUpdate(true)}
                        disabled={record.status === 'Paid'}
                      >
                        {record.status === 'Paid' ? 'Paid' : 'Mark as Paid'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Enhanced Dialogs */}
      <Dialog
        open={openNewFee}
        onClose={() => setOpenNewFee(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle>Create New Fee Plan</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fee Name"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Fee Type"
                variant="outlined"
                size="small"
              >
                <MenuItem value="one-time">One-time</MenuItem>
                <MenuItem value="recurring">Recurring</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewFee(false)}>Cancel</Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPaymentUpdate}
        onClose={() => setOpenPaymentUpdate(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                variant="outlined"
                size="small"
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                variant="outlined"
                size="small"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit-card">Credit Card</MenuItem>
                <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentUpdate(false)}>Cancel</Button>
          <Button variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Fee Dialog */}
      <Dialog
        open={openAssignFee}
        onClose={() => setOpenAssignFee(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Assign New Fee
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.name}>
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Students"
                SelectProps={{ multiple: true }}
                value={selectedStudents}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
                }}
              >
                {students
                  .filter((s) => !selectedGroup || s.group === selectedGroup)
                  .map((student) => (
                    <MenuItem key={student.id} value={student.name}>
                      {student.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                InputProps={{
                  startAdornment: <Typography color="textSecondary">₹</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Frequency"
                defaultValue="one-time"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="one-time">One-Time</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAssignFee(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              px: 3,
              background: 'linear-gradient(45deg, #22c55e, #16a34a)',
              '&:hover': {
                background: 'linear-gradient(45deg, #16a34a, #15803d)',
              },
            }}
          >
            Assign Fee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;