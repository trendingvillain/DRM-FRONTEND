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
import API_BASE_URL from '../config/apiConfig';  // Replace with your API base URL

interface Buyer {
  id: number;
  name: string;
}

const BuyerIncome: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);  // State for storing buyers
  const [buyerId, setBuyerId] = useState<number | ''>('');  // Selected buyer's id
  const [visitDate, setVisitDate] = useState<string>('');  // Visit date
  const [amount, setAmount] = useState<number>(0);  // Amount for income
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for submit
  const [error, setError] = useState<string | null>(null);  // Error state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // Success state
  const navigate = useNavigate();  // React Router navigate for redirection

  // Fetch buyers when component mounts
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get<Buyer[]>(`${API_BASE_URL}/api/buyers`);
        setBuyers(response.data);  // Set the fetched buyers in state
      } catch (err) {
        setError('Error fetching buyer list.');
      }
    };

    fetchBuyers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled out
    if (!visitDate || !amount || !buyerId) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);  // Set loading state to true
    setError(null);  // Reset error state

    try {

      // Send POST request with the form data
      const response = await axios.post(`${API_BASE_URL}/api/buyer-income`, {
        visitDate,
        amount,
        buyer: { id: buyerId },
      });

      // Handle successful submission
      console.log('Response:', response.data);
      setSuccessMessage('Income data submitted successfully!');
    } catch (err) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        console.error('Axios error response:', err.response?.data);
        setError(err.response?.data?.message || 'Error submitting buyer income data.');
      } else {
        setError('Error submitting buyer income data.');
      }
    } finally {
      setLoading(false);  // Set loading state to false
    }
  };

  // Close Snackbar and navigate on success
  const handleSnackbarClose = () => {
    if (successMessage) {
      navigate('/');  // Redirect to home on success
    }
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Income Form
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Select Buyer */}
        <TextField
          label="Select Buyer"
          select
          value={buyerId}
          onChange={(e) => setBuyerId(Number(e.target.value))}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        >
          {buyers.map((buyer) => (
            <MenuItem key={buyer.id} value={buyer.id}>
              {buyer.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Visit Date */}
        <TextField
          label="Visit Date"
          type="date"
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

export default BuyerIncome;
