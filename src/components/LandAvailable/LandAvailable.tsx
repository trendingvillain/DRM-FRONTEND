import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Fab,
  Button,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import API_BASE_URL from '../../config/apiConfig';

interface LandAvailable {
  id: number;
  name: string;
  area: string;
  place: string;
  varient: string;
  trees: number;
  createdDate: string | null;
}

const LandAvailable: React.FC = () => {
  const [landAvailableList, setLandAvailableList] = useState<LandAvailable[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchPlace, setSearchPlace] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [searchVarient, setSearchVarient] = useState('');
  const [filteredData, setFilteredData] = useState<LandAvailable[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLandId, setSelectedLandId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Predefined variant options for the Select dropdown
  const variantOptions = ['நாடு', 'கோழிக்குடு',  'கற்பூரவள்ளி',   'சக்கை', 'காசாளி'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<LandAvailable[]>(`${API_BASE_URL}/api/land-available`);
        setLandAvailableList(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error('Error fetching land available data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = landAvailableList.filter(
      (land) =>
        land.name.toLowerCase().includes(searchName.toLowerCase()) &&
        land.area.toLowerCase().includes(searchArea.toLowerCase()) &&
        land.place.toLowerCase().includes(searchPlace.toLowerCase()) &&
        land.varient.toLowerCase().includes(searchVarient.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchName, searchArea, searchPlace, searchVarient, landAvailableList]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, landId: number) => {
    console.log('Opening menu for Land ID:', landId);  // Debugging
    setMenuAnchorEl(event.currentTarget);
    setSelectedLandId(landId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedLandId(null);
  };

  const handleViewCutoffRecord = () => {
    if (selectedLandId !== null) {
      navigate(`/cutoff-record/${selectedLandId}`);
      handleMenuClose();
    }
  };

  const handleEditLand = () => {
    if (selectedLandId !== null) {
      navigate(`/land-available/edit/${selectedLandId}`);
      handleMenuClose();
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate to the home route
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Land Available Records
      </Typography>
      <Button
        onClick={handleBack}
        variant="outlined"
        sx={{ marginBottom: '10px' }}
      >
        Back
      </Button>

      {/* Search Section */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          label="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          variant="outlined"
        />
        <TextField
          label="Area"
          value={searchArea}
          onChange={(e) => setSearchArea(e.target.value)}
          variant="outlined"
        />
        <TextField
          label="place"
          value={searchPlace}
          onChange={(e) => setSearchPlace(e.target.value)}
          variant="outlined"
        />

        {/* Search by Variant (Now a Select Dropdown) */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Search by Varient</InputLabel>
          <Select
            value={searchVarient}
            onChange={(e) => setSearchVarient(e.target.value)}
            label="Search by Varient"
            displayEmpty
          >
            <MuiMenuItem value="">
              <em>All</em>
            </MuiMenuItem>
            {variantOptions.map((variant, index) => (
              <MuiMenuItem key={index} value={variant}>
                {variant}
              </MuiMenuItem>
            ))}
          </Select>
          <FormHelperText>Select a variant to filter by.</FormHelperText>
        </FormControl>
      </Box>

      {/* Land Available Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Place</strong></TableCell>
              <TableCell><strong>Area</strong></TableCell>
              <TableCell><strong>Varient</strong></TableCell>
              <TableCell><strong>No. of Trees</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((land) => (
              <TableRow key={land.id}>
                <TableCell>{land.name}</TableCell>
                <TableCell>{land.place}</TableCell>
                <TableCell>{land.area}</TableCell>
                <TableCell>{land.varient}</TableCell>
                <TableCell>{land.trees}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, land.id)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl) && selectedLandId === land.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleViewCutoffRecord}>View Cutoff Record</MenuItem>
                    <MenuItem onClick={handleEditLand}>Edit</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add New Land Available Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/add-land-available')}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default LandAvailable;
