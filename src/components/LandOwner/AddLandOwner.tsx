import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

const AddLandOwner: React.FC = () => {
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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add Land Owner
      </Typography>

      {/* Name Input */}
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ marginBottom: '10px' }}
      />

      {/* Amount Input */}
      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        sx={{ marginBottom: '10px' }}
      />

      {/* Location Input */}
      <TextField
        label="Location"
        variant="outlined"
        fullWidth
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading} // Disable the button while loading
      >
        {loading ? 'Adding...' : 'Add Land Owner'}
      </Button>
    </Box>
  );
};

export default AddLandOwner;
