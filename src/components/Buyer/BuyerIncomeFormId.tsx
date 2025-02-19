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
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

interface Buyer {
  id: number;
  name: string;
}

const BuyerIncome: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { buyerId: urlBuyerId } = useParams<{ buyerId: string }>();
  const navigate = useNavigate();

  // State for buyer details (if buyerId is provided) and for buyer list (if not)
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  // Use the buyerId from URL if available; otherwise, allow user selection
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | ''>(
    urlBuyerId ? Number(urlBuyerId) : ''
  );
  const [visitDate, setVisitDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (urlBuyerId) {
      // If buyerId is provided in the URL, fetch that buyer's details.
      axios
        .get<Buyer>(`${API_BASE_URL}/api/buyers/${urlBuyerId}`)
        .then((response) => {
          setBuyer(response.data);
          setSelectedBuyerId(response.data.id);
        })
        .catch((err) => {
          console.error('Error fetching buyer details:', err);
          setError('Error fetching buyer details.');
        });
    } else {
      // If no buyerId in the URL, fetch the full buyer list for selection.
      axios
        .get<Buyer[]>(`${API_BASE_URL}/api/buyers`)
        .then((response) => {
          setBuyers(response.data);
        })
        .catch((err) => {
  console.error('Error fetching buyer list:', err);
  setError('Error fetching buyer list.');
});

    }
  }, [urlBuyerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure all fields are filled
    if (!visitDate || !amount || !selectedBuyerId) {
      setError('Please fill out all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/buyer-income`, {
        visitDate,
        amount,
        buyer: { id: selectedBuyerId },
      });
      console.log('Response:', response.data);
      setSuccessMessage('Income data submitted successfully!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error response:', err.response?.data);
        setError(
          err.response?.data?.message || 'Error submitting buyer income data.'
        );
      } else {
        setError('Error submitting buyer income data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    if (successMessage) {
      navigate('/'); // Redirect on success
    }
    setError(null);
    setSuccessMessage(null);
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
        Buyer Income Form
      </Typography>

      {/* Form Container */}
      <Paper elevation={3} sx={{ padding: isMobile ? 2 : 4 }}>
        <form onSubmit={handleSubmit}>
          {/* Buyer Field */}
          {urlBuyerId ? (
            <TextField
              label="Buyer"
              value={buyer ? buyer.name : ''}
              fullWidth
              disabled
              sx={{ marginBottom: 2 }}
            />
          ) : (
            <TextField
              label="Select Buyer"
              select
              value={selectedBuyerId}
              onChange={(e) => setSelectedBuyerId(Number(e.target.value))}
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
          )}

          {/* Visit Date Field */}
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

          {/* Amount Field */}
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
          <Grid container justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                width: isMobile ? '100%' : 'auto',
                padding: isMobile ? 1.5 : 2,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Grid>
        </form>
      </Paper>

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
      {successMessage && (
        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BuyerIncome;