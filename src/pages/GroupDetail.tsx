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
} from '@mui/material';
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
  CheckCircleOutline as CheckCircleIcon,
  PendingOutlined as PendingIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

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

const initializeGroupDetails = (locationState: any) => {
  if (locationState?.group) {
    return {
      name: locationState.group.name,
      description: locationState.group.description || 'Monthly payment group for regular members',
      members: locationState.group.students || 0,
      fees: locationState.group.fee || 0,
      frequency: locationState.group.frequency || 'Monthly',
      collected: locationState.group.collected || 0,
      dues: locationState.group.dues || 0,
      createdDate: locationState.group.createdDate || '2024-01-01',
      lastPaymentDate: locationState.group.lastPaymentDate || '',
      nextDueDate: locationState.group.nextDueDate || '',
    };
  }
  return {
    name: 'Loading...',
    description: '',
    members: 0,
    fees: 0,
    frequency: 'Monthly',
    collected: 0,
    dues: 0,
    createdDate: '',
    lastPaymentDate: '',
    nextDueDate: '',
  };
};

const GroupDetail = () => {
  const theme = useTheme();
  useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [groupDetails, setGroupDetails] = useState(initializeGroupDetails(location.state));
  const [editedGroupDetails, setEditedGroupDetails] = useState({
    name: groupDetails.name,
    description: groupDetails.description,
  });

  useEffect(() => {
    setEditedGroupDetails({
      name: groupDetails.name,
      description: groupDetails.description,
    });
  }, [groupDetails]);

  useEffect(() => {
    if (!location.state?.group && groupDetails.name === 'Loading...') {
      navigate('/groups');
    }
  }, [location.state, navigate, groupDetails.name]);

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      joinDate: '2024-01-15',
      status: 'active',
    },
  ]);

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [timelineEvents] = useState<PaymentEvent[]>([
    {
      id: 1,
      type: 'payment',
      date: '2024-02-15',
      description: 'Monthly fee collected',
      amount: 1500,
      status: 'completed',
    },
    {
      id: 2,
      type: 'reminder',
      date: '2024-02-10',
      description: 'Payment reminder sent to all members',
    },
    {
      id: 3,
      type: 'member_added',
      date: '2024-02-01',
      description: 'New member John Doe added to group',
    },
  ]);


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveGroupDetails = () => {
    setGroupDetails(prev => ({
      ...prev,
      name: editedGroupDetails.name,
      description: editedGroupDetails.description,
    }));
    setOpenEditGroup(false);
  };

  const handleAddMember = () => {
    const newMember: Member = {
      id: Date.now(),
      name: newMemberData.name,
      email: newMemberData.email,
      phone: newMemberData.phone,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setMembers(prev => [...prev, newMember]);
    setNewMemberData({ name: '', email: '', phone: '' });
    setOpenAddMember(false);
  };

  const handleDeleteMember = (memberId: number) => {
    setMembers(members.filter(member => member.id !== memberId));
  };

  return (
    <Box>
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
                {groupDetails.members} members · ₹{groupDetails.fees}/{groupDetails.frequency}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenEditGroup(true)}
          >
            Edit Group
          </Button>
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
                  <Typography variant="h6">{groupDetails.members}</Typography>
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
                  <Typography variant="h6">₹{groupDetails.collected.toLocaleString()}</Typography>
                  <Typography variant="body2">Total Collected</Typography>
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
            <TimelineIcon sx={{ mr: 1 }} /> Activity Timeline
          </Typography>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              px: 0
            }}
          >
            {timelineEvents.map((event) => (
              <TimelineItem key={event.id}>
                <TimelineOppositeContent sx={{ flex: 0.2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      boxShadow: 1,
                      bgcolor: event.type === 'payment' 
                        ? 'success.main'
                        : event.type === 'reminder' 
                          ? 'warning.main' 
                          : 'primary.main',
                      p: 1
                    }}
                  >
                    {event.type === 'payment' ? <RupeeIcon /> :
                     event.type === 'reminder' ? <NotificationsIcon /> :
                     <PersonIcon />}
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: 'divider' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Card variant="outlined" sx={{ 
                    p: 2, 
                    bgcolor: alpha(
                      event.type === 'payment' 
                        ? theme.palette.success.main
                        : event.type === 'reminder' 
                          ? theme.palette.warning.main
                          : theme.palette.primary.main,
                      0.05
                    )
                  }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {event.description}
                    </Typography>
                    {event.amount && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <RupeeIcon fontSize="small" />
                        Amount: {event.amount.toLocaleString()}
                      </Typography>
                    )}
                    {event.status && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          icon={event.status === 'completed' ? <CheckCircleIcon /> : <PendingIcon />}
                          label={event.status}
                          color={event.status === 'completed' ? 'success' : 'warning'}
                          sx={{ 
                            borderRadius: 1,
                            '& .MuiChip-icon': {
                              fontSize: 16
                            }
                          }}
                        />
                      </Box>
                    )}
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
                placeholder="Search members..."
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
                Add Member
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                            {member.name.charAt(0)}
                          </Avatar>
                          {member.name}
                        </Box>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          color={member.status === 'active' ? 'success' : 'default'}
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
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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
                      value={groupDetails.fees}
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
                      value={groupDetails.frequency}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
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
                      value={groupDetails.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={groupDetails.description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Card>

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
                value={editedGroupDetails.name}
                onChange={(e) => setEditedGroupDetails(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editedGroupDetails.description}
                onChange={(e) => setEditedGroupDetails(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditGroup(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveGroupDetails}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddMember}
        onClose={() => setOpenAddMember(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add New Member
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
                label="Name"
                required
                value={newMemberData.name}
                onChange={(e) => setNewMemberData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={newMemberData.email}
                onChange={(e) => setNewMemberData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                required
                value={newMemberData.phone}
                onChange={(e) => setNewMemberData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMember(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={handleAddMember}
            disabled={!newMemberData.name || !newMemberData.email || !newMemberData.phone}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetail;