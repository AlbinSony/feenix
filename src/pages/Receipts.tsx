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
  TablePagination,
  TableSortLabel,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useState } from 'react';

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'receiptNo' | 'name' | 'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSort = (property: 'receiptNo' | 'name' | 'date' | 'amount' | 'status') => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const filteredReceipts = receipts.filter(receipt =>
    receipt.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const processedReceipts = filteredReceipts
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'receiptNo':
          aValue = a.receiptNo.toLowerCase();
          bValue = b.receiptNo.toLowerCase();
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = a.receiptNo.toLowerCase();
          bValue = b.receiptNo.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const paginatedReceipts = processedReceipts.slice(
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

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
        <Grid container spacing={3}>
          {/* Left Section - Receipt List */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Receipts & Invoices
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Select
                  size="small"
                  defaultValue="all"
                  sx={{ minWidth: { xs: '100%', sm: 200 } }}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="receiptNo">Receipt No</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'receiptNo'}
                          direction={sortBy === 'receiptNo' ? sortOrder : 'asc'}
                          onClick={() => handleSort('receiptNo')}
                        >
                          Receipt No
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'name'}
                          direction={sortBy === 'name' ? sortOrder : 'asc'}
                          onClick={() => handleSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'date'}
                          direction={sortBy === 'date' ? sortOrder : 'asc'}
                          onClick={() => handleSort('date')}
                        >
                          Date
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'amount'}
                          direction={sortBy === 'amount' ? sortOrder : 'asc'}
                          onClick={() => handleSort('amount')}
                        >
                          Amount
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'status'}
                          direction={sortBy === 'status' ? sortOrder : 'asc'}
                          onClick={() => handleSort('status')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedReceipts.map((receipt) => (
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

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={processedReceipts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Receipts per page:"
              />
            </Paper>
          </Grid>

          {/* Right Section - PDF Preview */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
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