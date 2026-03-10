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

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [landOwner, setLandOwner] = useState({
    name: '',
    location: '',
    amount: 0,
    phoneNumber: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch: '',
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/land-owners/${id}`)
        .then((response) => {
          setLandOwner(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching land owner:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLandOwner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .put(`${API_BASE_URL}/api/land-owners/${id}`, landOwner)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.error('Error updating land owner:', error);
      });
  };

  if (loading) {
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
          <TextField
            label="Name"
            fullWidth
            name="name"
            value={landOwner.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Location"
            fullWidth
            name="location"
            value={landOwner.location}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Amount"
            type="number"
            fullWidth
            name="amount"
            value={landOwner.amount}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Phone Number"
            fullWidth
            name="phoneNumber"
            value={landOwner.phoneNumber}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <Typography
            variant="h6"
            sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
          >
            Bank Details
          </Typography>

          <TextField
            label="Bank Name"
            fullWidth
            name="bank_name"
            value={landOwner.bank_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Account Number"
            fullWidth
            name="account_number"
            value={landOwner.account_number}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="IFSC Code"
            fullWidth
            name="ifsc_code"
            value={landOwner.ifsc_code}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Branch"
            fullWidth
            name="branch"
            value={landOwner.branch}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth={isMobile}
            sx={{
              padding: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '0.9rem' : '1rem',
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
