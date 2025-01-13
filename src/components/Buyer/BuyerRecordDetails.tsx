import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import API_BASE_URL from '../../config/apiConfig';

interface Varient {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Buyer {
  id: number;
  name: string;
  location: string;
  amount: number;
  createdDate: string;
}

interface BuyerRecord {
  id: number;
  visitDate: string | null; // Allow null if visitDate can be absent
  amount: number;
  buyer: Buyer;
  varients: Varient[]; // Variants are no longer nullable
}

const BuyerRecordDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Fetch buyer ID from URL params
  const [buyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchBuyerRecords = async () => {
      try {
        const response = await axios.get<BuyerRecord[]>(
          `${API_BASE_URL}/api/buyer-records/buyer/${id}`
        );
        console.log('API Response:', response.data); // Log the response to inspect visitDate

        const buyerRecords = response.data;

        // Fetch variants for each buyer record
        const recordsWithVariants = await Promise.all(
          buyerRecords.map(async (record) => {
            const variantResponse = await axios.get<Varient[]>(
              `${API_BASE_URL}/api/varients/${record.id}`
            );
            return {
              ...record,
              varients: variantResponse.data,
            };
          })
        );

        setBuyerRecords(recordsWithVariants);
      } catch (err) {
        console.error(err);
        setError('Error loading buyer record data.');
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    };

    fetchBuyerRecords();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Helper function to format the date in DD/MM/YYYY
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      console.error('Visit date is undefined or null');
      return 'No Date Available'; // Return a user-friendly message
    }

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date'; // Return a fallback message for invalid dates
    }

    // Format the date as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Return formatted date as DD/MM/YYYY
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

  if (buyerRecords.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        No buyer record data available.
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Records
      </Typography>

      {/* Display Buyer Name at the top */}
      <Typography variant="h5" gutterBottom>
        Buyer ID: {id}
      </Typography>

      {buyerRecords.map((record) => (
        <Paper key={record.id} sx={{ marginTop: 3, padding: 2 }}>
          {/* Record Information */}
          <Typography variant="h6" gutterBottom>
            Record ID: {record.id}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Visit Date: {formatDate(record.visitDate)} {/* Updated formatting here */}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Total Amount: ${record.amount}
          </Typography>

          {/* Display Products Purchased */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Products:
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Product Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record.varients && record.varients.length > 0 ? (
                record.varients.map((varient) => (
                  <TableRow key={varient.id}>
                    <TableCell>{varient.product_name}</TableCell>
                    <TableCell>{varient.quantity}</TableCell>
                    <TableCell>${varient.price}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      ))}
    </Box>
  );
};

export default BuyerRecordDetails;