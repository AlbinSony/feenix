import { useState } from 'react';
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
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  CurrencyRupee as RupeeIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: number;
  name: string;
  description: string;
  fee: number;
  frequency: 'Monthly' | 'One-Time';
  students: number;
  collected: number;
  dues: number;
  lastPaymentDate: string;
  nextDueDate: string;
  status: 'active' | 'inactive';
}

// Enhanced mock data
const initialGroups: Group[] = [
  {
    id: 1,
    name: "Batch A (10th Std)",
    description: "Morning Science Class",
    fee: 1500,
    frequency: "Monthly",
    students: 12,
    collected: 12000,
    dues: 6000,
    lastPaymentDate: "2024-02-15",
    nextDueDate: "2024-03-15",
    status: "active"
  },
  {
    id: 2,
    name: "Batch B (12th Commerce)",
    description: "Evening Accounts Class",
    fee: 2000,
    frequency: "Monthly",
    students: 15,
    collected: 24000,
    dues: 6000,
    lastPaymentDate: "2024-02-10",
    nextDueDate: "2024-03-10",
    status: "active"
  },
];

const PaymentGroups = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupFee, setNewGroupFee] = useState('');
  const [newGroupFrequency, setNewGroupFrequency] = useState<'Monthly' | 'One-Time'>('Monthly');

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary statistics
  const totalStudents = groups.reduce((sum, group) => sum + group.students, 0);
  const totalCollected = groups.reduce((sum, group) => sum + group.collected, 0);
  const totalDues = groups.reduce((sum, group) => sum + group.dues, 0);

  const handleCreateNewGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: Date.now(),
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      fee: parseFloat(newGroupFee),
      frequency: newGroupFrequency,
      students: 0,
      collected: 0,
      dues: 0,
      lastPaymentDate: '',
      nextDueDate: '',
      status: 'active' as 'active',
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupFee('');
    setNewGroupFrequency('Monthly');
    setOpenNewGroupDialog(false);
  };

  const handleViewGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    navigate(`/groups/${groupId}`, { state: { group } });
  };

  return (
    <Box>
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

      {/* Enhanced Group Cards */}
      <Grid container spacing={3}>
        {filteredGroups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
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
                  <Box>
                    <Typography variant="h6">{group.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {group.description}
                    </Typography>
                  </Box>
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
                  onClick={() => handleViewGroup(group.id)}
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredGroups.length === 0 && (
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
            No groups found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try a different search term or create a new group
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

      {/* Enhanced New Group Dialog */}
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
            disabled={!newGroupName.trim()}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentGroups;