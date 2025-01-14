import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';
import API_BASE_URL from '../../config/apiConfig';
import { format } from 'date-fns';


interface CutoffRecord {
  id: number;
  name: string;
  area: string;
  varient: string;
  trees: number;
  created_date: string;
  landAvailable: {
    id: number;
    name: string;
    area: string;
    varient: string;
    trees: number;
  };
}

const CutoffRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [landName, setLandName] = useState<string>('');
  const [records, setRecords] = useState<CutoffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchCutoffRecords = async () => {
      try {
        setLoading(true); // Ensure loading state is shown during the fetch
        setError(null); // Clear any previous error

        // Fetch the land details using the land id
        const landResponse = await axios.get<{ name: string }>(`${API_BASE_URL}/api/land-available/${id}`);
        setLandName(landResponse.data.name);

        // Fetch the cutoff records associated with the land
        const recordsResponse = await axios.get<CutoffRecord[]>(`${API_BASE_URL}/api/cutoff/${id}/cutoffs`);
        setRecords(recordsResponse.data);

        if (recordsResponse.data.length === 0) {
          setError('No cutoff records available for this land.');
        }
      } catch (err) {
        setError('Failed to fetch cutoff records.');
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    };

    fetchCutoffRecords();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCreateCutoff = () => {
    navigate(`/create-cutoff/${id}`);
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

      <Button
        variant="contained"
        color="secondary"
        onClick={handleCreateCutoff}
        sx={{ marginLeft: 2, marginBottom: 2 }}
      >
        + Create Cutoff
      </Button>

      <Typography variant="h4" gutterBottom>
        Cutoff Records for {landName}
      </Typography>

      {error ? (
        <Typography variant="h6" sx={{ marginTop: 2, color: 'gray' }}>
          {error}
        </Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Area</strong></TableCell>
                <TableCell><strong>Varient</strong></TableCell>
                <TableCell><strong>No. of Cutted Trees</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
  {isNaN(new Date(record.created_date).getTime())
    ? 'Invalid Date'
    : format(new Date(record.created_date), 'dd/MM/yyyy')}
</TableCell>

                  <TableCell>{record.area}</TableCell>
                  <TableCell>{record.varient}</TableCell>
                  <TableCell>{record.trees}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || 'Cutoff records loaded successfully.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CutoffRecord;
