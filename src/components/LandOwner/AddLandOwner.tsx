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
  const [name, setName] = useState(''); // Store name input
  const [amount, setAmount] = useState(0); // Store amount input
  const [location, setLocation] = useState(''); // Store location input
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Show loading state while submitting
    setLoading(true);
    try {
      // Send POST request to add a new land owner
      await axios.post(`${API_BASE_URL}/api/land-owners`, {
        name,
        amount,
        location,
      });

      // After successful submission, navigate back to the land owners list
      navigate('/landowners');
    } catch (error) {
      console.error('Error adding land owner:', error);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Form Container */}
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
          Add Land Owner
        </Typography>

        {/* Form Fields */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Name Input */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          {/* Amount Input */}
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          {/* Location Input */}
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          {/* Submit Button */}
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