import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

const LandOwnerForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams(); // Get the id from the URL params
  const navigate = useNavigate();
  const [landOwner, setLandOwner] = useState({
    name: '',
    amount: 0,
    location: '',
  });
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch the current land owner details when the component mounts
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/land-owners/${id}`) // Updated API endpoint
        .then((response) => {
          setLandOwner(response.data); // Populate state with fetched data
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch((error) => {
          console.error('Error fetching land owner data:', error);
          setLoading(false); // Handle error gracefully by stopping the loading state
        });
    }
  }, [id]);

  // Handle form submission for updating the land owner
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      axios
        .put(`${API_BASE_URL}/api/land-owners/${id}`, landOwner)
        .then(() => {
          navigate(-1); // Navigate back to the list of land owners after update
        })
        .catch((error) => {
          console.error('Error updating land owner:', error);
        });
    }
  };

  // Handle changes in the editable fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLandOwner((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    // Show a loading spinner while the data is being fetched
    return (
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
        Edit Land Owner
      </Typography>

      {/* Form Container */}
      <Paper
        elevation={3}
        sx={{
          padding: isMobile ? 2 : 4,
          maxWidth: isMobile ? '100%' : 600,
          width: '100%',
          margin: 'auto',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={landOwner.name || ''}
            name="name"
            onChange={handleChange}
            required
            autoFocus
            sx={{ marginBottom: 2 }}
          />

          {/* Location Field */}
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={landOwner.location || ''}
            name="location"
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />

          {/* Amount Field */}
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            type="number"
            value={landOwner.amount}
            name="amount"
            onChange={handleChange}
            required
            sx={{ marginBottom: 3 }}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth={isMobile}
            sx={{
              padding: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '0.8rem' : '1rem',
            }}
          >
            Save Changes
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LandOwnerForm;