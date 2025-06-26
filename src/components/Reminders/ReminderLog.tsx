import {
  Card,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Check, Error, Schedule } from '@mui/icons-material';

// Mock data for reminder logs
const reminderLogs = [
  {
    id: 1,
    recipient: 'John Doe',
    group: 'Class A',
    sentAt: '2024-02-15 10:30 AM',
    status: 'Sent',
    type: 'Payment Due',
  },
  {
    id: 2,
    recipient: 'Jane Smith',
    group: 'Class B',
    sentAt: '2024-02-15 10:29 AM',
    status: 'Failed',
    type: 'Payment Overdue',
  },
  {
    id: 3,
    recipient: 'Mike Johnson',
    group: 'Class A',
    sentAt: '2024-02-15 10:25 AM',
    status: 'Pending',
    type: 'Payment Due',
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
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reminder History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Sent At</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reminderLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.recipient}</TableCell>
                  <TableCell>{log.group}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.sentAt}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={
                        log.status === 'Sent' ? (
                          <Check />
                        ) : log.status === 'Failed' ? (
                          <Error />
                        ) : (
                          <Schedule />
                        )
                      }
                      label={log.status}
                      color={
                        log.status === 'Sent'
                          ? 'success'
                          : log.status === 'Failed'
                          ? 'error'
                          : 'warning'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

export default ReminderLog;
