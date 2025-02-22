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
  amount: number;
  land_owner_id: number; // Added landowner ID
}

interface LandOwner {
  id: number;
  name: string;
  contact: string;
}

const LandAvailable: React.FC = () => {
  const [landAvailableList, setLandAvailableList] = useState<LandAvailable[]>([]);
  const [landOwnerInfo, setLandOwnerInfo] = useState<Record<number, LandOwner>>({});
  const [searchName, setSearchName] = useState('');
  const [searchPlace, setSearchPlace] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [searchVarient, setSearchVarient] = useState('');
  const [filteredData, setFilteredData] = useState<LandAvailable[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLandId, setSelectedLandId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Predefined variant options
  const variantOptions = ['நாடு', 'கோழிக்குடு', 'கற்பூரவள்ளி', 'சக்கை', 'காசாளி'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<LandAvailable[]>(`${API_BASE_URL}/api/land-available`);
        setLandAvailableList(response.data);
        setFilteredData(response.data);

        // Fetch landowners for each land record
        const landOwnerRequests = response.data.map((land) =>
          axios.get(`${API_BASE_URL}/api/land-owners/${land.land_owner_id}`)
        );
        const landOwnerResponses = await Promise.all(landOwnerRequests);

        const landOwnersData: Record<number, LandOwner> = {};
        landOwnerResponses.forEach((res, index) => {
          landOwnersData[response.data[index].land_owner_id] = res.data;
        });

        setLandOwnerInfo(landOwnersData);
      } catch (err) {
        console.error('Error fetching data:', err);
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Land Available Records
      </Typography>

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
          label="Place"
          value={searchPlace}
          onChange={(e) => setSearchPlace(e.target.value)}
          variant="outlined"
        />

        {/* Search by Variant */}
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
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Land Owner Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Place</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Area</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Varient</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>No. of Trees</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((land) => (
              <TableRow key={land.id}>
                <TableCell>{landOwnerInfo[land.land_owner_id]?.name || 'Loading...'}</TableCell>
                <TableCell>{land.name}</TableCell>
                <TableCell>{land.place}</TableCell>
                <TableCell>{land.area}</TableCell>
                <TableCell>{land.varient}</TableCell>
                <TableCell>{land.trees}</TableCell>
                <TableCell>{land.amount}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuOpen(event, land.id)}>
                    <MoreVert />
                  </IconButton>
                  <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleViewCutoffRecord}>View Cutoff Record</MenuItem>
                    <MenuItem onClick={handleEditLand}>Edit</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => navigate('/add-land-available')}>
        <Add />
      </Fab>
    </Box>
    
  );
};

export default LandAvailable;
