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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
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
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize with data from navigation state
  const initializeGroupDetails = () => {
    if (location.state?.group) {
      return {
        name: location.state.group.name,
        description: 'Monthly payment group for regular members',
        members: location.state.group.members,
        fees: parseInt(location.state.group.fees.replace(/[^0-9]/g, '')), // Convert "$5/month" to 5
        paymentCycle: 'monthly',
        createdDate: '2024-01-01',
      };
    }
    return {
      name: 'Loading...',
      description: '',
      members: 0,
      fees: 0,
      paymentCycle: 'monthly',
      createdDate: '',
    };
  };

  const [groupDetails, setGroupDetails] = useState(initializeGroupDetails());
  const [editedGroupDetails, setEditedGroupDetails] = useState({
    name: groupDetails.name,
    description: groupDetails.description,
  });

  // Update editedGroupDetails when groupDetails changes
  useEffect(() => {
    setEditedGroupDetails({
      name: groupDetails.name,
      description: groupDetails.description,
    });
  }, [groupDetails]);

  // Redirect to groups page if no group data is available
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
    // Add more mock members as needed
  ]);

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
    // Delete member logic
    setMembers(members.filter(member => member.id !== memberId));
  };

  return (
    <Box>
      {/* Header Section */}
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
                {groupDetails.members} members · ₹{groupDetails.fees}/{groupDetails.paymentCycle}
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

      {/* Tabs Navigation */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label="Members" />
          <Tab label="Payment Settings" />
          <Tab label="Group Settings" />
        </Tabs>

        {/* Members Tab */}
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

        {/* Payment Settings Tab */}
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
                      value={groupDetails.paymentCycle}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Group Settings Tab */}
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

      {/* Add Member Dialog */}
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