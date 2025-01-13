import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

// Define the structure of a BuyerIncome object
interface BuyerIncome {
  id: number;
  buyer: {
    id: number;
    name: string;
    location: string;
    amount: number;
    createdDate: string;
  };
  visit_date: string; // Updated to match the key in the API response
  amount: number;
}

const BuyerIncomeDetails: React.FC = () => {
  const { buyerId } = useParams<{ buyerId: string }>(); // Get buyerId from URL params
  const [incomeRecords, setIncomeRecords] = useState<BuyerIncome[]>([]);

  // Fetch income details for the buyer when the component mounts
  useEffect(() => {
    if (buyerId) {
      axios
        .get(`${API_BASE_URL}/api/buyer-income/buyer/${buyerId}`)
        .then((response) => {
          setIncomeRecords(response.data); // Store the fetched income records
        })
        .catch((error) => {
          console.error('Error fetching buyer income details:', error);
        });
    }
  }, [buyerId]);

  // Helper function to format the date in DD/MM/YYYY
  const formatDate = (dateString: string): string => {
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Income Details for Buyer ID: {buyerId}
      </Typography>

      <TableContainer component={Paper} style={{ marginTop: '30px', maxHeight: '350px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                Visit Date
              </TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Iterate over income records and display their details */}
            {incomeRecords.length > 0 ? (
              incomeRecords.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{formatDate(income.visit_date)}</TableCell> {/* Updated key here */}
                  <TableCell>{income.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No income records found for this buyer.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Back button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => window.history.back()} // Go back to the previous page
        sx={{ marginTop: 2 }}
      >
        Back
      </Button>
    </Box>
  );
};

export default BuyerIncomeDetails;
