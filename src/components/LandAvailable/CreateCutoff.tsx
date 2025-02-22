import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import API_BASE_URL from '../../config/apiConfig';

const CreateCutoff: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id of the land available
  const navigate = useNavigate();

  // State variables
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [varient, setVarient] = useState('');
  const [trees, setTrees] = useState<number | string>('');
  const [amount, setAmount] = useState<number | string>(''); // New field
  const [weight, setWeight] = useState<number | string>(''); // New field
  const [ship, setShip] = useState(''); // New field
  const [landLoading, setLandLoading] = useState(true); // to show loading for fetching land data
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch land available details
  useEffect(() => {
    const fetchLandDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/land-available/${id}`);
        setName(response.data.name);
        setArea(response.data.area);
        setVarient(response.data.varient);
      } catch (err) {
        setError('Failed to fetch land details.');
      } finally {
        setLandLoading(false);
      }
    };

    fetchLandDetails();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const cutoffData = {
        name,
        area,
        varient,
        trees: Number(trees),
        amount: Number(amount), // New field
        weight: Number(weight), // New field
        ship, // New field
        landAvailable: {
          id: Number(id), // Passing the land ID to associate with the cutoff
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/cutoff/${id}`,
        cutoffData
      );

      if (response.status === 200) {
        navigate(`/cutoff-records/${id}`); // Navigate to the cutoff records page
      }
    } catch (err) {
      setError('Failed to create cutoff record. Please try again.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    navigate(-1);
  };

  if (landLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Create Cutoff Record
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Land Name" fullWidth value={name} disabled sx={{ marginBottom: 2 }} />
        <TextField label="Area" fullWidth value={area} disabled sx={{ marginBottom: 2 }} />
        <TextField label="Varient" fullWidth value={varient} disabled sx={{ marginBottom: 2 }} />
        <TextField
          label="No. of Trees"
          fullWidth
          type="number"
          value={trees}
          onChange={(e) => setTrees(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Amount"
          fullWidth
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Weight"
          fullWidth
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Ship"
          fullWidth
          value={ship}
          onChange={(e) => setShip(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || 'Cutoff record created successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateCutoff;
