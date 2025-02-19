import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

interface LandOwner {
  id: number;
  name: string;
}

const LandOwnerRecordForm: React.FC = () => {
  const { id } = useParams(); // Get landowner ID from URL
  const [landOwner, setLandOwner] = useState<LandOwner | null>(null);
  const [reason, setReason] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetchingOwner, setFetchingOwner] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch Land Owner Name from URL ID
  useEffect(() => {
    const fetchLandOwner = async () => {
      if (!id) {
        setError('Invalid Landowner ID.');
        setFetchingOwner(false);
        return;
      }

      try {
        const response = await axios.get<LandOwner>(`${API_BASE_URL}/api/land-owners/${id}`);
        setLandOwner(response.data);
      } catch (err) {
        setError('Failed to fetch landowner details.');
      } finally {
        setFetchingOwner(false);
      }
    };

    fetchLandOwner();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitDate || !amount || !reason || !landOwner) {
      setError('All fields are required.');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_BASE_URL}/api/land-owners-records`, {
        landOwner: { id: landOwner.id },
        reason,
        visitDate,
        amount,
      });

      setSuccessMessage('Landowner record created successfully!');
    } catch (err) {
      setError('Error creating landowner record.');
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    if (successMessage) {
      navigate(`/landowner-record-details/${id}`); // Redirect to landowner's records
    }
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Land Owner Record Form
      </Typography>

      {/* Display error message */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {/* Show loading spinner while fetching landowner */}
      {fetchingOwner ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : landOwner ? (
        <form onSubmit={handleSubmit}>
          {/* Land Owner Name (Read-Only) */}
          <TextField
            label="Land Owner"
            value={landOwner.name}
            fullWidth
            disabled
            sx={{ marginBottom: 2 }}
          />

          {/* Reason */}
          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />

          {/* Visit Date */}
          <TextField
            label="Visit Date"
            type="datetime-local"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Amount */}
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </form>
      ) : (
        <Typography color="error" textAlign="center">
          Landowner not found.
        </Typography>
      )}

      {/* Success Snackbar */}
      {successMessage && (
        <Snackbar open autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default LandOwnerRecordForm;
