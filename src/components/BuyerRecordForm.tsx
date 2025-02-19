import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
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
} from '@mui/material';
import { styled } from '@mui/system';
import API_BASE_URL from '../config/apiConfig';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  width: '100%',
  marginTop: 50,
}));

const productNames = [
  { id: 1, name: 'நாடு' },
  { id: 2, name: 'கோழிக்குடு' },
  { id: 3, name: 'கற்பூரவள்ளி' },
  { id: 4, name: 'சக்கை' },
  { id: 5, name: 'காசாளி' }
];



const BuyerRecordForm: React.FC = () => {
  const { buyerId } = useParams<{ buyerId: string }>(); // Get buyer ID from URL
  const [buyers, setBuyers] = useState<any[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [visitDate, setVisitDate] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [varients, setVarients] = useState([
    { productName: 1, quantity: 0, price: 0, weight: 0 }
  ]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const navigate = useNavigate();

  // Fetch buyers and pre-select the buyer if buyerId is present
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/buyers`);
        setBuyers(response.data);
        if (buyerId) {
          const selected = response.data.find((buyer: any) => buyer.id === parseInt(buyerId));
          setSelectedBuyer(selected);
        }
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };
    fetchBuyers();
  }, [buyerId]);

  const handleBuyerChange = (event: any) => {
    const buyerId = event.target.value;
    const selected = buyers.find((buyer) => buyer.id === buyerId);
    setSelectedBuyer(selected || null);
  };

  const handleVarientChange = (
  index: number,
  field: keyof typeof varients[number], // Explicitly define allowed keys
  value: any
) => {
  const updatedVarients = [...varients];
  updatedVarients[index][field] = value || 0; // Now TypeScript knows `field` is valid
  setVarients(updatedVarients);
};

  const addVarient = () => {
    setVarients([...varients, { productName: 1, quantity: 0, price: 0, weight: 0 }]);
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
      varients: varients.map((varient) => ({
        productName: productNames.find((product) => product.id === varient.productName)?.name || '',
        quantity: varient.quantity || 0,
        price: varient.price || 0,
        weight: varient.weight || 0,
      })),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/buyer-records`, formData);
      if (response.status === 201) {
        setAlert({ type: 'success', message: 'Buyer record created successfully!' });
        navigate('/');
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create buyer record. Please try again.' });
      console.error('Error creating buyer record:', error);
    }
  };

  return (
    <Container>
      <FormContainer elevation={3}>
        <Typography variant="h5" gutterBottom>
          Create Buyer Record
        </Typography>
        {alert.type && (
          <Alert severity={alert.type} onClose={() => setAlert({ type: null, message: '' })}>
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {alert.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Buyer</InputLabel>
                <Select
                  value={selectedBuyer ? selectedBuyer.id : ''}
                  onChange={handleBuyerChange}
                >
                  {buyers.map((buyer) => (
                    <MenuItem key={buyer.id} value={buyer.id}>
                      {buyer.name}
                    </MenuItem>
                  ))}
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
                sx={{ marginTop: 2 }}
              />

              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                helperText="Enter the total amount."
                sx={{ marginTop: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {varients.map((varient, index) => (
                <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
                  <Typography variant="h6">Product {index + 1}</Typography>

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

                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={varient.quantity}
                    onChange={(e) => handleVarientChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    sx={{ marginBottom: 2 }}
                  />

                  <TextField
                    label="Weight"
                    type="number"
                    fullWidth
                    value={varient.weight}
                    onChange={(e) => handleVarientChange(index, 'weight', parseFloat(e.target.value) || 0)}
                    sx={{ marginBottom: 2 }}
                  />

                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    value={varient.price}
                    onChange={(e) => handleVarientChange(index, 'price', parseFloat(e.target.value) || 0)}
                    sx={{ marginBottom: 2 }}
                  />

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeVarient(index)}
                    disabled={varients.length === 1}
                  >
                    Remove Product
                  </Button>
                </Paper>
              ))}
              <Button variant="outlined" onClick={addVarient} sx={{ marginTop: 2 }}>
                Add Product
              </Button>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 3 }}
          >
            Submit
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
};

export default BuyerRecordForm;
