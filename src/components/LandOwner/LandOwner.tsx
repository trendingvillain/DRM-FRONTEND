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
  useTheme,
  useMediaQuery,
  Grid,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [landOwners, setLandOwners] = useState<LandOwner[]>([]);
  const [filteredLandOwners, setFilteredLandOwners] = useState<LandOwner[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLandOwner, setSelectedLandOwner] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch land owner details from the API when the component mounts
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/land-owners`)
      .then((response) => {
        setLandOwners(response.data);
        setFilteredLandOwners(response.data);
      })
      .catch((error) => {
        console.error('Error fetching land owners:', error);
      });
  }, []);

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
    setSelectedLandOwner(landOwnerId);
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
    const filtered = landOwners.filter((landOwner) =>
      landOwner.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLandOwners(filtered);
  };

  // Handle search for location input change
  const handleSearchLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchLocation(value);
    const filtered = landOwners.filter((landOwner) =>
      landOwner.location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLandOwners(filtered);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box sx={{ padding: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          marginBottom: 3,
        }}
      >
        Land Owner Details
      </Typography>

      {/* Back Button */}
      <Button
        onClick={handleBack}
        variant="outlined"
        sx={{
          marginBottom: 2,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        Back
      </Button>

      {/* Search Fields */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={handleSearchNameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Location"
            variant="outlined"
            fullWidth
            value={searchLocation}
            onChange={handleSearchLocationChange}
          />
        </Grid>
      </Grid>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: isMobile ? '300px' : '400px',
          overflowY: 'auto',
          marginBottom: 3,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Location
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#e0f7fa',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLandOwners.length > 0 ? (
              filteredLandOwners.map((landOwner) => (
                <TableRow key={landOwner.id}>
                  <TableCell>{landOwner.id}</TableCell>
                  <TableCell>{landOwner.name}</TableCell>
                  <TableCell>{landOwner.amount}</TableCell>
                  <TableCell>{landOwner.location}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      onClick={(event) => handleMenuClick(event, landOwner.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedLandOwner === landOwner.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleViewDetails(landOwner.id);
                          handleMenuClose();
                        }}
                      >
                        Land Owner Record
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleEditLandOwner(landOwner.id);
                          handleMenuClose();
                        }}
                      >
                        Edit
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No land owners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 10 : 16,
          right: isMobile ? 10 : 16,
        }}
        onClick={() => navigate('/landowner-form')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default LandOwner;