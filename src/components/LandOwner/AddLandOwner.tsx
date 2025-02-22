import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

const AddLandOwner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate(); // For navigation after adding the land owner

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle phone number validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (input.length > 10) return; // Limit to 10 digits

    setPhoneNumber(input);

    if (input.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError) return; // Prevent submission if phone validation fails

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/land-owners`, {
        name,
        amount,
        location,
        phoneNumber: `${phoneNumber}`, // Ensure +91 prefix
      });

      navigate(-1); // Redirect after success
    } catch (error) {
      console.error('Error adding land owner:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          padding: isMobile ? 2 : 4,
          maxWidth: isMobile ? '100%' : 600,
          width: '100%',
          margin: 'auto',
          marginTop: isMobile ? 2 : 5,
        }}
      >
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
          Add Land Owner
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          {/* Phone Number Input */}
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={handlePhoneChange}
            required
            error={!!phoneError}
            helperText={phoneError}
            inputProps={{ maxLength: 10 }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              padding: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '0.8rem' : '1rem',
            }}
          >
            {loading ? 'Adding...' : 'Add Land Owner'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddLandOwner;
