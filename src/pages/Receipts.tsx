import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Fade,
  Select,
  MenuItem,
  Stack,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface Receipt {
  receiptNo: string;
  name: string;
  date: string;
  amount: number;
  method: string;
  status: 'paid' | 'pending' | 'overdue';
}

const Receipts = () => {
  const receipts: Receipt[] = [
    {
      receiptNo: "INV1001",
      name: "Aarav Kumar",
      date: "2025-06-01",
      amount: 1500,
      method: "UPI",
      status: 'paid'
    },
    {
      receiptNo: "INV1002",
      name: "Priya Sharma",
      date: "2025-06-02",
      amount: 2000,
      method: "Credit Card",
      status: 'paid'
    },
    {
      receiptNo: "INV1003",
      name: "Raj Malhotra",
      date: "2025-06-03",
      amount: 1800,
      method: "Net Banking",
      status: 'pending'
    },
    {
      receiptNo: "INV1004",
      name: "Neha Patel",
      date: "2025-06-04",
      amount: 1700,
      method: "Debit Card",
      status: 'overdue'
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
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
        <Grid container spacing={3}>
          {/* Left Section - Receipt List */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Receipts & Invoices
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Select
                  size="small"
                  defaultValue="all"
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="all">All Students</MenuItem>
                  {receipts.map(receipt => (
                    <MenuItem key={receipt.receiptNo} value={receipt.receiptNo}>
                      {receipt.name}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  size="small"
                  placeholder="Search receipts"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Receipt No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipts.map((receipt) => (
                      <TableRow key={receipt.receiptNo} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ReceiptIcon color="primary" />
                            {receipt.receiptNo}
                          </Stack>
                        </TableCell>
                        <TableCell>{receipt.name}</TableCell>
                        <TableCell>{receipt.date}</TableCell>
                        <TableCell>₹{receipt.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={receipt.status}
                            color={getStatusColor(receipt.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            startIcon={<DownloadIcon />}
                            variant="contained"
                            size="small"
                            sx={{ textTransform: 'none' }}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right Section - PDF Preview */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Receipt Preview</Typography>
              
              <Box sx={{ border: '1px solid #eee', p: 3, borderRadius: 1, mb: 2 }}>
                {/* Logo Placeholder */}
                <Box sx={{ mb: 3, height: 60, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }} />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Receipt No</Typography>
                    <Typography variant="body1" fontWeight="500">INV1001</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                    <Typography variant="body1" fontWeight="500">2025-06-01</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Student Name</Typography>
                    <Typography variant="body1" fontWeight="500">Aarav Kumar</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="body1" fontWeight="500">₹1,500</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                    <Typography variant="body1" fontWeight="500">UPI</Typography>
                  </Grid>
                </Grid>

                {/* Signature Placeholder */}
                <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #eee' }}>
                  <Typography variant="body2" color="text.secondary">Authorized Signature</Typography>
                  <Box sx={{ height: 40, width: 150, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1, mt: 1 }} />
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{ textTransform: 'none' }}
              >
                Download Receipt
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Receipts;