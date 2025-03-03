import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recordIcon from './../../banner.png'; // Import the banner image
import axios from 'axios';
import {
  Typography,
  Box,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Fab,
  TextField,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import html2canvas from 'html2canvas';
import API_BASE_URL from '../../config/apiConfig';

interface Buyer {
  id: number;
  name: string;
  amount: number;
}

interface BuyerRecord {
  id: number;
  visit_date: string;
  amount: number;
  varients: Variant[];
}

interface Variant {
  id: number;
  product_name: string;
  quantity: number;
  weight: number;
  price: number;
  order_Index?: number;
}

const BuyerRecordDetails: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State variables
  const [buyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BuyerRecord[]>([]);
  const [buyerInfo, setBuyerInfo] = useState<Buyer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Date range state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Counts state
  const [todayCount, setTodayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);

  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/buyers/${id}`);
        setBuyerInfo(response.data);
      } catch (err) {
        setError('Error loading buyer information.');
      }
    };
    fetchBuyerInfo();
  }, [id]);

  useEffect(() => {
    const fetchBuyerRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/buyer-records/buyer/${id}`);
        const recordsWithVariants = await Promise.all(
          response.data.map(async (record:BuyerRecord) => {
            const variantResponse = await axios.get(`${API_BASE_URL}/api/varients/${record.id}`);
            return { ...record, varients: variantResponse.data.sort((a: Variant, b: Variant) => (a.order_Index ?? 0) - (b.order_Index ?? 0)) };
          })
        );
        recordsWithVariants.sort((a, b) => b.id - a.id);
        setBuyerRecords(recordsWithVariants);
        setFilteredRecords(recordsWithVariants); // Initially, show all records

        // Calculate counts for today, month, and year
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Months are zero-indexed
        const currentYear = today.getFullYear();

        const todayRecords = recordsWithVariants.filter((record) => {
          const recordDate = new Date(record.visit_date);
          return (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          );
        });

        const monthRecords = recordsWithVariants.filter((record) => {
          const recordDate = new Date(record.visit_date);
          return recordDate.getMonth() + 1 === currentMonth && recordDate.getFullYear() === currentYear;
        });

        const yearRecords = recordsWithVariants.filter((record) => {
          const recordDate = new Date(record.visit_date);
          return recordDate.getFullYear() === currentYear;
        });

        setTodayCount(todayRecords.length);
        setMonthCount(monthRecords.length);
        setYearCount(yearRecords.length);
      } catch (err) {
        setError('Error loading buyer record data.');
      } finally {
        setSnackbarOpen(true);
      }
    };
    fetchBuyerRecords();
  }, [id]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No Date Available';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const downloadPNG = async (recordId: number) => {
    const element = document.getElementById(`record-${recordId}`);
    if (!element) return;
    const button = element.querySelector('button');
    if (button) button.style.display = 'none';
    try {
      const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
      if (button) button.style.display = 'block';
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `buyer_record_${recordId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing image:', error);
      if (button) button.style.display = 'block';
    }
  };

  // Handle filtering by date range
  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert('Please select both "From Date" and "To Date".');
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDateObj > toDateObj) {
      alert('"From Date" cannot be later than "To Date".');
      return;
    }

    const filtered = buyerRecords.filter((record) => {
      const recordDate = new Date(record.visit_date);
      return recordDate >= fromDateObj && recordDate <= toDateObj;
    });
    setFilteredRecords(filtered);
  };

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          marginBottom: 3,
        }}
      >
        Buyer Records
      </Typography>

      {/* Banner Image */}
      

      {buyerInfo && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6">
            Buyer Name: {buyerInfo.name} | Balance + Income: ₹{buyerInfo.amount}
          </Typography>
        </Paper>
      )}

      {/* Display Counts */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6">Today's Records</Typography>
            <Typography variant="h4">{todayCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
            <Typography variant="h6">This Month's Records</Typography>
            <Typography variant="h4">{monthCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6">This Year's Records</Typography>
            <Typography variant="h4">{yearCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Date Range Filter */}
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ marginBottom: 3 }}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth={isMobile}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth={isMobile}
        />
        <Button
          variant="contained"
          onClick={handleFilter}
          fullWidth={isMobile}
          sx={{
            height: '100%',
            marginTop: isMobile ? 2 : 0,
          }}
        >
          Filter
        </Button>
      </Stack>

      {/* Display Filtered Records */}
{filteredRecords.length > 0 ? (
  filteredRecords.map((record) => (
    <Paper
      key={record.id}
      sx={{
        marginTop: 3,
        padding: 2,
        position: 'relative',
      }}
      id={`record-${record.id}`}
    >
      {/* Banner Image */}
      <Box
        component="img"
        src={recordIcon} // Use the imported banner image
        alt="Record Icon"
        sx={{
          width: '100%',
          height: 'auto',
          marginBottom: 2,
        }}
      />

      {/* Record Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: isMobile ? 2 : 5,
          marginRight: isMobile ? 2 : 5,
          color: '#0fc33b',
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">No: {record.id}</Typography>
        <Typography variant="h6">தேதி: {formatDate(record.visit_date)}</Typography>
      </Box>

      {/* Buyer Information */}
      {buyerInfo && (
        <Typography
          variant="h6"
          sx={{
            marginLeft: isMobile ? 2 : 10,
            marginTop: 3,
            color: theme.palette.text.primary,
          }}
        >
          திரு.{buyerInfo.name}
        </Typography>
      )}

      {/* Product Table */}
      <Table
        sx={{
          marginLeft: isMobile ? 1 : 2,
          marginRight: isMobile ? 1 : 4,
          marginTop: 3,
          borderCollapse: 'collapse',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {record.varients.length > 0 ? (
            record.varients.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.product_name}</TableCell>
                <TableCell>{variant.quantity}</TableCell>
                <TableCell>{variant.weight} kg</TableCell>
                <TableCell>₹{variant.price}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No products available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Total Amount */}
      <Typography
        variant="h6"
        sx={{
          marginTop: 3,
          marginLeft: isMobile ? 2 : 10,
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}
      >
        Total: ₹{record.amount}
      </Typography>

      {/* Balance + Income */}
      {buyerInfo && (
        <Typography
          variant="body1"
          sx={{
            marginLeft: isMobile ? 2 : 10,
            marginTop: 1,
            color: theme.palette.text.secondary,
          }}
        >
          Balance + Income: ₹{buyerInfo.amount}
        </Typography>
      )}

      {/* Download Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => downloadPNG(record.id)}
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
        }}
      >
        Download Record as PNG
      </Button>
    </Paper>
  ))
) : (
  <Typography
    variant="body1"
    sx={{
      textAlign: 'center',
      marginTop: 3,
      color: theme.palette.text.secondary,
    }}
  >
    No records found for the selected date range.
  </Typography>
)}

      {/* Floating "+" Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 10 : 16,
          right: isMobile ? 10 : 16,
        }}
        onClick={() => navigate(`/buyer-records/form/${id}`)}
      >
        <AddIcon />
      </Fab>

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Success Snackbar */}
      {snackbarOpen && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Data loaded successfully!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BuyerRecordDetails;
