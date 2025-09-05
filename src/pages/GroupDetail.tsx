import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  useTheme,
  alpha,
  InputAdornment,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineItemClasses,
} from '@mui/lab';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CurrencyRupee as RupeeIcon,
  Assessment as AssessmentIcon,
  TimelineOutlined as TimelineIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { groupApi, Group } from '../services/groupApi';
import { studentApi, Student } from '../services/studentApi';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';


interface PaymentEvent {
  id: number;
  type: 'payment' | 'reminder' | 'member_added' | 'fee_updated';
  date: string;
  description: string;
  amount?: number;
  status?: 'completed' | 'pending' | 'failed';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const GroupDetail = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [editedGroupDetails, setEditedGroupDetails] = useState({
    name: '',
    description: '',
    fee: 0,
    frequency: 'Monthly' as 'Monthly' | 'One-Time' | 'Quarterly',
  });

  const [groupStudents, setGroupStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [createStudentLoading, setCreateStudentLoading] = useState(false);

  const [newStudentData, setNewStudentData] = useState({
    name: '',
    phone: '',
    feePlan: 'Monthly' as 'Monthly' | 'One-Time' | 'Quarterly' | 'Yearly' | 'Weekly',
    startDate: new Date(),
  });

  const [] = useState<PaymentEvent[]>([
    {
      id: 1,
      type: 'member_added',
      date: new Date().toISOString().split('T')[0],
      description: 'Group created successfully',
    },
  ]);

  useEffect(() => {
    console.log('GroupDetail useEffect triggered', { isAuthenticated, id, locationState: location.state });
    if (isAuthenticated && id) {
      fetchGroupDetails();
    } else if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, id, navigate]);

  useEffect(() => {
    if (groupDetails) {
      setEditedGroupDetails({
        name: groupDetails.name,
        description: groupDetails.description,
        fee: groupDetails.fee,
        frequency: groupDetails.frequency,
      });
    }
  }, [groupDetails]);

  useEffect(() => {
    if (groupDetails && tabValue === 0) {
      fetchGroupStudents();
    }
  }, [groupDetails, tabValue]);

  const fetchGroupDetails = async () => {
    if (!id) {
      navigate('/groups');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Try to get from location state first, then from API
      if (location.state?.group) {
        console.log('Using group from location state:', location.state.group);
        setGroupDetails(location.state.group);
        setLoading(false);
      } else {
        console.log('Fetching group from API for id:', id);
        const group = await groupApi.getById(id);
        console.log('Received group from API:', group);
        setGroupDetails(group);
      }
    } catch (err: any) {
      console.error('Error fetching group:', err);
      setError(err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupStudents = async () => {
    if (!groupDetails) return;
    
    try {
      setStudentsLoading(true);
      const allStudents = await studentApi.getAll();
      const filteredStudents = allStudents.filter(student => student.group._id === groupDetails._id);
      setGroupStudents(filteredStudents);
    } catch (err: any) {
      console.error('Error fetching group students:', err);
      setError('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveGroupDetails = async () => {
    if (!groupDetails || !id) return;

    try {
      setSaving(true);
      setError('');

      const updatedGroup = await groupApi.update(id, {
        name: editedGroupDetails.name,
        description: editedGroupDetails.description,
        fee: editedGroupDetails.fee,
        frequency: editedGroupDetails.frequency,
      });

      setGroupDetails(updatedGroup);
      setOpenEditGroup(false);
      toast.success('Group updated successfully');
      
      // Refresh group data to ensure consistency
      await fetchGroupDetails();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update group');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStudent = async () => {
    if (!groupDetails || !newStudentData.name.trim() || !newStudentData.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreateStudentLoading(true);
      setError('');

      const studentData = {
        name: newStudentData.name.trim(),
        phone: newStudentData.phone.trim(),
        group: groupDetails._id,
        feePlan: newStudentData.feePlan,
        startDate: format(newStudentData.startDate, 'yyyy-MM-dd'),
      };

      await studentApi.create(studentData);
      
      // Reset form
      setNewStudentData({
        name: '',
        phone: '',
        feePlan: 'Monthly',
        startDate: new Date(),
      });
      setOpenAddMember(false);
      toast.success('Student added successfully');
      
      // Refresh both group details and students list
      await Promise.all([
        fetchGroupDetails(),
        fetchGroupStudents()
      ]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add student');
    } finally {
      setCreateStudentLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await studentApi.delete(studentId);
      toast.success('Student removed successfully');
      
      // Refresh both group details and students list
      await Promise.all([
        fetchGroupDetails(),
        fetchGroupStudents()
      ]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove student');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteGroup = async () => {
    if (!groupDetails || !id) return;

    try {
      setDeleteLoading(true);
      await groupApi.delete(id);
      toast.success('Group deleted successfully');
      handleMenuClose();

      // Navigate back to groups list after successful deletion
      setTimeout(() => {
        navigate('/groups');
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete group');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add auto-refresh for real-time data updates
  useEffect(() => {
    if (!groupDetails) return;

    const interval = setInterval(() => {
      // Silently refresh data every 30 seconds
      fetchGroupDetails();
      if (tabValue === 0) {
        fetchGroupStudents();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [groupDetails, tabValue]);

  // Add refresh button to manually update data
  const handleRefreshData = async () => {
    setError('');
    await Promise.all([
      fetchGroupDetails(),
      tabValue === 0 ? fetchGroupStudents() : Promise.resolve()
    ]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading group details...</Typography>
      </Box>
    );
  }

  if (!groupDetails) {
    return (
      <Box>
        <Alert severity="error">
          Group not found. Please go back and try again.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/groups')}
          sx={{ mt: 2 }}
        >
          Back to Groups
        </Button>
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

        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => navigate('/groups')}
            sx={{ mr: 2 }}
            aria-label="back to groups"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {groupDetails.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {groupDetails.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {groupStudents.length} members · ₹{groupDetails.fee}/{groupDetails.frequency}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                onClick={handleRefreshData}
                disabled={loading || studentsLoading}
                size="small"
              >
                {(loading || studentsLoading) ? <CircularProgress size={16} /> : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setOpenEditGroup(true)}
              >
                Edit Group
              </Button>
              <Tooltip title="More actions">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: theme.palette.primary.light }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{groupStudents.length}</Typography>
                    <Typography variant="body2">Total Members</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: theme.palette.success.light }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <RupeeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">₹{(groupStudents.length * groupDetails.fee).toLocaleString()}</Typography>
                    <Typography variant="body2">Expected Collection</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: theme.palette.error.light }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                    <AssessmentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">₹{groupDetails.dues.toLocaleString()}</Typography>
                    <Typography variant="body2">Total Dues</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} /> Recent Activities
            </Typography>
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
                px: 0,
              }}
            >
              {/* Show group creation */}
              <TimelineItem>
                <TimelineOppositeContent sx={{ flex: 0.2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {new Date(groupDetails.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: 'primary.main', p: 1 }}>
                    <PersonIcon />
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: 'divider' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      Group "{groupDetails.name}" created
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Fee: ₹{groupDetails.fee}/{groupDetails.frequency}
                    </Typography>
                  </Card>
                </TimelineContent>
              </TimelineItem>
              
              {/* Show student additions */}
              {groupStudents.slice(0, 3).map((student, index) => (
                <TimelineItem key={student._id}>
                  <TimelineOppositeContent sx={{ flex: 0.2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {new Date(student.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'success.main', p: 1 }}>
                      <PersonIcon />
                    </TimelineDot>
                    {index < Math.min(groupStudents.length - 1, 2) && (
                      <TimelineConnector sx={{ bgcolor: 'divider' }} />
                    )}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        Student "{student.name}" added
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Phone: {student.phone} | Plan: {student.feePlan}
                      </Typography>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>

        <Card>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Members" />
            <Tab label="Payment Settings" />
            <Tab label="Group Settings" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <TextField
                  placeholder="Search students..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddMember(true)}
                >
                  Add Student
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Fee Plan</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <CircularProgress size={30} />
                        </TableCell>
                      </TableRow>
                    ) : groupStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No students in this group yet. Add students to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      groupStudents
                        .filter(student => 
                          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.phone.includes(searchQuery)
                        )
                        .map((student) => (
                          <TableRow key={student._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                  {student.name.charAt(0)}
                                </Avatar>
                                {student.name}
                              </Box>
                            </TableCell>
                            <TableCell>{student.phone}</TableCell>
                            <TableCell>{student.feePlan}</TableCell>
                            <TableCell>{format(new Date(student.startDate), 'PP')}</TableCell>
                            <TableCell>
                              <Chip
                                label="Active"
                                color="success"
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteStudent(student._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 2 }}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Payment Amount"
                        type="number"
                        value={editedGroupDetails.fee}
                        onChange={(e) =>
                          setEditedGroupDetails((prev) => ({
                            ...prev,
                            fee: parseFloat(e.target.value) || 0,
                          }))
                        }
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Payment Cycle"
                        select
                        value={editedGroupDetails.frequency}
                        onChange={(e) =>
                          setEditedGroupDetails((prev) => ({
                            ...prev,
                            frequency: e.target.value as 'Monthly' | 'One-Time' | 'Quarterly',
                          }))
                        }
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="One-Time">One-Time</option>
                        <option value="Quarterly">Quarterly</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 2 }}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Group Name"
                        value={editedGroupDetails.name}
                        onChange={(e) =>
                          setEditedGroupDetails((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={editedGroupDetails.description}
                        onChange={(e) =>
                          setEditedGroupDetails((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              setOpenEditGroup(true);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Group</ListItemText>
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
        </Menu>

        {/* Edit Group Dialog */}
        <Dialog
          open={openEditGroup}
          onClose={() => setOpenEditGroup(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Edit Group Details
              <IconButton onClick={() => setOpenEditGroup(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group Name"
                  required
                  value={editedGroupDetails.name}
                  onChange={(e) =>
                    setEditedGroupDetails((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={editedGroupDetails.description}
                  onChange={(e) =>
                    setEditedGroupDetails((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fee Amount"
                  type="number"
                  required
                  value={editedGroupDetails.fee}
                  onChange={(e) =>
                    setEditedGroupDetails((prev) => ({
                      ...prev,
                      fee: parseFloat(e.target.value) || 0,
                    }))
                  }
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Frequency"
                  select
                  value={editedGroupDetails.frequency}
                  onChange={(e) =>
                    setEditedGroupDetails((prev) => ({
                      ...prev,
                      frequency: e.target.value as 'Monthly' | 'One-Time' | 'Quarterly',
                    }))
                  }
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="One-Time">One-Time</option>
                  <option value="Quarterly">Quarterly</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditGroup(false)}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              onClick={handleSaveGroupDetails}
              disabled={saving || !editedGroupDetails.name.trim() || editedGroupDetails.fee <= 0}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Student Dialog */}
        <Dialog
          open={openAddMember}
          onClose={() => setOpenAddMember(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Add New Student
              <IconButton onClick={() => setOpenAddMember(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student Name"
                  required
                  value={newStudentData.name}
                  onChange={(e) =>
                    setNewStudentData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={newStudentData.phone}
                  onChange={(e) =>
                    setNewStudentData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Fee Plan</InputLabel>
                  <Select
                    value={newStudentData.feePlan}
                    label="Fee Plan"
                    onChange={(e) =>
                      setNewStudentData((prev) => ({
                        ...prev,
                        feePlan: e.target.value as 'Monthly' | 'One-Time' | 'Quarterly' | 'Yearly' | 'Weekly',
                      }))
                    }
                  >
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="One-Time">One-Time</MenuItem>
                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                  label="Start Date"
                  value={newStudentData.startDate}
                  onChange={(newValue) =>
                    setNewStudentData((prev) => ({
                      ...prev,
                      startDate: newValue || new Date(),
                    }))
                  }
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddMember(false)}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={createStudentLoading ? <CircularProgress size={16} /> : <PersonIcon />}
              onClick={handleAddStudent}
              disabled={createStudentLoading || !newStudentData.name || !newStudentData.phone}
            >
              {createStudentLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default GroupDetail;