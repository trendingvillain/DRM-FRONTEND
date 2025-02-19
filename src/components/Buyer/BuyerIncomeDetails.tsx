import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Fab,
  TextField,
  Stack,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

interface BuyerIncome {
  id: number;
  buyer: {
    id: number;
    name: string;
    location: string;
    amount: number;
    createdDate: string;
  };
  visit_date: string;
  amount: number;
}

const BuyerIncomeDetails: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { buyerId } = useParams<{ buyerId: string }>();
  const [incomeRecords, setIncomeRecords] = useState<BuyerIncome[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BuyerIncome[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (buyerId) {
      axios
        .get(`${API_BASE_URL}/api/buyer-income/buyer/${buyerId}`)
        .then((response) => {
          const sortedRecords = response.data.sort(
            (a: BuyerIncome, b: BuyerIncome) =>
              new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
          );
          setIncomeRecords(sortedRecords);
          setFilteredRecords(sortedRecords);

          // Calculate counts for today, month, and year
          const today = new Date();
          const currentMonth = today.getMonth() + 1; // Months are zero-indexed
          const currentYear = today.getFullYear();
          const todayRecords = sortedRecords.filter((record: BuyerIncome) => {
            const recordDate = new Date(record.visit_date);
            return (
              recordDate.getDate() === today.getDate() &&
              recordDate.getMonth() === today.getMonth() &&
              recordDate.getFullYear() === today.getFullYear()
            );
          });
          const monthRecords = sortedRecords.filter((record: BuyerIncome) => {
            const recordDate = new Date(record.visit_date);
            return recordDate.getMonth() + 1 === currentMonth && recordDate.getFullYear() === currentYear;
          });
          const yearRecords = sortedRecords.filter((record: BuyerIncome) => {
            const recordDate = new Date(record.visit_date);
            return recordDate.getFullYear() === currentYear;
          });
          setTodayCount(todayRecords.length);
          setMonthCount(monthRecords.length);
          setYearCount(yearRecords.length);
        })
        .catch((error) => {
          console.error('Error fetching buyer income details:', error);
        });
    }
  }, [buyerId]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No Date Available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
    const filtered = incomeRecords.filter((record) => {
      const recordDate = new Date(record.visit_date);
      return recordDate >= fromDateObj && recordDate <= toDateObj;
    });
    setFilteredRecords(filtered);
  };

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
        Buyer Income Details for Buyer ID: {buyerId}
      </Typography>

      {/* Display Counts */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6">Today's</Typography>
            <Typography variant="h4">{todayCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
            <Typography variant="h6">This Month's</Typography>
            <Typography variant="h4">{monthCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6">This Year's</Typography>
            <Typography variant="h4">{yearCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Date Range Filter */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        sx={{ marginBottom: 3 }}
      >
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

      {/* Income Records Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: isMobile ? 300 : 400,
          overflowY: 'auto',
          marginBottom: 3,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Visit Date
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{formatDate(income.visit_date)}</TableCell>
                  <TableCell>{income.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No income records found for this buyer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Back Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => window.history.back()}
        fullWidth={isMobile}
        sx={{
          marginBottom: 3,
        }}
      >
        Back
      </Button>

      {/* Floating "+" Button at the bottom-right corner */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 10 : 16,
          right: isMobile ? 10 : 16,
        }}
        onClick={() => navigate(`/buyer-income/form/${buyerId}`)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default BuyerIncomeDetails;