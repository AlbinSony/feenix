import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Card,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

// Mock data
const students = [
  {
    id: 1,
    name: "Aarav Kumar",
    phone: "9876543210",
    group: "Batch A",
    feePlan: "Monthly",
    status: "Unpaid",
    lastPayment: "May 2025",
  },
];

const groups = ["Batch A", "Batch B", "Batch C"];
const feePlans = ["Monthly", "Quarterly", "Yearly"];
const statusOptions = ["All", "Paid", "Unpaid"];

const StudentManagement = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);

  const filteredStudents = students.filter(student => {
    const groupMatch = !selectedGroup || student.group === selectedGroup;
    const statusMatch = selectedStatus === 'All' || student.status === selectedStatus;
    return groupMatch && statusMatch;
  });

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight="bold" color="primary">
        Student Management
      </Typography>

      <Card elevation={0}>
        <Box p={3}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Add New Student
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Group</InputLabel>
                <Select label="Group">
                  {groups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Fee Plan</InputLabel>
                <Select label="Fee Plan">
                  {feePlans.map((plan) => (
                    <MenuItem key={plan} value={plan}>
                      {plan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker 
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ height: '40px' }}
              >
                Add Student
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card elevation={0}>
        <Box p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Students List
            </Typography>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Group</InputLabel>
                <Select
                  label="Group"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Fee Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Payment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.group}</TableCell>
                    <TableCell>{student.feePlan}</TableCell>
                    <TableCell>
                      <Chip 
                        label={student.status} 
                        color={student.status === 'Paid' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{student.lastPayment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Stack>
  );
};

export default StudentManagement;
