import { useState, useEffect } from 'react';
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
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { studentApi, Student, CreateStudentData } from '../services/studentApi';
import { groupApi, Group } from '../services/groupApi';
import { feePlanApi, FeePlan } from '../services/feePlanApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form data
  const [newStudentData, setNewStudentData] = useState<CreateStudentData>({
    name: '',
    phone: '',
    group: '',
    feePlan: 'Monthly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const [editStudentData, setEditStudentData] = useState<CreateStudentData>({
    name: '',
    phone: '',
    group: '',
    feePlan: 'Monthly',
    startDate: '',
  });

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  // New state for pagination, sorting, and view
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'phone' | 'group' | 'startDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
      fetchGroups();
      fetchFeePlans();
    }
  }, [isAuthenticated]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
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

  const fetchFeePlans = async () => {
    try {
      const data = await feePlanApi.getAll();
      setFeePlans(data);
    } catch (err: any) {
      console.error('Error fetching fee plans:', err);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery) ||
    student.group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting function
  const handleSort = (property: 'name' | 'phone' | 'group' | 'startDate') => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  // Filter and sort students
  const processedStudents = filteredStudents
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'phone':
          aValue = a.phone;
          bValue = b.phone;
          break;
        case 'group':
          aValue = a.group.name.toLowerCase();
          bValue = b.group.name.toLowerCase();
          break;
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Paginated students
  const paginatedStudents = processedStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newViewMode: 'table' | 'grid') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Handle create student
  const handleCreateStudent = async () => {
    if (!newStudentData.name.trim() || !newStudentData.phone.trim() || !newStudentData.group) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreateLoading(true);
      setError('');
      
      const studentData = {
        ...newStudentData,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      };

      await studentApi.create(studentData);
      
      // Reset form
      setNewStudentData({
        name: '',
        phone: '',
        group: '',
        feePlan: 'Monthly',
        startDate: format(new Date(), 'yyyy-MM-dd'),
      });
      setStartDate(new Date());
      setOpenAddDialog(false);
      toast.success('Student created successfully');
      
      // Refresh students list
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create student');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle edit student
  const handleEditStudent = (student: Student) => {
    console.log('Editing student:', student);
    setSelectedStudent(student);
    setEditStudentData({
      name: student.name,
      phone: student.phone,
      group: student.group._id,
      feePlan: student.feePlan,
      startDate: format(new Date(student.startDate), 'yyyy-MM-dd'),
    });
    setOpenEditDialog(true);
    // Don't call handleMenuClose() here to preserve selectedStudent
    setAnchorEl(null);
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) {
      console.error('Update failed: No student selected');
      toast.error('No student selected for update');
      return;
    }

    if (!editStudentData.name.trim() || !editStudentData.phone.trim()) {
      toast.error('Name and phone number are required');
      return;
    }

    try {
      setUpdateLoading(true);
      setError('');
      
      // Debug log the selected student and update data
      console.log('Updating student ID:', selectedStudent._id);
      console.log('Update data:', editStudentData);
      
      // Call API with the entire editStudentData object
      const updatedStudent = await studentApi.update(selectedStudent._id, editStudentData);
      
      // Update the student in the local state
      setStudents(prevStudents => 
        prevStudents.map(s => s._id === updatedStudent._id ? updatedStudent : s)
      );
      
      setOpenEditDialog(false);
      setSelectedStudent(null); // Clear only after successful update
      toast.success('Student updated successfully');
      
    } catch (err: any) {
      console.error('Error in handleUpdateStudent:', err);
      toast.error(err.message || 'Failed to update student');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle delete student
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      setDeleteLoading(true);
      
      // Call the delete API
      await studentApi.delete(selectedStudent._id);
      
      // Remove student from local state
      setStudents(prevStudents => 
        prevStudents.filter(s => s._id !== selectedStudent._id)
      );
      
      toast.success('Student deleted successfully');
      handleMenuClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedStudent here if edit dialog might open
  };

  // When closing the edit dialog, clear the selected student
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading students...</Typography>
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

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Student Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Student
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{students.length}</Typography>
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
                    <GroupIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{groups.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Active Groups</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Search and Controls */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search students by name, phone, or group..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'phone' | 'group' | 'startDate')}
                  startAdornment={<SortIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="group">Group</MenuItem>
                  <MenuItem value="startDate">Start Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
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
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  size="small"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Students Display */}
        {viewMode === 'table' ? (
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Student
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'phone'}
                        direction={sortBy === 'phone' ? sortOrder : 'asc'}
                        onClick={() => handleSort('phone')}
                      >
                        Phone
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'group'}
                        direction={sortBy === 'group' ? sortOrder : 'asc'}
                        onClick={() => handleSort('group')}
                      >
                        Group
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Fee Plan</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'startDate'}
                        direction={sortBy === 'startDate' ? sortOrder : 'asc'}
                        onClick={() => handleSort('startDate')}
                      >
                        Start Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          {searchQuery ? 'No students found' : 'No students added yet'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStudents.map((student) => (
                      <TableRow key={student._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {student.name.charAt(0)}
                            </Avatar>
                            {student.name}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            {student.phone}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={student.group.name}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{student.feePlan}</TableCell>
                        <TableCell>
                          {format(new Date(student.startDate), 'PP')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active"
                            size="small"
                            color="success"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, student)}
                          >
                            <MoreVertIcon />
                          </IconButton>
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
              count={processedStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Students per page:"
            />
          </Card>
        ) : (
          // Grid View
          <Box>
            <Grid container spacing={3}>
              {paginatedStudents.map((student) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                  <Card 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2, width: 40, height: 40 }}>
                        {student.name.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontSize="1rem">
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.phone}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, student)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <Chip
                        label={student.group.name}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Plan: {student.feePlan}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Started: {format(new Date(student.startDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {paginatedStudents.length === 0 && (
              <Box 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {searchQuery ? 'No students found' : 'No students added yet'}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                rowsPerPageOptions={[8, 12, 24, 48]}
                component="div"
                count={processedStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Students per page:"
              />
            </Box>
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
          <MenuItem onClick={() => handleEditStudent(selectedStudent!)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Student</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleDeleteStudent}
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
            <ListItemText>Delete Student</ListItemText>
          </MenuItem>
        </Menu>

        {/* Add Student Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              margin: { xs: 1, sm: 3 },
              width: { xs: 'calc(100vw - 16px)', sm: 'auto' },
              maxHeight: { xs: 'calc(100vh - 32px)', sm: '90vh' },
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Add New Student
              <IconButton onClick={() => setOpenAddDialog(false)}>
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
                    setNewStudentData((prev) => ({ ...prev, name: e.target.value }))
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
                    setNewStudentData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Group</InputLabel>
                  <Select
                    value={newStudentData.group}
                    label="Select Group"
                    onChange={(e) =>
                      setNewStudentData((prev) => ({ ...prev, group: e.target.value }))
                    }
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name} - ₹{group.fee}/{group.frequency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Default Fee Plan (Optional)</InputLabel>
                  <Select
                    value={newStudentData.feePlan || ''}
                    label="Default Fee Plan"
                    onChange={(e) =>
                      setNewStudentData((prev) => ({ ...prev, feePlan: e.target.value }))
                    }
                  >
                    <MenuItem value="">No default plan</MenuItem>
                    {feePlans.map((plan) => (
                      <MenuItem key={plan._id} value={plan._id}>
                        {plan.name} - ₹{plan.amount} ({plan.frequency})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 }, p: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={() => setOpenAddDialog(false)}
              sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateStudent}
              disabled={createLoading || !newStudentData.name.trim() || !newStudentData.phone.trim() || !newStudentData.group}
              sx={{ order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}
            >
              {createLoading ? <CircularProgress size={20} /> : 'Add Student'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              margin: { xs: 1, sm: 3 },
              width: { xs: 'calc(100vw - 16px)', sm: 'auto' },
              maxHeight: { xs: 'calc(100vh - 32px)', sm: '90vh' },
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Edit Student
              <IconButton onClick={handleCloseEditDialog}>
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
                  value={editStudentData.name}
                  onChange={(e) =>
                    setEditStudentData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={editStudentData.phone}
                  onChange={(e) =>
                    setEditStudentData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Group</InputLabel>
                  <Select
                    value={editStudentData.group}
                    label="Select Group"
                    onChange={(e) =>
                      setEditStudentData((prev) => ({ ...prev, group: e.target.value }))
                    }
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name} - ₹{group.fee}/{group.frequency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Fee Plan</InputLabel>
                  <Select
                    value={editStudentData.feePlan}
                    label="Fee Plan"
                    onChange={(e) =>
                      setEditStudentData((prev) => ({ ...prev, feePlan: e.target.value }))
                    }
                  >
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="One-Time">One-Time</MenuItem>
                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={new Date(editStudentData.startDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setEditStudentData((prev) => ({
                        ...prev,
                        startDate: format(newValue, 'yyyy-MM-dd'),
                      }));
                    }
                  }}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 }, p: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={handleCloseEditDialog}
              sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateStudent}
              disabled={updateLoading || !editStudentData.name.trim() || !editStudentData.phone.trim()}
              sx={{ order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}
            >
              {updateLoading ? <CircularProgress size={20} /> : 'Update Student'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default StudentManagement;
