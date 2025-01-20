import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import API_BASE_URL from '../../config/apiConfig';

const variants = [
  { id: 1, name: 'நாடு' },
  { id: 2, name: 'கோழிக்குடு' },
  { id: 3, name: 'கற்பூரவள்ளி' },
  { id: 4, name: 'சக்கை' },
  { id: 5, name: 'காசாளி' }
];

const AddLandAvailable: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [area, setArea] = useState('');
  const [varient, setVarient] = useState('');
  const [trees, setTrees] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Prepare the data to be sent
      const landData = {
        name,
        place,
        area,
        varient,
        trees: Number(trees),
      };

      // Make a POST request to create a new land available
      const response = await axios.post(`${API_BASE_URL}/api/land-available`, landData);

      if (response.status === 200) {
        // Redirect to the list of land available or the relevant page
        navigate('/land-available'); // Adjust the route as necessary
      }
    } catch (err) {
      setError('Failed to add land available. Please try again.');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Add Land Available
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Land Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2 }}
            />
            <TextField
            label="Place"
            fullWidth
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Area"
            fullWidth
            value={area}
            onChange={(e) => setArea(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          
          {/* Variant Select Dropdown */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Variant</InputLabel>
            <Select
              value={varient}
              onChange={(e) => setVarient(e.target.value)}
              label="Variant"
            >
              {variants.map((variant) => (
                <MenuItem key={variant.id} value={variant.name}>
                  {variant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="No. of Trees"
            fullWidth
            type="number"
            value={trees}
            onChange={(e) => setTrees(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/land-available')}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </form>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || 'Land available added successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLandAvailable;
