import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { SelectChangeEvent } from '@mui/material/Select';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  width: '100%',
  marginTop: 50,
}));

const productNames = [
  { id: 1, name: 'Variant A' },
  { id: 2, name: 'Variant B' },
  { id: 3, name: 'Variant C' },
  { id: 4, name: 'Variant D' },
  { id: 5, name: 'Variant E' },
  { id: 6, name: 'Variant F' },
];

const BuyerRecordForm: React.FC = () => {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [visitDate, setVisitDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [varients, setVarients] = useState<
    { productName: number; quantity: number; price: number; weight: number }[]
  >([{ productName: 1, quantity: 0, price: 0, weight: 0 }]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/buyers`);
        setBuyers(response.data);
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };
    fetchBuyers();
  }, []);

  const handleBuyerChange = (event: SelectChangeEvent<any>) => {
    const buyerId = event.target.value;
    const selected = buyers.find((buyer) => buyer.id === buyerId);
    setSelectedBuyer(selected || null);
  };

  const handleVarientChange = (index: number, field: string, value: any) => {
    const updatedVarients = [...varients];
    updatedVarients[index] = { ...updatedVarients[index], [field]: value || 0 };
    setVarients(updatedVarients);
  };

  const addVarient = () => {
    setVarients([...varients, { productName: 1, quantity: 0, price: 0, weight: 0 }]);
  };

  const removeVarient = (index: number) => {
    if (varients.length > 1) {
      const updatedVarients = varients.filter((_, i) => i !== index);
      setVarients(updatedVarients);
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
        setSelectedBuyer(null);
        setVisitDate('');
        setAmount(0);
        setVarients([{ productName: 1, quantity: 0, price: 0, weight: 0 }]);
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
                <Select value={selectedBuyer ? selectedBuyer.id : ''} onChange={handleBuyerChange}>
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
              />
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                helperText="Enter the total amount."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {varients.map((varient, index) => (
                <Paper key={index} style={{ padding: 16, marginBottom: 16 }}>
                  <Typography variant="h6">Product {index + 1}</Typography>
                  <FormControl fullWidth>
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
                    <FormHelperText>Select the product name.</FormHelperText>
                  </FormControl>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={varient.quantity || ''}
                    onChange={(e) => handleVarientChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    helperText="Enter the product quantity."
                  />
                  <TextField
                    label="Weight"
                    type="number"
                    fullWidth
                    value={varient.weight || ''}
                    onChange={(e) => handleVarientChange(index, 'weight', parseFloat(e.target.value) || 0)}
                    helperText="Enter the product weight."
                  />
                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    value={varient.price || ''}
                    onChange={(e) => handleVarientChange(index, 'price', parseFloat(e.target.value) || 0)}
                    helperText="Enter the product price."
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
              <Button variant="outlined" onClick={addVarient}>
                Add Product
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </Container>
  );
};

export default BuyerRecordForm;
