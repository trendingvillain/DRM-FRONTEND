import React, { useState, useEffect } from 'react';
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

interface Landowner {
  id: number;
  name: string;
}

const AddLandAvailable: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [area, setArea] = useState('');
  const [varient, setVarient] = useState('');
  const [trees, setTrees] = useState<number | string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [landOwnerId, setLandOwnerId] = useState<number | ''>('');
  const [landOwners, setLandOwners] = useState<Landowner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Fetch landowners from API
    const fetchLandOwners = async () => {
      try {
        const response = await axios.get<Landowner[]>(`${API_BASE_URL}/api/land-owners`);
        setLandOwners(response.data);
      } catch (err) {
        console.error('Error fetching landowners:', err);
      }
    };
    fetchLandOwners();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Prepare the data to be sent
      const landData = {
        name,
        place,
        area: Number(area),
        varient,
        trees: Number(trees),
        amount: Number(amount),
        landOwnerId: Number(landOwnerId),
      };

      // Make a POST request to create a new land available
      const response = await axios.post(`${API_BASE_URL}/api/land-available`, landData);

      if (response.status === 200) {
        navigate('/land-available');
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
    navigate(-1);
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
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Landowner</InputLabel>
            <Select
              value={landOwnerId}
              onChange={(e) => setLandOwnerId(Number(e.target.value))}
              label="Landowner"
            >
              {landOwners.map((owner) => (
                <MenuItem key={owner.id} value={owner.id}>
                  {owner.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            type="number"
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

          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          {/* Landowner Select Dropdown */}
          

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
