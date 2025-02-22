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
  phonenumber: number;
}

const LandOwner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [landOwners, setLandOwners] = useState<LandOwner[]>([]);
  const [filteredLandOwners, setFilteredLandOwners] = useState<LandOwner[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
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

  // Handle search for name input change
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchName(value);
    setFilteredLandOwners(
      landOwners.filter((landOwner) => landOwner.name.toLowerCase().includes(value))
    );
  };

  // Handle search for location input change
  const handleSearchLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchLocation(value);
    setFilteredLandOwners(
      landOwners.filter((landOwner) => landOwner.location.toLowerCase().includes(value))
    );
  };

  // Handle search for phone number input change
  const handleSearchPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchPhoneNumber(value);
    setFilteredLandOwners(
      landOwners.filter((landOwner) =>
        String(landOwner.phonenumber).includes(value)
      )
    );
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

      {/* Search Fields */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={handleSearchNameChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Location"
            variant="outlined"
            fullWidth
            value={searchLocation}
            onChange={handleSearchLocationChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Phone Number"
            variant="outlined"
            fullWidth
            value={searchPhoneNumber}
            onChange={handleSearchPhoneChange}
          />
        </Grid>
      </Grid>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: isMobile ? '300px' : '400px', overflowY: 'auto', marginBottom: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', background: '#1976d2' }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', background: '#1976d2' }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', background: '#1976d2' }}>
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', background: '#1976d2' }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', background: '#1976d2' }}>
                Phone Number
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', background: '#1976d2' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLandOwners.length > 0 ? (
              filteredLandOwners.map((landOwner, index) => (
                <TableRow key={landOwner.id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                  <TableCell>{landOwner.id}</TableCell>
                  <TableCell>{landOwner.name}</TableCell>
                  <TableCell>{landOwner.amount}</TableCell>
                  <TableCell>{landOwner.location}</TableCell>
                  <TableCell>{landOwner.phonenumber}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                        setSelectedLandOwner(landOwner.id);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedLandOwner === landOwner.id}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate(`/landowner-record-details/${landOwner.id}`);
                          setAnchorEl(null);
                        }}
                      >
                        Land Owner Record
                      </MenuItem>
                       <MenuItem
                        onClick={() => {
                          navigate(`/landowner-lands/${landOwner.id}`);
                          setAnchorEl(null);
                        }}
                      >
                        Lands
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate(`/landowner-form/${landOwner.id}`);
                          setAnchorEl(null);
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
                <TableCell colSpan={6} align="center">
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
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/landowner-form')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default LandOwner;
