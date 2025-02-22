import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import html2canvas from 'html2canvas';
import API_BASE_URL from '../config/apiConfig';

interface Buyer {
  id: number;
  name: string;
}

interface BuyerRecord {
  id: number;
  visit_date: string;
  amount: number;
  buyer_id: number;
  varients: Variant[];
}

interface Variant {
  id: number;
  product_name: string;
  quantity: number;
  weight: number;
  price: number;
}

const BuyersRecords: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filteredRecords, setFilteredRecords] = useState<BuyerRecord[]>([]);
  const [buyers, setBuyers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [buyerResponse, recordsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/buyers`),
          axios.get(`${API_BASE_URL}/api/buyer-records`),
        ]);

        const buyerMap: { [key: number]: string } = {};
        buyerResponse.data.forEach((buyer: Buyer) => {
          buyerMap[buyer.id] = buyer.name;
        });
        setBuyers(buyerMap);

        const recordsWithVariants = await Promise.all(
          recordsResponse.data.map(async (record: BuyerRecord) => {
            const variantResponse = await axios.get(`${API_BASE_URL}/api/varients/${record.id}`);
            return { ...record, varients: variantResponse.data };
          })
        );

        recordsWithVariants.sort((a, b) => b.id - a.id);
        setFilteredRecords(recordsWithVariants);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchAllData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const downloadPNG = async (recordId: number) => {
    const element = document.getElementById(`record-${recordId}`);
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `buyer_record_${recordId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  return (
    <Box sx={{ padding: isMobile ? 1 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        All Buyer Records
      </Typography>

      {filteredRecords.length > 0 ? (
        filteredRecords.map((record) => (
          <Paper key={record.id} sx={{ marginTop: 3, padding: 2, position: 'relative' }} id={`record-${record.id}`}>
            <Typography variant="h6">No: {record.id}</Typography>
            <Typography variant="h6">Date: {formatDate(record.visit_date)}</Typography>
            <Typography variant="h6">Buyer: {buyers[record.buyer_id] || 'Unknown'}</Typography>

            <Table sx={{ marginTop: 2, borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {record.varients.length > 0 ? (
                  record.varients.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.product_name}</TableCell>
                      <TableCell>{variant.quantity}</TableCell>
                      <TableCell>{variant.weight} kg</TableCell>
                      <TableCell>₹{variant.price}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No products available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold' }}>Total: ₹{record.amount}</Typography>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => downloadPNG(record.id)}
              sx={{ position: 'absolute', bottom: 10, right: 10 }}
            >
              Download as PNG
            </Button>
          </Paper>
        ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 3 }}>
          No records found.
        </Typography>
      )}

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default BuyersRecords;
