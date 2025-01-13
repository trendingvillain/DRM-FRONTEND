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
  Button,
  Menu,
  MenuItem,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

// Define the structure of a Buyer object
interface Buyer {
  id: number;
  name: string;
  amount: number;
  location: string;
  createdDate: string;
}

const Buyer: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]); // Stores all buyer data
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([]); // Stores filtered buyer data based on search
  const [searchName, setSearchName] = useState(''); // The search input for name
  const [searchLocation, setSearchLocation] = useState(''); // The search input for location
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For Menu positioning
  const [selectedBuyer, setSelectedBuyer] = useState<number | null>(null); // Store selected buyer id
  const navigate = useNavigate(); // To navigate to other pages

  // Fetch buyer details from the API when the component mounts
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/buyers`)
      .then((response) => {
        setBuyers(response.data); // Store the fetched buyers data
        setFilteredBuyers(response.data); // Set initial filtered buyers data
      })
      .catch((error) => {
        console.error('Error fetching buyers:', error); // Log errors if any
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle navigation to the buyer record details page
  const handleViewDetails = (id: number) => {
    navigate(`/buyer-record-details/${id}`);
  };

  // Handle navigation to the form for adding a new buyer
  const handleFabClick = () => {
    navigate('/buyer-form');
  };

  // Handle navigation to buyer income records
  const handleViewIncome = (buyerId: number) => {
    navigate(`/buyer-income/${buyerId}`);
  };

  // Handle opening of the menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, buyerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedBuyer(buyerId); // Set the selected buyer id
  };

  // Handle closing of the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBuyer(null);
  };

  // Handle search for name input change
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchName(value);

    // Filter buyers based on name
    const filtered = buyers.filter((buyer) =>
      buyer.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBuyers(filtered); // Update the filtered list of buyers
  };

  // Handle search for location input change
  const handleSearchLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchLocation(value);

    // Filter buyers based on location
    const filtered = buyers.filter((buyer) =>
      buyer.location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBuyers(filtered); // Update the filtered list of buyers
  };

  const handleBack = () => {
    navigate('/'); // Navigate to the home route
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Details
      </Typography>
      <Button onClick={handleBack} variant="outlined" sx={{ marginBottom: '10px' }}>
        Back
      </Button>

      {/* Search by Name */}
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchName}
        onChange={handleSearchNameChange}
        sx={{ marginBottom: '10px' }}
      />

      {/* Search by Location */}
      <TextField
        label="Search by Location"
        variant="outlined"
        fullWidth
        value={searchLocation}
        onChange={handleSearchLocationChange}
        sx={{ marginBottom: '20px' }}
      />

      <TableContainer component={Paper} style={{ marginTop: '30px', maxHeight: '350px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Iterate over filtered buyers and display their details */}
            {filteredBuyers.map((buyer) => (
              <TableRow key={buyer.id}>
                <TableCell>{buyer.id}</TableCell>
                <TableCell>{buyer.name}</TableCell>
                <TableCell>{buyer.amount}</TableCell>
                <TableCell>{buyer.location}</TableCell>
                <TableCell>
                  {/* 3-dot action menu */}
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

      {/* Floating Action Button to navigate to the add buyer form */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleFabClick}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Buyer;
