import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import API_BASE_URL from '../../config/apiConfig';

interface LandAvailable {
  id: number;
  name: string;
  area: string;
  varient: string;
  trees: number;
}

const EditLandAvailable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [land, setLand] = useState<LandAvailable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<LandAvailable>(
          `${API_BASE_URL}/api/land-available/${id}`
        )
        setLand(response.data);
      } catch (err) {
        setError('Failed to fetch land data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (land) {
      setLand({ ...land, [name]: name === 'trees' ? parseInt(value, 10) : value });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (land) {
      try {
        await axios.put(`${API_BASE_URL}/api/land-available/${id}`, land);
        setSnackbarOpen(true);
        setTimeout(() => navigate('/land-available'), 1500); // Redirect after 1.5 seconds
      } catch (err) {
        setError('Failed to update land data.');
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Edit Land Available
      </Typography>
      {land && (
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Name"
            name="name"
            value={land.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Area"
            name="area"
            value={land.area}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Varient"
            name="varient"
            value={land.varient}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Number of Trees"
            name="trees"
            type="number"
            value={land.trees}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
          </Box>
        </form>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Land details updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditLandAvailable;
