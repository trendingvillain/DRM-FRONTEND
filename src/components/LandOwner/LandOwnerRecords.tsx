import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  TextField,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import AddIcon from '@mui/icons-material/Add';

interface LandOwnerRecord {
  id: number;
  visit_date: string;
  amount: number;
  reason: string;
}

const LandOwnerRecord: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [landOwnerRecords, setLandOwnerRecords] = useState<LandOwnerRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<LandOwnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/land-owners-records/owner/${id}`)
        .then((response) => {
          const sortedRecords = response.data.sort(
            (a: LandOwnerRecord, b: LandOwnerRecord) =>
              new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
          );
          setLandOwnerRecords(sortedRecords);
          setFilteredRecords(sortedRecords);

          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();

          setTodayCount(sortedRecords.filter((r:LandOwnerRecord) => r.visit_date.startsWith(todayStr)).length);
          setMonthCount(
            sortedRecords.filter((r:LandOwnerRecord) => {
              const date = new Date(r.visit_date);
              return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length
          );
          setYearCount(
            sortedRecords.filter((r:LandOwnerRecord) => new Date(r.visit_date).getFullYear() === currentYear).length
          );
        })
        .catch((error) => {
          console.error('Error fetching land owner record details:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert('Please select both "From Date" and "To Date".');
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      alert('"From Date" cannot be later than "To Date".');
      return;
    }

    setFilteredRecords(
      landOwnerRecords.filter((r) => {
        const date = new Date(r.visit_date);
        return date >= from && date <= to;
      })
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
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
        Land Owner Record Details
      </Typography>

      {/* Counts Section */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="body1">
          <strong>Today's Records:</strong> {todayCount}
        </Typography>
        <Typography variant="body1">
          <strong>This Month's Records:</strong> {monthCount}
        </Typography>
        <Typography variant="body1">
          <strong>This Year's Records:</strong> {yearCount}
        </Typography>
      </Paper>

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
          InputLabelProps={{ shrink: true }}
          fullWidth={isMobile}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
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

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: isMobile ? '300px' : '400px',
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
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Reason
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.visit_date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>{record.reason}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No land owner record details found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Back Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/landowners')}
        fullWidth={isMobile}
        sx={{
          padding: isMobile ? 1.5 : 2,
          fontSize: isMobile ? '0.8rem' : '1rem',
        }}
      >
        Back to Land Owners
      </Button>

      {/* Floating "+" Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 10 : 16,
          right: isMobile ? 10 : 16,
        }}
        onClick={() => navigate(`/Land-record/form/${id}`)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default LandOwnerRecord;