import { useState } from 'react';
import {
  Card,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { Send, WhatsApp } from '@mui/icons-material';

const groups = [
  { id: 1, name: 'Batch A' },
  { id: 2, name: 'Batch B' },
  { id: 3, name: 'Batch C' },
];

const students = [
  { id: 1, name: 'Aarav Kumar', group: 'Batch A', status: 'Unpaid' },
  { id: 2, name: 'Zara Patel', group: 'Batch A', status: 'Unpaid' },
  { id: 3, name: 'Asha M', group: 'Batch B', status: 'Unpaid' },
  { id: 4, name: 'Arjun Sharma', group: 'Batch B', status: 'Paid' },
];

const ReminderForm = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="600">
        Send Payment Reminder
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Select Group"
            size="medium"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <MenuItem value="all">All Groups</MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.name}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Filter by Status"
            size="medium"
            defaultValue="unpaid"
          >
            <MenuItem value="all">All Students</MenuItem>
            <MenuItem value="unpaid">Unpaid Only</MenuItem>
            <MenuItem value="overdue">Overdue Only</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Select Students"
            SelectProps={{ multiple: true }}
            size="medium"
            value={selectedStudents}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
            }}
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.name}>
                {student.name} ({student.group} - {student.status})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            defaultValue={`Dear Student,\n\nThis is a reminder that your fee payment is pending. Please complete the payment at your earliest convenience.\n\nRegards,\nFeenix Academy`}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Send />}
              sx={{ borderRadius: 2 }}
            >
              Test Message
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<WhatsApp />}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #25D366, #128C7E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #128C7E, #075E54)',
                },
              }}
            >
              Send WhatsApp
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ReminderForm;
