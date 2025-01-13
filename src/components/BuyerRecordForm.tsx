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
  marginTop: theme.spacing(6),
}));

interface Buyer {
  id: number;
  name: string;
}

interface Variant {
  productName: number;
  quantity: number;
  price: number;
}

const productNames = [
  { id: 1, name: 'Variant A' },
  { id: 2, name: 'Variant B' },
  { id: 3, name: 'Variant C' },
  { id: 4, name: 'Variant D' },
  { id: 5, name: 'Variant E' },
  { id: 6, name: 'Variant F' },
];

const BuyerRecordForm: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [visitDate, setVisitDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [variants, setVariants] = useState<Variant[]>([
    { productName: 1, quantity: 0, price: 0 },
  ]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Fetch buyers on component mount
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/buyers`);
        setBuyers(response.data);
      } catch (error) {
        console.error('Error fetching buyers:', error);
        setAlert({ type: 'error', message: 'Failed to fetch buyers. Please try again.' });
      }
    };
    fetchBuyers();
  }, []);

  const handleBuyerChange = (event: SelectChangeEvent<string>) => {
    const buyerId = parseInt(event.target.value, 10);
    const selected = buyers.find((buyer) => buyer.id === buyerId);
    setSelectedBuyer(selected || null);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: number) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value || 0 };
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { productName: 1, quantity: 0, price: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setSelectedBuyer(null);
    setVisitDate('');
    setAmount(0);
    setVariants([{ productName: 1, quantity: 0, price: 0 }]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedBuyer) {
      setAlert({ type: 'error', message: 'Please select a buyer.' });
      return;
    }

    if (!visitDate) {
      setAlert({ type: 'error', message: 'Please select a visit date.' });
      return;
    }

    const formData = {
      buyer: { id: selectedBuyer.id },
      visitDate,
      amount: amount || 0,
      variants: variants.map((variant) => ({
        productName: productNames.find((product) => product.id === variant.productName)?.name || '',
        quantity: variant.quantity || 0,
        price: variant.price || 0,
      })),
    };

    try {
      await axios.post(`${API_BASE_URL}/api/buyer-records`, formData);
      setAlert({ type: 'success', message: 'Buyer record created successfully!' });
      resetForm();
    } catch (error: any) {
      console.error('Error creating buyer record:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to create buyer record. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const renderVariantFields = () => {
    return variants.map((variant, index) => (
      <Paper key={index} style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6">Product {index + 1}</Typography>
        <FormControl fullWidth>
          <InputLabel>Product Name</InputLabel>
          <Select
  value={variant.productName}
  onChange={(e) => handleVariantChange(index, 'productName', parseInt(e.target.value as string, 10))}
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
          value={variant.quantity || ''}
          onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value, 10) || 0)}
          helperText="Enter the product quantity."
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          value={variant.price || ''}
          onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
          helperText="Enter the product price."
        />
        <Button
          variant="outlined"
          color="error"
          onClick={() => removeVariant(index)}
          disabled={variants.length === 1}
        >
          Remove Product
        </Button>
      </Paper>
    ));
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
                <Select value={selectedBuyer ? selectedBuyer.id.toString() : ''} onChange={handleBuyerChange}>
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
              {renderVariantFields()}
              <Button variant="outlined" onClick={addVariant}>
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
