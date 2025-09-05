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
  TablePagination,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
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
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
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

  // New state for pagination, sorting, and view
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentRowsPerPage, setPaymentRowsPerPage] = useState(10);
  const [paymentSortBy, setPaymentSortBy] = useState<'student' | 'group' | 'amount' | 'dueDate' | 'status'>('dueDate');
  const [paymentSortOrder, setPaymentSortOrder] = useState<'asc' | 'desc'>('desc');
  const [paymentViewMode, setPaymentViewMode] = useState<'table' | 'grid'>('table');

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

  // Sorting function for payment requests
  const handlePaymentSort = (property: 'student' | 'group' | 'amount' | 'dueDate' | 'status') => {
    const isAsc = paymentSortBy === property && paymentSortOrder === 'asc';
    setPaymentSortOrder(isAsc ? 'desc' : 'asc');
    setPaymentSortBy(property);
  };

  // Process payment requests with sorting
  const processedPaymentRequests = filteredPaymentRequests
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (paymentSortBy) {
        case 'student':
          aValue = (a.student?.name || '').toLowerCase();
          bValue = (b.student?.name || '').toLowerCase();
          break;
        case 'group':
          aValue = (a.student?.group?.name || '').toLowerCase();
          bValue = (b.student?.group?.name || '').toLowerCase();
          break;
        case 'amount':
          aValue = a.amount || a.feePlan?.amount || a.student?.group?.fee || 0;
          bValue = b.amount || b.feePlan?.amount || b.student?.group?.fee || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        default:
          aValue = (a.student?.name || '').toLowerCase();
          bValue = (b.student?.name || '').toLowerCase();
      }
      
      if (paymentSortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Paginated payment requests
  const paginatedPaymentRequests = processedPaymentRequests.slice(
    paymentPage * paymentRowsPerPage,
    paymentPage * paymentRowsPerPage + paymentRowsPerPage
  );

  const handlePaymentPageChange = (_event: unknown, newPage: number) => {
    setPaymentPage(newPage);
  };

  const handlePaymentRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentRowsPerPage(parseInt(event.target.value, 10));
    setPaymentPage(0);
  };

  const handlePaymentViewModeChange = (_event: React.MouseEvent<HTMLElement>, newViewMode: 'table' | 'grid') => {
    if (newViewMode !== null) {
      setPaymentViewMode(newViewMode);
    }
  };

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
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography variant="h6">Payment Requests ({processedPaymentRequests.length})</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                />
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={paymentSortBy}
                    label="Sort By"
                    onChange={(e) => setPaymentSortBy(e.target.value as any)}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="dueDate">Due Date</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                  </Select>
                </FormControl>

                <ToggleButtonGroup
                  value={paymentViewMode}
                  exclusive
                  onChange={handlePaymentViewModeChange}
                  size="small"
                >
                  <ToggleButton value="table">
                    <Tooltip title="Table View">
                      <ViewListIcon />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="grid">
                    <Tooltip title="Grid View">
                      <ViewModuleIcon />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="outlined"
                  onClick={() => setPaymentSortOrder(paymentSortOrder === 'asc' ? 'desc' : 'asc')}
                  size="small"
                >
                  {paymentSortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </Box>
            </Box>

            {paymentRequestsLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={30} />
              </Box>
            ) : paymentViewMode === 'table' ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={paymentSortBy === 'student'}
                            direction={paymentSortBy === 'student' ? paymentSortOrder : 'asc'}
                            onClick={() => handlePaymentSort('student')}
                          >
                            Student
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={paymentSortBy === 'group'}
                            direction={paymentSortBy === 'group' ? paymentSortOrder : 'asc'}
                            onClick={() => handlePaymentSort('group')}
                          >
                            Group
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Fee Plan</TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={paymentSortBy === 'amount'}
                            direction={paymentSortBy === 'amount' ? paymentSortOrder : 'asc'}
                            onClick={() => handlePaymentSort('amount')}
                          >
                            Amount
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={paymentSortBy === 'dueDate'}
                            direction={paymentSortBy === 'dueDate' ? paymentSortOrder : 'asc'}
                            onClick={() => handlePaymentSort('dueDate')}
                          >
                            Due Date
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={paymentSortBy === 'status'}
                            direction={paymentSortBy === 'status' ? paymentSortOrder : 'asc'}
                            onClick={() => handlePaymentSort('status')}
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPaymentRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              {searchQuery ? 'No payment requests found' : 'No payment requests created yet'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedPaymentRequests.map((request) => (
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
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={processedPaymentRequests.length}
                  rowsPerPage={paymentRowsPerPage}
                  page={paymentPage}
                  onPageChange={handlePaymentPageChange}
                  onRowsPerPageChange={handlePaymentRowsPerPageChange}
                  labelRowsPerPage="Requests per page:"
                />
              </>
            ) : (
              // Grid View for Payment Requests
              <>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    {paginatedPaymentRequests.map((request) => (
                      <Grid item xs={12} sm={6} md={4} key={request._id}>
                        <Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Typography variant="h6" fontSize="1rem">
                              {request.student?.name || 'Unknown Student'}
                            </Typography>
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
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            {request.student?.group?.name && (
                              <Chip
                                label={request.student.group.name}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ mb: 1 }}
                              />
                            )}
                            <Typography variant="body2" color="text.secondary">
                              Amount: ₹{request.amount || request.feePlan?.amount || request.student?.group?.fee || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {request.dueDate ? format(new Date(request.dueDate), 'PP') : 'No Due Date'}
                            </Typography>
                          </Box>

                          <Button
                            fullWidth
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
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ px: 2, pb: 2 }}>
                  <TablePagination
                    rowsPerPageOptions={[6, 12, 24, 48]}
                    component="div"
                    count={processedPaymentRequests.length}
                    rowsPerPage={paymentRowsPerPage}
                    page={paymentPage}
                    onPageChange={handlePaymentPageChange}
                    onRowsPerPageChange={handlePaymentRowsPerPageChange}
                    labelRowsPerPage="Requests per page:"
                  />
                </Box>
              </>
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
              margin: { xs: 1, sm: 3 },
              width: { xs: 'calc(100vw - 16px)', sm: 'auto' },
              maxHeight: { xs: 'calc(100vh - 32px)', sm: '90vh' },
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
          <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
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
                    onChange={(e) => setCreateRequestData(prev => ({ ...prev, feePlan: e.target.value }))
                    }
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
                    sx={{
                      '& .MuiSelect-select': {
                        minHeight: '20px !important',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiInputLabel-root': {
                        position: 'absolute',
                        top: 0,
                        left: 14,
                        transform: 'translate(0, 16px) scale(1)',
                        transformOrigin: 'top left',
                        transition: 'all 0.2s ease-out',
                        zIndex: 1,
                        pointerEvents: 'none',
                        '&.MuiInputLabel-shrink': {
                          transform: 'translate(0, -6px) scale(0.75)',
                          backgroundColor: 'white',
                          padding: '0 4px',
                        },
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ minHeight: '60px !important' }}>
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
                      <MenuItem key={plan._id} value={plan._id} sx={{ minHeight: '60px !important' }}>
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
          <DialogActions sx={{ p: { xs: 2, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
            <Button 
              onClick={() => setOpenCreateRequest(false)}
              sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreatePaymentRequests}
              disabled={createLoading || !createRequestData.selectedStudents.length || !createRequestData.dueDate}
              sx={{
                order: { xs: 1, sm: 2 },
                width: { xs: '100%', sm: 'auto' },
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
              margin: { xs: 1, sm: 3 },
              width: { xs: 'calc(100vw - 16px)', sm: 'auto' },
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
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 }, p: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={() => setOpenPaymentUpdate(false)}
              sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleUpdatePaymentStatus}
              disabled={createLoading}
              sx={{ order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}
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