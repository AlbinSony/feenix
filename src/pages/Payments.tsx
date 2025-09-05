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
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
  Add,
  Edit,
  Delete,
  Receipt,
  AttachMoney,
  Search,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { feePlanApi, FeePlan, CreateFeePlanData } from '../services/feePlanApi';
import { paymentRequestApi, PaymentRequest, CreatePaymentRequestData } from '../services/paymentRequestApi';
import { studentApi, Student } from '../services/studentApi';
import { groupApi, Group } from '../services/groupApi';
import { useAuth } from '../context/AuthContext';

const Payments = () => {
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // State for fee plans
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [feePlansLoading, setFeePlansLoading] = useState(true);
  
  // State for payment requests
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [paymentRequestsLoading, setPaymentRequestsLoading] = useState(true);
  
  // State for students and groups
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  
  // Dialog states
  const [openNewFee, setOpenNewFee] = useState(false);
  const [openPaymentUpdate, setOpenPaymentUpdate] = useState(false);
  const [openCreateRequest, setOpenCreateRequest] = useState(false);
  const [openEditFee, setOpenEditFee] = useState(false);
  
  // Form states
  const [newFeePlan, setNewFeePlan] = useState<CreateFeePlanData>({
    name: '',
    amount: 0,
    frequency: 'Monthly',
  });
  const [editingFeePlan, setEditingFeePlan] = useState<FeePlan | null>(null);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<PaymentRequest | null>(null);
  const [paymentUpdateData, setPaymentUpdateData] = useState({
    status: 'Paid' as 'Pending' | 'Paid' | 'Overdue',
    paidAt: format(new Date(), 'yyyy-MM-dd'),
  });
  
  // Create request form
  const [createRequestData, setCreateRequestData] = useState({
    selectedStudents: [] as string[],
    feePlan: '',
    dueDate: null as Date | null,
    selectedGroup: '',
  });
  
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchFeePlans();
      fetchPaymentRequests();
      fetchStudents();
      fetchGroups();
    }
  }, [isAuthenticated]);

  const fetchFeePlans = async () => {
    try {
      setFeePlansLoading(true);
      const data = await feePlanApi.getAll();
      setFeePlans(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load fee plans');
    } finally {
      setFeePlansLoading(false);
    }
  };

  const fetchPaymentRequests = async () => {
    try {
      setPaymentRequestsLoading(true);
      const data = await paymentRequestApi.getAll();
      setPaymentRequests(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load payment requests');
    } finally {
      setPaymentRequestsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err: any) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await groupApi.getAll();
      setGroups(data);
    } catch (err: any) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleCreateFeePlan = async () => {
    if (!newFeePlan.name || !newFeePlan.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreateLoading(true);
      await feePlanApi.create(newFeePlan);
      toast.success('Fee plan created successfully');
      setOpenNewFee(false);
      setNewFeePlan({ name: '', amount: 0, frequency: 'Monthly' });
      fetchFeePlans();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create fee plan');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditFeePlan = (feePlan: FeePlan) => {
    setEditingFeePlan(feePlan);
    setNewFeePlan({
      name: feePlan.name,
      amount: feePlan.amount,
      frequency: feePlan.frequency,
    });
    setOpenEditFee(true);
  };

  const handleUpdateFeePlan = async () => {
    if (!editingFeePlan) return;

    try {
      setCreateLoading(true);
      await feePlanApi.update(editingFeePlan._id, newFeePlan);
      toast.success('Fee plan updated successfully');
      setOpenEditFee(false);
      setEditingFeePlan(null);
      setNewFeePlan({ name: '', amount: 0, frequency: 'Monthly' });
      fetchFeePlans();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update fee plan');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteFeePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fee plan?')) return;

    try {
      await feePlanApi.delete(id);
      toast.success('Fee plan deleted successfully');
      fetchFeePlans();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete fee plan');
    }
  };

  const handleCreatePaymentRequests = async () => {
    if (!createRequestData.selectedStudents.length || !createRequestData.dueDate) {
      toast.error('Please select students and due date');
      return;
    }

    try {
      setCreateLoading(true);
      const requests: CreatePaymentRequestData[] = createRequestData.selectedStudents.map(studentId => ({
        student: studentId,
        feePlan: createRequestData.feePlan || undefined, // Send undefined instead of empty string
        dueDate: format(createRequestData.dueDate!, 'yyyy-MM-dd'),
      }));

      if (requests.length === 1) {
        await paymentRequestApi.create(requests[0]);
      } else {
        for (const request of requests) {
          await paymentRequestApi.create(request);
        }
      }

      toast.success(`Payment request${requests.length > 1 ? 's' : ''} created successfully`);
      setOpenCreateRequest(false);
      setCreateRequestData({
        selectedStudents: [],
        feePlan: '',
        dueDate: null,
        selectedGroup: '',
      });
      fetchPaymentRequests();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create payment requests');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedPaymentRequest) return;

    try {
      setCreateLoading(true);
      await paymentRequestApi.update(selectedPaymentRequest._id, paymentUpdateData);
      toast.success('Payment status updated successfully');
      setOpenPaymentUpdate(false);
      setSelectedPaymentRequest(null);
      fetchPaymentRequests();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update payment status');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStudentSelectionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setCreateRequestData(prev => ({
      ...prev,
      selectedStudents: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const filteredStudents = students.filter(student => 
    !createRequestData.selectedGroup || student.group._id === createRequestData.selectedGroup
  );

  const filteredPaymentRequests = paymentRequests.filter(request => {
    const studentName = request.student?.name?.toLowerCase() || '';
    const feePlanName = request.feePlan?.name?.toLowerCase() || '';
    const groupName = request.student?.group?.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return studentName.includes(query) || feePlanName.includes(query) || groupName.includes(query);
  });

  const handleGenerateReports = () => {
    // Create CSV data
    const csvData = [
      ['Student Name', 'Group', 'Fee Plan', 'Amount', 'Due Date', 'Status', 'Created Date']
    ];
    
    filteredPaymentRequests.forEach(request => {
      csvData.push([
        request.student?.name || 'Unknown',
        request.student?.group?.name || 'No Group',
        request.feePlan?.name || 'Unknown Plan',
        `₹${request.feePlan?.amount || 0}`,
        request.dueDate ? format(new Date(request.dueDate), 'PP') : 'No Date',
        request.status || 'Unknown',
        format(new Date(request.createdAt), 'PP')
      ]);
    });

    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report generated and downloaded successfully');
  };

  if (feePlansLoading && paymentRequestsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading payments data...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

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
            onClick={() => setOpenCreateRequest(true)}
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
            Create Payment Request
          </Button>
          <Button
            variant="outlined"
            startIcon={<Receipt />}
            onClick={handleGenerateReports}
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
              label="Payment Requests"
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
              <Typography variant="h6">Fee Plans ({feePlans.length})</Typography>
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

            {feePlansLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feePlans.map((plan) => (
                      <TableRow key={plan._id}>
                        <TableCell>{plan.name}</TableCell>
                        <TableCell>₹{plan.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={plan.frequency}
                            color={plan.frequency === 'Monthly' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{format(new Date(plan.createdAt), 'PP')}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditFeePlan(plan)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteFeePlan(plan._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        )}

        {/* Payment Requests Tab */}
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
              <Typography variant="h6">Payment Requests ({paymentRequests.length})</Typography>
              <TextField
                size="small"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 250 }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Box>

            {paymentRequestsLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Fee Plan</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPaymentRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            {searchQuery ? 'No payment requests found' : 'No payment requests created yet'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPaymentRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>{request.student?.name || 'Unknown Student'}</TableCell>
                          <TableCell>
                            {request.student?.group?.name ? (
                              <Chip
                                label={request.student.group.name}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No Group
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.feePlan?.name ? (
                              request.feePlan.name
                            ) : (
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  Group Default
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {request.group ? 
                                    `₹${request.group.fee} - ${request.group.frequency}` : 
                                    request.student?.group ? 
                                    `₹${request.student.group.fee} - ${request.student.group.frequency}` :
                                    'Unknown Plan'
                                  }
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            ₹{request.amount || request.feePlan?.amount || request.student?.group?.fee || 0}
                          </TableCell>
                          <TableCell>
                            {request.dueDate ? format(new Date(request.dueDate), 'PP') : 'No Due Date'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={request.status || 'Unknown'}
                              color={
                                request.status === 'Paid'
                                  ? 'success'
                                  : request.status === 'Overdue'
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
                              color={request.status === 'Paid' ? 'success' : 'primary'}
                              onClick={() => {
                                setSelectedPaymentRequest(request);
                                setOpenPaymentUpdate(true);
                              }}
                              disabled={request.status === 'Paid'}
                            >
                              {request.status === 'Paid' ? 'Paid' : 'Update Status'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        )}

        {/* Create/Edit Fee Plan Dialog */}
        <Dialog
          open={openNewFee || openEditFee}
          onClose={() => {
            setOpenNewFee(false);
            setOpenEditFee(false);
            setEditingFeePlan(null);
            setNewFeePlan({ name: '', amount: 0, frequency: 'Monthly' });
          }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 3,
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {editingFeePlan ? 'Edit Fee Plan' : 'Create New Fee Plan'}
              <IconButton onClick={() => {
                setOpenNewFee(false);
                setOpenEditFee(false);
                setEditingFeePlan(null);
              }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ minWidth: 400 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fee Plan Name"
                  variant="outlined"
                  value={newFeePlan.name}
                  onChange={(e) => setNewFeePlan(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  variant="outlined"
                  value={newFeePlan.amount}
                  onChange={(e) => setNewFeePlan(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  InputProps={{
                    startAdornment: <Typography color="textSecondary">₹</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Frequency"
                  variant="outlined"
                  value={newFeePlan.frequency}
                  onChange={(e) => setNewFeePlan(prev => ({ ...prev, frequency: e.target.value as any }))}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="One-time">One-time</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenNewFee(false);
              setOpenEditFee(false);
              setEditingFeePlan(null);
            }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={editingFeePlan ? handleUpdateFeePlan : handleCreateFeePlan}
              disabled={createLoading}
            >
              {createLoading ? <CircularProgress size={20} /> : (editingFeePlan ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Payment Request Dialog */}
        <Dialog
          open={openCreateRequest}
          onClose={() => setOpenCreateRequest(false)}
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Create Payment Request
              </Typography>
              <IconButton onClick={() => setOpenCreateRequest(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Group (Optional)"
                  value={createRequestData.selectedGroup}
                  onChange={(e) => setCreateRequestData(prev => ({
                    ...prev,
                    selectedGroup: e.target.value,
                    selectedStudents: [], // Reset selected students when group changes
                  }))}
                >
                  <MenuItem value="">All Groups</MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Students</InputLabel>
                  <Select
                    multiple
                    value={createRequestData.selectedStudents}
                    onChange={handleStudentSelectionChange}
                    renderValue={(selected) => {
                      const selectedNames = students
                        .filter(s => selected.includes(s._id))
                        .map(s => s.name);
                      return selectedNames.join(', ');
                    }}
                  >
                    {filteredStudents.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        <Checkbox checked={createRequestData.selectedStudents.includes(student._id)} />
                        <ListItemText primary={`${student.name} (${student.group?.name || 'No Group'})`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Fee Plan</InputLabel>
                  <Select
                    value={createRequestData.feePlan}
                    label="Fee Plan"
                    onChange={(e) => setCreateRequestData(prev => ({ ...prev, feePlan: e.target.value }))}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected || selected === '') {
                        // Show group default info if students are selected
                        if (createRequestData.selectedStudents.length > 0) {
                          const firstStudent = students.find(s => s._id === createRequestData.selectedStudents[0]);
                          if (firstStudent?.group) {
                            return `Use Group Default (₹${firstStudent.group.fee} - ${firstStudent.group.frequency})`;
                          }
                        }
                        return "Use Group Default Fee";
                      }
                      const plan = feePlans.find(p => p._id === selected);
                      return plan ? `${plan.name} - ₹${plan.amount} (${plan.frequency})` : selected;
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          '& .MuiMenuItem-root': {
                            minHeight: 60,
                            alignItems: 'flex-start',
                            py: 1.5,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Typography variant="body1" fontWeight="600" color="primary.main">
                          Use Group Default Fee
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {createRequestData.selectedStudents.length > 0 ? (() => {
                            const firstStudent = students.find(s => s._id === createRequestData.selectedStudents[0]);
                            if (firstStudent?.group) {
                              return `₹${firstStudent.group.fee} - ${firstStudent.group.frequency} plan`;
                            }
                            return "Will use each student's group fee plan";
                          })() : "Will use each student's group fee plan"}
                        </Typography>
                      </Box>
                    </MenuItem>
                    {feePlans.map((plan) => (
                      <MenuItem key={plan._id} value={plan._id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Typography variant="body1" fontWeight="500">
                            {plan.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            ₹{plan.amount} ({plan.frequency})
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="Due Date"
                  value={createRequestData.dueDate}
                  onChange={(newValue) => setCreateRequestData(prev => ({ ...prev, dueDate: newValue }))}
                  slotProps={{
                    textField: { 
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenCreateRequest(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreatePaymentRequests}
              disabled={createLoading || !createRequestData.selectedStudents.length || !createRequestData.dueDate}
              sx={{
                px: 3,
                background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #16a34a, #15803d)',
                },
              }}
            >
              {createLoading ? <CircularProgress size={20} /> : 'Create Request'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Payment Status Dialog */}
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
                  value={paymentUpdateData.status}
                  onChange={(e) => setPaymentUpdateData(prev => ({ 
                    ...prev, 
                    status: e.target.value as 'Pending' | 'Paid' | 'Overdue' 
                  }))}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </TextField>
              </Grid>
              {paymentUpdateData.status === 'Paid' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Date"
                    type="date"
                    variant="outlined"
                    value={paymentUpdateData.paidAt}
                    onChange={(e) => setPaymentUpdateData(prev => ({ ...prev, paidAt: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPaymentUpdate(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleUpdatePaymentStatus}
              disabled={createLoading}
            >
              {createLoading ? <CircularProgress size={20} /> : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Payments;