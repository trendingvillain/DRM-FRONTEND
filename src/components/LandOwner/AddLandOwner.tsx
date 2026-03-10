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
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');

    if (input.length > 10) return;

    setPhoneNumber(input);

    if (input.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneError) return;

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/land-owners`, {
        name,
        amount,
        location,
        phoneNumber,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        branch,
      });

      navigate(-1);

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
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <TextField
            label="Phone Number"
            fullWidth
            value={phoneNumber}
            onChange={handlePhoneChange}
            required
            error={!!phoneError}
            helperText={phoneError}
            inputProps={{ maxLength: 10 }}
          />

          {/* Bank Details Section */}

          <Typography
            variant="h6"
            sx={{ marginTop: 2, color: theme.palette.primary.main }}
          >
            Bank Details
          </Typography>

          <TextField
            label="Bank Name"
            fullWidth
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />

          <TextField
            label="Account Number"
            fullWidth
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          <TextField
            label="IFSC Code"
            fullWidth
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />

          <TextField
            label="Branch"
            fullWidth
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              padding: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '0.9rem' : '1rem',
              marginTop: 2,
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
