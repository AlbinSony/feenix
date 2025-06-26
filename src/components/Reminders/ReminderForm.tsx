import { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Send, WhatsApp } from '@mui/icons-material';

// Mock data for groups and students
const groups = [
  { id: 1, name: 'Class A' },
  { id: 2, name: 'Class B' },
  { id: 3, name: 'Class C' },
];

const students = [
  { id: 1, name: 'John Doe', group: 'Class A', status: 'Overdue' },
  { id: 2, name: 'Jane Smith', group: 'Class B', status: 'Due Today' },
  { id: 3, name: 'Mike Johnson', group: 'Class A', status: 'Overdue' },
];

const ReminderForm = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [message, setMessage] = useState(
    'Dear student, this is a reminder for your pending payment. Please complete the payment at your earliest convenience.'
  );

  const handleSendReminder = () => {
    // Simulate sending reminder
    console.log('Sending reminder to:', selectedStudents);
    console.log('Message:', message);
    // You would typically make an API call here
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Compose Reminder
        </Typography>

        <Grid container spacing={3}>
          {/* Filter Section */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Group</InputLabel>
              <Select
                value={selectedGroup}
                label="Filter by Group"
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Recipients Selection */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={students}
              getOptionLabel={(option) => option.name}
              value={selectedStudents}
              onChange={(_, newValue) => setSelectedStudents(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Recipients"
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                    color="primary"
                  />
                ))
              }
            />
          </Grid>

          {/* Message Composition */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Reminder Message"
              placeholder="Type your message here..."
              variant="outlined"
            />
          </Grid>

          {/* Send Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<WhatsApp />}
              endIcon={<Send />}
              onClick={handleSendReminder}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
              }}
            >
              Send WhatsApp Reminder
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default ReminderForm;
