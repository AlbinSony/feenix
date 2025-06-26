import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Paper,
} from '@mui/material';
import { useState } from 'react';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Schedule,
  Receipt,
  AttachMoney,
  Search,
} from '@mui/icons-material';

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

// Mock data for payment records
const paymentRecords = [
  {
    id: 1,
    studentName: 'John Doe',
    feeType: 'Basic Monthly Fee',
    amount: 50,
    dueDate: '2024-02-15',
    status: 'Paid',
    paidDate: '2024-02-10',
    method: 'Credit Card',
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    feeType: 'Registration Fee',
    amount: 100,
    dueDate: '2024-02-01',
    status: 'Overdue',
    paidDate: '-',
    method: '-',
  },
];

const Payments = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openNewFee, setOpenNewFee] = useState(false);
  const [openPaymentUpdate, setOpenPaymentUpdate] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell>{record.feeType}</TableCell>
                    <TableCell>${record.amount}</TableCell>
                    <TableCell>{record.dueDate}</TableCell>
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
                        icon={
                          record.status === 'Paid' ? (
                            <CheckCircle />
                          ) : record.status === 'Overdue' ? (
                            <Warning />
                          ) : (
                            <Schedule />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{record.paidDate}</TableCell>
                    <TableCell>{record.method}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setOpenPaymentUpdate(true)}
                      >
                        Update Status
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
    </Box>
  );
};

export default Payments;