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
  TextField,
  Alert,
  AlertTitle,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';

import API_BASE_URL from '../../config/apiConfig';

const productNames = [
  { id: 1, name: 'நாடு' },
  { id: 2, name: 'கோழிக்குடு' },
  { id: 3, name: 'கற்பூரவள்ளி' },
  { id: 4, name: 'சக்கை' },
  { id: 5, name: 'காசாளி' },
  { id: 6, name: 'நேந்திரம்' },
  { id: 7, name: 'பூவன்' },
  { id: 8, name: 'ரஸ்தாளி' },
  { id: 9, name: 'Transport' }
];

const BuyerRecordForm: React.FC = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { buyerId } = useParams<{ buyerId: string }>();
  const navigate = useNavigate();

  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [visitDate, setVisitDate] = useState('');

  const [varients, setVarients] = useState([
    {
      productName: 1,
      quantity: 0,
      weight: 0,
      wastage: 0,
      finalWeight: 0,
      rate: 0,
      price: 0,
      calcBy: 'weight'
    }
  ]);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null,
    message: string
  }>({
    type: null,
    message: ''
  });

  useEffect(() => {

    const fetchBuyer = async () => {

      try {

        const res = await axios.get(`${API_BASE_URL}/api/buyers/${buyerId}`);
        setSelectedBuyer(res.data);

      } catch (err) {
        console.error(err);
      }

    };

    if (buyerId) {
      fetchBuyer();
    }

  }, [buyerId]);



  const handleVarientChange = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...varients];

    const item: any = {
      ...updated[index],
      [field]: value
    };

    const quantity = Number(item.quantity || 0);
    const weight = Number(item.weight || 0);
    const wastage = Number(item.wastage || 0);
    const rate = Number(item.rate || 0);

    const finalWeight = weight - wastage;

    let price = 0;

    if (item.calcBy === 'quantity') {
      price = quantity * rate;
    } else {
      price = finalWeight * rate;
    }

    item.finalWeight = finalWeight < 0 ? 0 : finalWeight;
    item.price = price;

    updated[index] = item;

    setVarients(updated);

  };



  const addVarient = () => {

    setVarients([
      ...varients,
      {
        productName: 1,
        quantity: 0,
        weight: 0,
        wastage: 0,
        finalWeight: 0,
        rate: 0,
        price: 0,
        calcBy: 'weight'
      }
    ]);

  };



  const removeVarient = (index: number) => {

    if (varients.length === 1) return;

    const updated = varients.filter((_, i) => i !== index);
    setVarients(updated);

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const payload = {

        buyer: { id: selectedBuyer.id },

        visitDate,

        varients: varients.map((v) => ({

          productName:
            productNames.find(p => p.id === v.productName)?.name || '',

          quantity: v.quantity,

          weight: v.weight,

          wastage: v.wastage,

          rate: v.rate,

          price: v.price

        }))

      };

      await axios.post(`${API_BASE_URL}/api/buyer-records`, payload);

      setAlert({
        type: 'success',
        message: 'Buyer Record Saved Successfully'
      });

      setTimeout(() => navigate('/'), 1200);

    } catch (err) {

      console.error(err);

      setAlert({
        type: 'error',
        message: 'Failed to save record'
      });

    }

  };



  return (

    <Container>

      <Paper sx={{ p: 4, mt: 5 }}>

        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          fontWeight="bold"
          textAlign="center"
          mb={3}
        >
          Buyer Record
        </Typography>

        {alert.type && (

          <Alert severity={alert.type} sx={{ mb: 3 }}>
            <AlertTitle>
              {alert.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            {alert.message}
          </Alert>

        )}

        <form onSubmit={handleSubmit}>

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>

              <TextField
                label="Buyer"
                value={selectedBuyer?.name || ''}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                label="Visit Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />

            </Grid>



            <Grid item xs={12} md={6}>

              {varients.map((v, index) => (

                <Paper key={index} sx={{ p: 2, mb: 2 }}>

                  <Typography fontWeight="bold">
                    Product {index + 1}
                  </Typography>

                  <FormControl fullWidth sx={{ mt: 2 }}>

                    <InputLabel>Product</InputLabel>

                    <Select
                      value={v.productName}
                      label="Product"
                      onChange={(e) =>
                        handleVarientChange(index, 'productName', e.target.value)
                      }
                    >

                      {productNames.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}

                    </Select>

                  </FormControl>



                  {/* Weight / Quantity Selection */}

                  <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>

                    <label>
                      <input
                        type="radio"
                        name={`calc-${index}`}
                        checked={v.calcBy === 'weight'}
                        onChange={() =>
                          handleVarientChange(index, 'calcBy', 'weight')
                        }
                      />
                      Weight
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={`calc-${index}`}
                        checked={v.calcBy === 'quantity'}
                        onChange={() =>
                          handleVarientChange(index, 'calcBy', 'quantity')
                        }
                      />
                      Quantity
                    </label>

                  </Box>



                  <Grid container spacing={2} sx={{ mt: 1 }}>

                    <Grid item xs={4}>
                      <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={v.quantity}
                        onChange={(e) =>
                          handleVarientChange(index, 'quantity', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="Weight"
                        type="number"
                        fullWidth
                        value={v.weight}
                        onChange={(e) =>
                          handleVarientChange(index, 'weight', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="Wastage"
                        type="number"
                        fullWidth
                        value={v.wastage}
                        onChange={(e) =>
                          handleVarientChange(index, 'wastage', e.target.value)
                        }
                      />
                    </Grid>

                  </Grid>



                  <TextField
                    label="Final Weight"
                    type="number"
                    value={v.finalWeight}
                    fullWidth
                    sx={{ mt: 2 }}
                    InputProps={{ readOnly: true }}
                  />



                  <TextField
                    label="Rate"
                    type="number"
                    fullWidth
                    value={v.rate}
                    onChange={(e) =>
                      handleVarientChange(index, 'rate', e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />



                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    value={v.price}
                    sx={{ mt: 2 }}
                    InputProps={{ readOnly: true }}
                  />



                  <Button
                    color="error"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={varients.length === 1}
                    onClick={() => removeVarient(index)}
                  >
                    Remove Product
                  </Button>

                </Paper>

              ))}



              <Button
                variant="outlined"
                fullWidth
                onClick={addVarient}
              >
                Add Product
              </Button>

            </Grid>

          </Grid>



          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, width: isMobile ? '100%' : 'auto' }}
          >
            Submit
          </Button>

        </form>

      </Paper>

    </Container>

  );

};

export default BuyerRecordForm;
