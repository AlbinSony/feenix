import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  InputAdornment, 
  Avatar, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Alert,
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  CurrencyRupee as RupeeIcon,
  Group as GroupIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { groupApi, Group } from '../services/groupApi';
import { studentApi } from '../services/studentApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { paymentRequestApi } from '../services/paymentRequestApi';
import { feePlanApi, FeePlan } from '../services/feePlanApi';

const PaymentGroups = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupFee, setNewGroupFee] = useState('');
  const [newGroupFrequency, setNewGroupFrequency] = useState<'Monthly' | 'One-Time' | 'Quarterly'>('Monthly');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [openPaymentRequestDialog, setOpenPaymentRequestDialog] = useState(false);
  const [selectedGroupForPayment, setSelectedGroupForPayment] = useState<Group | null>(null);
  const [paymentRequestData, setPaymentRequestData] = useState({
    feePlan: '',
    dueDate: null as Date | null,
  });
  const [createPaymentLoading, setCreatePaymentLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
      fetchTotalStudents();
      fetchFeePlans();
    }
  }, [isAuthenticated]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await groupApi.getAll();
      
      // Ensure all groups have default values for the summary calculations
      const groupsWithDefaults = data.map(group => ({
        ...group,
        students: group.students || 0,
        collected: group.collected || 0,
        dues: group.dues || 0
      }));
      
      setGroups(groupsWithDefaults);
    } catch (err: any) {
      setError(err.message || 'Failed to load groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalStudents = async () => {
    try {
      const students = await studentApi.getAll();
      setTotalStudentsCount(students.length);
    } catch (err: any) {
      console.error('Error fetching students count:', err);
      // Don't show error for students count, just log it
    }
  };

  const fetchFeePlans = async () => {
    try {
      const data = await feePlanApi.getAll();
      setFeePlans(data);
    } catch (err: any) {
      console.error('Error fetching fee plans:', err);
    }
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary statistics
  const totalGroups = groups.length;
  const totalStudents = totalStudentsCount; // Use actual students count from API
  const totalCollected = groups.reduce((sum, group) => sum + (group.collected || 0), 0);

  const handleCreateNewGroup = async () => {
    if (!newGroupName.trim() || !newGroupFee) return;
    
    try {
      setCreateLoading(true);
      const newGroupData = {
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        fee: parseFloat(newGroupFee),
        frequency: newGroupFrequency,
      };
      
      const createdGroup = await groupApi.create(newGroupData);
      
      // Add the new group to the existing list with default values
      const groupWithDefaults = {
        ...createdGroup,
        students: createdGroup.students || 0,
        collected: createdGroup.collected || 0,
        dues: createdGroup.dues || 0
      };
      
      setGroups(prev => [...prev, groupWithDefaults]);
      
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupFee('');
      setNewGroupFrequency('Monthly');
      setOpenNewGroupDialog(false);
      toast.success('Group created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create group');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewGroup = (group: Group) => {
    console.log('Navigating to group detail:', group._id, group);
    navigate(`/groups/${group._id}`, { 
      state: { group },
      replace: false 
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, group: Group) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      setDeleteLoading(true);
      await groupApi.delete(selectedGroup._id);
      toast.success('Group deleted successfully');
      handleMenuClose();
      
      // Refresh both groups and students count
      await fetchGroups();
      await fetchTotalStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete group');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateGroupPaymentRequest = (group: Group) => {
    setSelectedGroupForPayment(group);
    setOpenPaymentRequestDialog(true);
  };

  const handleCreatePaymentRequests = async () => {
    if (!selectedGroupForPayment || !paymentRequestData.dueDate) {
      toast.error('Please select due date');
      return;
    }

    try {
      setCreatePaymentLoading(true);
      
      // Get all students in the group
      const allStudents = await studentApi.getAll();
      const groupStudents = allStudents.filter(student => 
        student.group._id === selectedGroupForPayment._id
      );

      if (groupStudents.length === 0) {
        toast.error('No students found in this group');
        return;
      }

      // Create payment requests for each student
      const requests = groupStudents.map(student => ({
        student: student._id,
        feePlan: paymentRequestData.feePlan || undefined, // Send undefined instead of empty string
        dueDate: format(paymentRequestData.dueDate!, 'yyyy-MM-dd'),
      }));

      // Create requests one by one
      for (const request of requests) {
        await paymentRequestApi.create(request);
      }
      
      toast.success(`Payment requests created for ${groupStudents.length} students`);
      setOpenPaymentRequestDialog(false);
      setPaymentRequestData({ feePlan: '', dueDate: null });
      setSelectedGroupForPayment(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create payment requests');
    } finally {
      setCreatePaymentLoading(false);
    }
  };

  // Add refresh function to be called when returning from GroupDetail
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchGroups();
        fetchTotalStudents();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <GroupIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{totalGroups}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Groups</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{totalStudents}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Students</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <RupeeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">₹{totalCollected.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Collected</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Group Management
          </Typography>
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewGroupDialog(true)}
          >
            New Group
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search groups..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Group Cards */}
        <Grid container spacing={3}>
          {filteredGroups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card sx={{ 
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                      mr: 2
                    }}>
                      {group.name.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6">{group.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {group.description || 'No description'}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, group)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Fee:</Typography>
                      <Typography variant="body2">₹{group.fee}/{group.frequency}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Students:</Typography>
                      <Typography variant="body2">{group.students}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Collected:</Typography>
                      <Typography variant="body2" color="success.main">
                        ₹{group.collected.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Dues:</Typography>
                      <Typography variant="body2" color="error.main">
                        ₹{group.dues.toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleViewGroup(group)}
                      sx={{ flex: 2 }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateGroupPaymentRequest(group);
                      }}
                      sx={{ 
                        flex: 1,
                        minWidth: 'auto',
                        px: 1
                      }}
                      title="Create Payment Request"
                    >
                      Payment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredGroups.length === 0 && !loading && (
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              mt: 2
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? 'No groups found' : 'No groups created yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchQuery ? 'Try a different search term or create a new group' : 'Create your first group to get started'}
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              sx={{ mt: 2 }}
              onClick={() => setOpenNewGroupDialog(true)}
            >
              Create New Group
            </Button>
          </Box>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuList>
            <MenuItem
              onClick={() => {
                if (selectedGroup) {
                  handleViewGroup(selectedGroup);
                }
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <ArrowForwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleDeleteGroup}
              disabled={deleteLoading}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                {deleteLoading ? (
                  <CircularProgress size={20} color="error" />
                ) : (
                  <DeleteIcon fontSize="small" color="error" />
                )}
              </ListItemIcon>
              <ListItemText>Delete Group</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* New Group Dialog */}
        <Dialog open={openNewGroupDialog} onClose={() => setOpenNewGroupDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Create New Group
              <IconButton onClick={() => setOpenNewGroupDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Group Name"
                  fullWidth
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fee Amount"
                  fullWidth
                  type="number"
                  required
                  value={newGroupFee}
                  onChange={(e) => setNewGroupFee(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Frequency</InputLabel>
                  <Select
                    value={newGroupFrequency}
                    label="Payment Frequency"
                    onChange={(e) => setNewGroupFrequency(e.target.value as 'Monthly' | 'One-Time' | 'Quarterly')}
                  >
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="One-Time">One-Time</MenuItem>
                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewGroupDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNewGroup} 
              variant="contained"
              disabled={!newGroupName.trim() || !newGroupFee || createLoading}
            >
              {createLoading ? <CircularProgress size={20} /> : 'Create Group'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Group Payment Request Dialog */}
        <Dialog
          open={openPaymentRequestDialog}
          onClose={() => setOpenPaymentRequestDialog(false)}
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
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Create Payment Request for {selectedGroupForPayment?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  This will create payment requests for all students in this group.
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenPaymentRequestDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Fee Plan</InputLabel>
                  <Select
                    value={paymentRequestData.feePlan}
                    label="Fee Plan"
                    onChange={(e) => setPaymentRequestData(prev => ({ ...prev, feePlan: e.target.value }))}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected || selected === '') {
                        return `Use Group Default (₹${selectedGroupForPayment?.fee} - ${selectedGroupForPayment?.frequency})`;
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
                          Use Group Default
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          ₹{selectedGroupForPayment?.fee} - {selectedGroupForPayment?.frequency} plan
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
                            ₹{plan.amount} - {plan.frequency} plan
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
                  value={paymentRequestData.dueDate}
                  onChange={(newValue) => setPaymentRequestData(prev => ({ ...prev, dueDate: newValue }))}
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
            <Button onClick={() => setOpenPaymentRequestDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreatePaymentRequests}
              disabled={createPaymentLoading || !paymentRequestData.dueDate}
              sx={{
                px: 3,
                background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #16a34a, #15803d)',
                },
              }}
            >
              {createPaymentLoading ? <CircularProgress size={20} /> : 'Create Requests'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default PaymentGroups;