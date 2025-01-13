import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';

interface LandOwner {
  id: number;
  name: string;
}

const LandOwnerRecordForm: React.FC = () => {
  const [landOwners, setLandOwners] = useState<LandOwner[]>([]);
  const [landOwnerId, setLandOwnerId] = useState<number | ''>('');
  const [reason, setReason] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLandOwners = async () => {
      try {
        const response = await axios.get<LandOwner[]>(`${API_BASE_URL}/api/land-owners`);
        setLandOwners(response.data);
      } catch (err) {
        setError('Error fetching landowners list.');
      }
    };

    fetchLandOwners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitDate || !amount || !reason || !landOwnerId) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/land-owners-records`, {
        landOwner: { id: landOwnerId },
        reason,
        visitDate,
        amount,
      });
      console.log('Response:', response.data);
      setSuccessMessage('Landowner record created successfully!');
    } catch (err) {
      setError('Error creating landowner record.');
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    if (successMessage) {
      navigate('/'); // Redirect to home on success
    }
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Land Owner Record Form
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Select Land Owner */}
        <TextField
          label="Select Land Owner"
          select
          value={landOwnerId}
          onChange={(e) => setLandOwnerId(Number(e.target.value))}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        >
          {landOwners.map((landOwner) => (
            <MenuItem key={landOwner.id} value={landOwner.id}>
              {landOwner.name}
            </MenuItem>
          ))}
        </TextField>

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
          InputLabelProps={{
            shrink: true,
          }}
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

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </form>

      {/* Error Snackbar */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Success Snackbar */}
      {successMessage && (
        <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default LandOwnerRecordForm;
