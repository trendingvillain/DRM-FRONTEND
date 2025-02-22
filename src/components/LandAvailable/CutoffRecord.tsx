import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Stack,
} from '@mui/material';
import API_BASE_URL from '../../config/apiConfig';
import { format } from 'date-fns';

interface CutoffRecord {
  id: number;
  name: string;
  area: string;
  varient: string;
  trees: number;
  ship: string;
  amount: number;
  weight: number;
  created_date: string;
}

const CutoffRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [landName, setLandName] = useState<string>('');
  const [landVarient, setLandVarient] = useState<string>('');
  const [records, setRecords] = useState<CutoffRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CutoffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    const fetchCutoffRecords = async () => {
      try {
        setLoading(true);

        const landResponse = await axios.get(`${API_BASE_URL}/api/land-available/${id}`);
        setLandName(landResponse.data.name);
        setLandVarient(landResponse.data.varient);

        const recordsResponse = await axios.get(`${API_BASE_URL}/api/cutoff/${id}/cutoffs`);
        const sortedRecords = recordsResponse.data.sort(
          (a: CutoffRecord, b: CutoffRecord) =>
            new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        );
        setRecords(sortedRecords);
        setFilteredRecords(sortedRecords);

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        setTodayCount(
          sortedRecords.filter((r: CutoffRecord) => new Date(r.created_date).toDateString() === today.toDateString()).length
        );

        setMonthCount(
          sortedRecords.filter((r: CutoffRecord) =>
            new Date(r.created_date).getMonth() === currentMonth &&
            new Date(r.created_date).getFullYear() === currentYear
          ).length
        );

        setYearCount(
          sortedRecords.filter((r: CutoffRecord) => new Date(r.created_date).getFullYear() === currentYear).length
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCutoffRecords();
  }, [id]);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates.');
      return;
    }
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDateObj > toDateObj) {
      alert('From Date cannot be later than To Date.');
      return;
    }

    const filtered = records.filter((record) => {
      const recordDate = new Date(record.created_date);
      return recordDate >= fromDateObj && recordDate <= toDateObj;
    });
    setFilteredRecords(filtered);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ marginBottom: 2 }}>
        Go Back
      </Button>
      <Button variant="contained" color="secondary" onClick={() => navigate(`/create-cutoff/${id}`)} sx={{ marginLeft: 2, marginBottom: 2 }}>
        + Create Cutoff
      </Button>
      <Typography variant="h4" gutterBottom>
        Cutoff Records for {landName}, {landVarient}
      </Typography>
      <Typography><strong>Today's Records:</strong> {todayCount}</Typography>
      <Typography><strong>This Month's Records:</strong> {monthCount}</Typography>
      <Typography><strong>This Year's Records:</strong> {yearCount}</Typography>
      <Stack direction="row" spacing={2} sx={{ marginY: 2 }}>
        <TextField label="From Date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="To Date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleFilter}>Filter</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Area</strong></TableCell>
              <TableCell><strong>No. of Cutted Trees</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Weight</strong></TableCell>
              <TableCell><strong>Ship</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length ? filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.created_date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{record.area}</TableCell>
                <TableCell>{record.trees}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.weight}</TableCell>
                <TableCell>{record.ship}</TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={3} align="center">No records found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CutoffRecord;
