import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Grid,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  TextField,
  Alert,
  AlertTitle,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import API_BASE_URL from '../../config/apiConfig';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  width: '100%',
  marginTop: 50,
  marginBottom: 50,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const productNames = [
  { id: 1, name: 'நாடு' },
  { id: 2, name: 'கோழிக்குடு' },
  { id: 3, name: 'கற்பூரவள்ளி' },
  { id: 4, name: 'சக்கை' },
  { id: 5, name: 'கதளி' },
  { id: 6, name: 'நேந்திரம்' },
  { id: 7, name: 'பூவன்' },
  { id: 8, name: 'ரஸ்தாளி' },
  { id: 9, name: 'Transport' },
];

const BuyerRecordForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { buyerId } = useParams<{ buyerId: string }>();
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [visitDate, setVisitDate] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [varients, setVarients] = useState([
    {
      productName: 1,
      quantity: 0,
      weight: 0,
      rate: 0,
      price: 0,
      calcBy: 'weight',
      orderIndex: 0,
    },
  ]);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/buyers/${buyerId}`);
        setSelectedBuyer(response.data);
      } catch (error) {
        console.error('Error fetching buyer:', error);
      }
    };
    if (buyerId) {
      fetchBuyer();
    }
  }, [buyerId]);

  const handleVarientChange = (
    index: number,
    field: keyof typeof varients[number],
    value: any
  ) => {
    const updatedVarients = [...varients];
    const updatedVarient = {
      ...updatedVarients[index],
      [field]: value,
    };
  
    const { quantity, weight, rate, calcBy } = updatedVarient;
    const price = (calcBy === 'quantity' ? quantity : weight) * rate;
    updatedVarient.price = isNaN(price) ? 0 : price;
  
    updatedVarients[index] = updatedVarient;
    setVarients(updatedVarients);
  };
  

  const addVarient = () => {
    setVarients(prev => [
      ...prev,
      {
        productName: 1,
        quantity: 0,
        weight: 0,
        rate: 0,
        price: 0,
        calcBy: 'weight',
        orderIndex: prev.length,
      },
    ]);
  };

  const removeVarient = (index: number) => {
    if (varients.length > 1) {
      setVarients(varients.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBuyer) {
      setAlert({ type: 'error', message: 'Please select a buyer.' });
      return;
    }
    const formData = {
      buyer: { id: selectedBuyer.id },
      visitDate,
      amount: amount || 0,
      varients: varients.map((varient, index) => ({
        productName:
          productNames.find(product => product.id === varient.productName)?.name || '',
        quantity: varient.quantity || 0,
        price: varient.price || 0,
        weight: varient.weight || 0,
        rate: varient.rate || 0,
        orderIndex: index,
      })),
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/api/buyer-records`, formData);
      if (response.status === 201) {
        setAlert({ type: 'success', message: 'Buyer record created successfully!' });
        navigate('/');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to create buyer record. Please try again.',
      });
      console.error('Error creating buyer record:', error);
    }
  };

  return (
    <Container>
      <FormContainer elevation={3}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: theme.palette.primary.main, marginBottom: 3 }}
        >
          Create Buyer Record
        </Typography>

        {alert.type && (
          <Alert
            severity={alert.type}
            onClose={() => setAlert({ type: null, message: '' })}
            sx={{ marginBottom: 3 }}
          >
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={isMobile ? 2 : 4}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Buyer</InputLabel>
                <Select
                  value={selectedBuyer ? selectedBuyer.id : ''}
                  disabled
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value={selectedBuyer?.id}>{selectedBuyer?.name}</MenuItem>
                </Select>
                <FormHelperText>Select the buyer for this record.</FormHelperText>
              </FormControl>

              <TextField
                label="Visit Date"
                type="date"
                fullWidth
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Select the visit date."
                sx={{ marginBottom: 2 }}
              />

              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                helperText="Enter the total amount."
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {varients.map((varient, index) => (
                <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
                  <Typography variant="h6" gutterBottom>Product {index + 1}</Typography>

                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Product Name</InputLabel>
                    <Select
                      value={varient.productName}
                      onChange={(e) => handleVarientChange(index, 'productName', e.target.value)}
                    >
                      {productNames.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                   
                    <Grid item xs={6}>
                      <FormControl>
                        <label>
                          <input
                            type="checkbox"
                            checked={varient.calcBy === 'weight'}
                            onChange={() => handleVarientChange(index, 'calcBy', 'weight')}
                          /> Weight
                        </label>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl>
                        <label>
                          <input
                            type="checkbox"
                            checked={varient.calcBy === 'quantity'}
                            onChange={() => handleVarientChange(index, 'calcBy', 'quantity')}
                          /> Quantity
                        </label>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={varient.quantity}
                        onChange={(e) => handleVarientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Weight"
                        type="number"
                        fullWidth
                        value={varient.weight}
                        onChange={(e) => handleVarientChange(index, 'weight', parseFloat(e.target.value) || 0)}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Rate"
                    type="number"
                    fullWidth
                    value={varient.rate}
                    onChange={(e) => handleVarientChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    sx={{ marginTop: 2 }}
                  />

                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    value={varient.price}
                    InputProps={{ readOnly: true }}
                    sx={{ marginTop: 2 }}
                  />

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeVarient(index)}
                    disabled={varients.length === 1}
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Remove Product
                  </Button>
                </Paper>
              ))}

              <Button variant="outlined" onClick={addVarient} sx={{ marginTop: 2 }} fullWidth>
                Add Product
              </Button>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 3, width: isMobile ? '100%' : 'auto', padding: isMobile ? 1.5 : 2 }}
          >
            Submit
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
};

export default BuyerRecordForm;
