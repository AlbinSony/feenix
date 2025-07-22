import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  TextField,
} from '@mui/material';
import { Search, WhatsApp } from '@mui/icons-material';
import { format } from 'date-fns';

const reminders = [
  {
    id: 1,
    name: "Asha M",
    group: "Batch B",
    method: "WhatsApp",
    time: "2024-06-10 10:15",
    status: "Sent",
  },
  {
    id: 2,
    name: "Aarav Kumar",
    group: "Batch A",
    method: "WhatsApp",
    time: "2024-06-10 10:15",
    status: "Failed",
  },
  {
    id: 3,
    name: "Zara Patel",
    group: "Batch A",
    method: "WhatsApp",
    time: "2024-06-10 10:14",
    status: "Delivered",
  },
  {
    id: 4,
    name: "Riya Singh",
    group: "Batch B",
    method: "WhatsApp",
    time: "2024-06-10 10:14",
    status: "Seen",
  },
];

const ReminderLog = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Reminder History
        </Typography>
        <TextField
          size="small"
          placeholder="Search reminders..."
          sx={{ width: 250 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>{reminder.name}</TableCell>
                <TableCell>{reminder.group}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WhatsApp color="success" />
                    {reminder.method}
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(reminder.time), 'PPp')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={reminder.status}
                    size="small"
                    color={
                      reminder.status === 'Sent' || reminder.status === 'Delivered'
                        ? 'primary'
                        : reminder.status === 'Seen'
                        ? 'success'
                        : 'error'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ReminderLog;
