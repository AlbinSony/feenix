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
  Snackbar,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  CurrencyRupee as RupeeIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { groupApi, Group } from '../services/groupApi';
import { useAuth } from '../context/AuthContext';

const PaymentGroups = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupFee, setNewGroupFee] = useState('');
  const [newGroupFrequency, setNewGroupFrequency] = useState<'Monthly' | 'One-Time'>('Monthly');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch groups on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await groupApi.getAll();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary statistics
  const totalStudents = groups.reduce((sum, group) => sum + group.students, 0);
  const totalCollected = groups.reduce((sum, group) => sum + group.collected, 0);
  const totalDues = groups.reduce((sum, group) => sum + group.dues, 0);

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
      setGroups(prev => [...prev, createdGroup]);
      
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupFee('');
      setNewGroupFrequency('Monthly');
      setOpenNewGroupDialog(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
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
      setGroups(prev => prev.filter(group => group._id !== selectedGroup._id));
      setSuccessMessage('Group deleted successfully');
      handleMenuClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete group');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
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
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{totalDues.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Dues</Typography>
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

                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => handleViewGroup(group)}
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
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

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />

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
                  onChange={(e) => setNewGroupFrequency(e.target.value as 'Monthly' | 'One-Time')}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="One-Time">One-Time</MenuItem>
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
    </Box>
  );
};

export default PaymentGroups;