import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import recordIcon from './../../banner.png';
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
  Button,
} from '@mui/material';
import html2canvas from 'html2canvas';
import API_BASE_URL from '../../config/apiConfig';

const BuyerRecordDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [buyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([]);
  const [buyerInfo, setBuyerInfo] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const response = await axios.get<Buyer>(`${API_BASE_URL}/api/buyers/${id}`);
        setBuyerInfo(response.data);
      } catch (err) {
        setError('Error loading buyer information.');
      }
    };
    fetchBuyerInfo();
  }, [id]);

  useEffect(() => {
    const fetchBuyerRecords = async () => {
      try {
        const response = await axios.get<BuyerRecord[]>(`${API_BASE_URL}/api/buyer-records/buyer/${id}`);
        const recordsWithVariants = await Promise.all(
          response.data.map(async (record) => {
            const variantResponse = await axios.get<Varient[]>(`${API_BASE_URL}/api/varients/${record.id}`);
            return { ...record, varients: variantResponse.data };
          })
        );
        recordsWithVariants.sort((a, b) => b.id - a.id);
        setBuyerRecords(recordsWithVariants);
      } catch (err) {
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

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No Date Available';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const downloadPNG = async (recordId: number) => {
    const element = document.getElementById(`record-${recordId}`);
    if (!element) return;

    const button = element.querySelector('button');
    if (button) button.style.display = 'none';

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
      });
      if (button) button.style.display = 'block';
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `buyer_record_${recordId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing image:', error);
      if (button) button.style.display = 'block';
    }
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Records
      </Typography>

      {buyerInfo && (
        <>
          <Typography variant="h6">Buyer Name: {buyerInfo.name}</Typography>
          <Typography variant="h6">இருப்பு + வரவு: ₹ {buyerInfo.amount}</Typography>
        </>
      )}

      {buyerRecords.map((record) => (
        <Paper key={record.id} sx={{ marginTop: 3, padding: 2 }} id={`record-${record.id}`}>
          <img src={recordIcon} alt="Record Icon" style={{ width: '100%' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginLeft: 5, marginRight: 5, color:'#0fc33b' }}>
            <Typography variant="h6">No: {record.id}</Typography>
  <          Typography variant="h6">தேதி: {formatDate(record.visit_date)}</Typography>
          </Box>


          {buyerInfo && (
        <>
          <Typography variant="h6" sx={{marginLeft:10, marginTop:3}}>திரு.{buyerInfo.name}</Typography>
        </>
      )}
          <Table sx={{marginLeft:2, marginRight: 4, marginTop:3}}>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Weight</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record.varients.length > 0 ? (
                record.varients.map((varient) => (
                  <TableRow key={varient.id}>
                    <TableCell>{varient.product_name}</TableCell>
                    <TableCell>{varient.quantity}</TableCell>
                    <TableCell>{varient.weight} kg</TableCell>
                    <TableCell>₹{varient.price}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Typography variant="h6" sx={{ marginLeft: '70%', fontSize: 14 }}>மொத்தம்: ₹{record.amount}</Typography>
          {buyerInfo && (
        <>

          <Typography variant="h6" sx={{ marginLeft: '65%', fontSize: 14 }}>இருப்பு + வரவு: ₹ {buyerInfo.amount}</Typography>
        </>
      )}

          <Box sx={{ marginTop: 2, textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={() => downloadPNG(record.id)}>
              Download Record as PNG
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default BuyerRecordDetails;
