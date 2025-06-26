import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

interface Receipt {
  id: string;
  date: string;
  member: string;
  group: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const Receipts = () => {
  const receipts: Receipt[] = [
    {
      id: 'REC001',
      date: '2024-03-15',
      member: 'John Doe',
      group: 'Premium Monthly',
      amount: 2500,
      status: 'paid',
    },
    {
      id: 'REC002',
      date: '2024-03-14',
      member: 'Jane Smith',
      group: 'Basic Plan',
      amount: 1000,
      status: 'pending',
    },
    {
      id: 'REC003',
      date: '2024-03-13',
      member: 'Mike Johnson',
      group: 'Annual Members',
      amount: 25000,
      status: 'overdue',
    },
  ];

  const getStatusColor = (status: Receipt['status']) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Fade in timeout={500}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Receipts</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search receipts..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                  >
                    Filter
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receipt ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell>{receipt.id}</TableCell>
                  <TableCell>{receipt.date}</TableCell>
                  <TableCell>{receipt.member}</TableCell>
                  <TableCell>{receipt.group}</TableCell>
                  <TableCell>₹{receipt.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={receipt.status}
                      color={getStatusColor(receipt.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
};

export default Receipts; 