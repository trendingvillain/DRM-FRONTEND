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
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

// Define the structure of a LandOwner object
interface LandOwner {
  id: number;
  name: string;
  amount: number;
  location: string;
  createdDate: string;
}

const LandOwner: React.FC = () => {
  const [landOwners, setLandOwners] = useState<LandOwner[]>([]); // Stores all land owner data
  const [filteredLandOwners, setFilteredLandOwners] = useState<LandOwner[]>([]); // Stores filtered land owner data
  const [searchName, setSearchName] = useState(''); // The search input for name
  const [searchLocation, setSearchLocation] = useState(''); // The search input for location
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For Menu positioning
  const [selectedLandOwner, setSelectedLandOwner] = useState<number | null>(null); // Store selected land owner id
  const navigate = useNavigate(); // To navigate to other pages

  // Fetch land owner details from the API when the component mounts
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/land-owners`)
      .then((response) => {
        setLandOwners(response.data); // Store the fetched land owners data
        setFilteredLandOwners(response.data); // Set initial filtered land owners data
      })
      .catch((error) => {
        console.error('Error fetching land owners:', error); // Log errors if any
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle navigation to the land owner record details page
  const handleViewDetails = (id: number) => {
    navigate(`/landowner-record-details/${id}`);
  };

  // Handle navigation to the form for editing a land owner
  const handleEditLandOwner = (id: number) => {
    navigate(`/landowner-form/${id}`);
  };

  // Handle opening of the menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, landOwnerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedLandOwner(landOwnerId); // Set the selected land owner id
  };

  // Handle closing of the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLandOwner(null);
  };

  // Handle search for name input change
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchName(value);

    // Filter land owners based on name
    const filtered = landOwners.filter((landOwner) =>
      landOwner.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLandOwners(filtered); // Update the filtered list of land owners
  };

  // Handle search for location input change
  const handleSearchLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchLocation(value);

    // Filter land owners based on location
    const filtered = landOwners.filter((landOwner) =>
      landOwner.location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLandOwners(filtered); // Update the filtered list of land owners
  };
    const handleBack = () => {
    navigate('/'); // Navigate to the home route
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Land Owner Details
      </Typography>

      <Button
        onClick={handleBack}
        variant="outlined"
        sx={{ marginBottom: '10px' }}
      >
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
            {/* Iterate over filtered land owners and display their details */}
            {filteredLandOwners.map((landOwner) => (
              <TableRow key={landOwner.id}>
                <TableCell>{landOwner.id}</TableCell>
                <TableCell>{landOwner.name}</TableCell>
                <TableCell>{landOwner.amount}</TableCell>
                <TableCell>{landOwner.location}</TableCell>
                <TableCell>
                  <IconButton aria-label="more" onClick={(event) => handleMenuClick(event, landOwner.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedLandOwner === landOwner.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => { handleViewDetails(landOwner.id); handleMenuClose(); }}>
                      Land Owner Record
                    </MenuItem>
                    <MenuItem onClick={() => { handleEditLandOwner(landOwner.id); handleMenuClose(); }}>
                      Edit
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Floating Action Button to navigate to the add land owner form */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/landowner-form')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default LandOwner;
