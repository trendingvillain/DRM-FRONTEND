import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import API_BASE_URL from '../config/apiConfig';
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

const CutoffsRecords: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [records, setRecords] = useState<CutoffRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CutoffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    const fetchCutoffRecords = async () => {
      try {
        setLoading(true);

        const recordsResponse = await axios.get(`${API_BASE_URL}/api/cutoff/all`);
        const sortedRecords = [...recordsResponse.data].sort(
          (a: CutoffRecord, b: CutoffRecord) =>
            new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        );

        setRecords(sortedRecords);
        setFilteredRecords(sortedRecords); // ✅ Ensure all records are displayed initially
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

  const handleResetFilter = () => {
    setFilteredRecords(records);
    setFromDate('');
    setToDate('');
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
      
      <Typography variant="h4" gutterBottom>
        Cutoff Records
      </Typography>

      {/* Date Filter */}
      <Stack direction="row" spacing={2} sx={{ marginY: 2 }}>
        <TextField label="From Date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="To Date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleFilter}>Filter</Button>
        <Button variant="outlined" onClick={handleResetFilter}>Show All Records</Button>
      </Stack>

      {/* Data Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Area</strong></TableCell>
              <TableCell><strong>No. of Cutted Trees</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Weight</strong></TableCell>
              <TableCell><strong>Ship</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.created_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.area}</TableCell>
                  <TableCell>{record.trees}</TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>{record.weight}</TableCell>
                  <TableCell>{record.ship}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No records found.</TableCell> {/* ✅ Corrected colSpan */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CutoffsRecords;
