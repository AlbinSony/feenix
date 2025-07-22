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
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';

interface Receipt {
  id: string;
  date: string;
  member: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const Receipts = () => {
  const receipts: Receipt[] = [
    {
      id: '12230 Notum',
      date: '2024-03-15',
      member: 'Client Name',
      amount: 250.0,
      status: 'paid',
    },
    {
      id: '12235 Nemt',
      date: '2024-03-14',
      member: 'Client Name',
      amount: 200.0,
      status: 'pending',
    },
    {
      id: '16:00 Om',
      date: '2024-03-13',
      member: 'Client Name',
      amount: 200.0,
      status: 'overdue',
    },
    {
      id: '80.bnting',
      date: '2024-03-12',
      member: 'Client Name',
      amount: 350.0,
      status: 'paid',
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
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 88px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            height: '100%',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Receipts & Payment Status
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{
                mb: 3,
                alignItems: { xs: 'stretch', md: 'center' },
              }}
            >
              <Select
                size="small"
                defaultValue="2013/2241"
                sx={{
                  minWidth: 150,
                  backgroundColor: 'white',
                }}
              >
                <MenuItem value="2013/2241">2013/2241</MenuItem>
              </Select>

              <Stack direction="row" spacing={1}>
                {['Paid', 'Pending', 'Overdue'].map((status) => (
                  <Chip
                    key={status}
                    label={status}
                    color={
                      status === 'Paid'
                        ? 'success'
                        : status === 'Pending'
                        ? 'warning'
                        : 'error'
                    }
                    variant="outlined"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer',
                      },
                    }}
                  />
                ))}
              </Stack>

              <TextField
                size="small"
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ml: { xs: 0, md: 'auto' },
                  backgroundColor: 'white',
                  width: { xs: '100%', md: '250px' },
                }}
              />
            </Stack>

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              Payment History
            </Typography>

            <TableContainer
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                boxShadow: '0 0 10px rgba(0,0,0,0.05)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Invoice ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow
                      key={receipt.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'rgba(0, 0, 0, 0.04)',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          />
                          {receipt.id}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={receipt.status}
                          size="small"
                          color={getStatusColor(receipt.status)}
                          sx={{ minWidth: 80, justifyContent: 'center' }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        ${receipt.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {receipt.status === 'paid' ? (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            sx={{
                              textTransform: 'none',
                              boxShadow: 'none',
                              '&:hover': {
                                boxShadow: 'none',
                                backgroundColor: 'primary.dark',
                              },
                            }}
                          >
                            Download Receipt
                          </Button>
                        ) : (
                          <Typography
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          >
                            ${receipt.amount.toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Receipts;