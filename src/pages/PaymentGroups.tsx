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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data for groups
const initialGroups = [
  { id: 1, name: 'Sane Group', members: 124, fees: '$5/month' },
  { id: 2, name: 'Hament Group', members: 124, fees: '$5/month' },
  { id: 3, name: 'Cance Group', members: 122, fees: '$5/month' },
  { id: 4, name: 'Past Pimie', members: 224, fees: '$5/month' },
  { id: 5, name: 'Cayald Group', members: 202, fees: '$5/month' },
  { id: 6, name: 'Sact Oke', members: 224, fees: '$5/month' },
];

type Group = {
  id: number;
  name: string;
  members: number;
  fees: string;
};

const PaymentGroups = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNewGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: Date.now(),
      name: newGroupName.trim(),
      members: 0,
      fees: '$5/month'
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setNewGroupDescription('');
    setOpenNewGroupDialog(false);
  };

  const handleViewGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    navigate(`/groups/${groupId}`, { state: { group } });
  };

  return (
    <Box>
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

      <Grid container spacing={3}>
        {filteredGroups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card 
              sx={{ 
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }
              }}
              onClick={() => handleViewGroup(group.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1), 
                      color: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                      mr: 2
                    }}
                  >
                    {group.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {group.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Members: {group.members}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip 
                    label={group.fees} 
                    size="small" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500
                    }} 
                  />
                  <IconButton size="small" color="primary">
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Box>
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

      {/* New Group Dialog */}
      <Dialog 
        open={openNewGroupDialog} 
        onClose={() => setOpenNewGroupDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Create New Group
            <IconButton onClick={() => setOpenNewGroupDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
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