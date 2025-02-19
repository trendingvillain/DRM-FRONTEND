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
  Fab,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import API_BASE_URL from '../../config/apiConfig';

// Define Buyer interface
interface Buyer {
  id: number;
  name: string;
  amount: number;
  location: string;
  phonenumber: number;
  createdDate: string;
}

const Buyer: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchphoneNumber, setPhoneNumber] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<number | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detects mobile screens

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/buyers`)
      .then((response) => {
        setBuyers(response.data);
        setFilteredBuyers(response.data);
      })
      .catch((error) => console.error('Error fetching buyers:', error));
  }, []);

  const handleViewDetails = (id: number) => navigate(`/buyer-record-details/${id}`);
  const handleFabClick = () => navigate('/buyer-form');
  const handleViewIncome = (buyerId: number) => navigate(`/buyer-income/${buyerId}`);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, buyerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedBuyer(buyerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBuyer(null);
  };

  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchName(value);
    setFilteredBuyers(buyers.filter((buyer) => buyer.name.toLowerCase().includes(value)));
  };

  const handleSearchLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchLocation(value);
    setFilteredBuyers(buyers.filter((buyer) => buyer.location.toLowerCase().includes(value)));
  };
  const handleSearchPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value.trim(); // Remove leading/trailing spaces
  setPhoneNumber(value);

  setFilteredBuyers(
    buyers.filter((buyer) =>
      (buyer.phonenumber?.toString() || "").includes(value)
    )
  );
};


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Buyer Details
      </Typography>

      {/* Search Fields */}
      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchName}
          onChange={handleSearchNameChange}
          sx={{
            width: { xs: '100%', sm: '40%' },
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: 1,
          }}
        />
        <TextField
          label="Search by Location"
          variant="outlined"
          value={searchLocation}
          onChange={handleSearchLocationChange}
          sx={{
            width: { xs: '100%', sm: '40%' },
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: 1,
          }}
        />
        <TextField
          label="Search by Phone number"
          variant="outlined"
          value={searchphoneNumber}
          onChange={handleSearchPhoneChange}
          sx={{
            width: { xs: '100%', sm: '40%' },
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: 1,
          }}
        />
      </Box>

      {/* Table - Mobile Friendly */}
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 3,
          borderRadius: 2,
          boxShadow: 3,
          overflowX: isMobile ? 'scroll' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBuyers.map((buyer, index) => (
              <TableRow key={buyer.id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                <TableCell>{buyer.id}</TableCell>
                <TableCell>{buyer.name}</TableCell>
                <TableCell>{buyer.amount}</TableCell>
                <TableCell>{buyer.location}</TableCell>
                <TableCell>{buyer.phonenumber}</TableCell>
                <TableCell>
                  <IconButton aria-label="more" onClick={(event) => handleMenuClick(event, buyer.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedBuyer === buyer.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => { handleViewDetails(buyer.id); handleMenuClose(); }}>
                      View Buyer Record
                    </MenuItem>
                    <MenuItem onClick={() => { handleViewIncome(buyer.id); handleMenuClose(); }}>
                      View Buyer Income
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Floating Action Button (FAB) */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#125ea1' },
          boxShadow: 3,
        }}
        onClick={handleFabClick}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Buyer;
