import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

const LandOwnerForm: React.FC = () => {
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
          navigate('/landowners'); // Navigate back to the list of land owners after update
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
      <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Edit Land Owner
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Name (editable now) */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={landOwner.name || ''}  // Ensure it's not undefined
          name="name" // Ensure the name property is correctly updated in the state
          onChange={handleChange}
          sx={{ marginBottom: '10px' }}
        />
        
        {/* Location (editable now) */}
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          value={landOwner.location || ''}  // Ensure it's not undefined
          name="location" // Ensure the location property is correctly updated in the state
          onChange={handleChange}
          sx={{ marginBottom: '10px' }}
        />
        
        {/* Amount (editable) */}
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          value={landOwner.amount}
          name="amount"
          onChange={handleChange}
          sx={{ marginBottom: '20px' }}
        />
        
        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default LandOwnerForm;
