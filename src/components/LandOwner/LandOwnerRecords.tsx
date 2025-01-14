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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

interface LandOwnerRecord {
  id: number;
  visit_date: string;
  amount: number;
  reason: string;
}

const LandOwnerRecord: React.FC = () => {
  const { id } = useParams(); // Get the land owner's ID from the URL params
  const navigate = useNavigate(); // For navigation
  const [landOwnerRecords, setLandOwnerRecords] = useState<LandOwnerRecord[]>([]); // Store land owner records
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch the land owner's record details when the component mounts
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/land-owners-records/owner/${id}`)
        .then((response) => {
          setLandOwnerRecords(response.data); // Set the land owner records data
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error('Error fetching land owner record details:', error); // Handle errors
          setLoading(false); // Stop loading even if there's an error
        });
    }
  }, [id]);

  // Handle the back navigation
  const handleBack = () => {
    navigate('/landowners'); // Navigate back to the land owners list
  };

  if (loading) {
    // Show a loading spinner while fetching the data
    return (
      <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Land Owner Record Details
      </Typography>

      {/* Table displaying Land Owner Record details */}
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Visit Date</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {landOwnerRecords.length > 0 ? (
              landOwnerRecords.map((record) => (
                <TableRow key={record.id}>
                  {/* Display visitDate, amount, and reason */}
                  <TableCell>{new Date(record.visit_date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>{record.reason}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No land owner record details found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Back Button */}
      <Button variant="contained" color="primary" sx={{ marginTop: '20px' }} onClick={handleBack}>
        Back to Land Owners
      </Button>
    </Box>
  );
};

export default LandOwnerRecord;
