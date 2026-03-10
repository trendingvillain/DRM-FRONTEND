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

  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  const [selectedBuyerId, setSelectedBuyerId] = useState<number | ''>(
    urlBuyerId ? Number(urlBuyerId) : ''
  );

  const [visitDate, setVisitDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  // NEW FIELDS
  const [payment, setPayment] = useState<string>('cash');
  const [reason, setReason] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (urlBuyerId) {
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
        payment,
        reason,
        buyer: { id: selectedBuyerId },
      });

      console.log('Response:', response.data);

      setSuccessMessage('Income data submitted successfully!');

      // Reset form
      setVisitDate('');
      setAmount(0);
      setPayment('cash');
      setReason('');

    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error response:', err.response?.data);
        setError(
          err.response?.data?.message ||
            'Error submitting buyer income data.'
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
      navigate('/');
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

      {/* Form */}
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

          {/* Visit Date */}
          <TextField
            label="Visit Date"
            type="date"
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

          {/* Payment Type */}
          <TextField
            label="Payment Type"
            select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="bank">Bank</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
          </TextField>

          {/* Reason */}
          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            rows={2}
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
          <Alert severity="error" onClose={handleSnackbarClose}>
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
          <Alert severity="success" onClose={handleSnackbarClose}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BuyerIncome;
