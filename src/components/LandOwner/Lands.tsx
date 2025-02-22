import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Import useParams
import axios from "axios";
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
  Fab,
  MenuItem ,
} from '@mui/material';
import { Add, MoreVert } from "@mui/icons-material";
import API_BASE_URL from "../../config/apiConfig";

interface Land {
  id: number;
  name: string;
  area: string;
  place: string;
  varient: string;
  trees: number;
  amount: number;
  land_owner_id: number;
}

const Lands: React.FC = () => {
  const { landownerId } = useParams<{ landownerId: string }>(); // ✅ Extract ID from URL
  const [lands, setLands] = useState<Land[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLandId, setSelectedLandId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!landownerId) return; // ✅ Ensure ID exists before making the API call

    const fetchLands = async () => {
  try {
    const response = await axios.get<Land | Land[]>(`${API_BASE_URL}/api/land-available//owner/${landownerId}`);

    if (Array.isArray(response.data)) {
      setLands(response.data); // ✅ Already an array, no change needed
    } else if (response.data && typeof response.data === "object") {
      setLands([response.data]); // ✅ Wrap the single object in an array
    } else {
      console.error("Unexpected API response:", response.data);
      setLands([]);
    }
  } catch (err) {
    console.error("Error fetching lands:", err);
    setLands([]);
  }
};


    fetchLands();
  }, [landownerId]); // ✅ Dependency added so it updates when ID changes

  const filteredLands = Array.isArray(lands)
    ? lands.filter((land) => land.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  
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
        Lands Available for Owner ID: {landownerId} {/* ✅ Display the ID for debugging */}
      </Typography>

      <TextField
        label="Search Lands"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Area</strong></TableCell>
              <TableCell><strong>Place</strong></TableCell>
              <TableCell><strong>Varient</strong></TableCell>
              <TableCell><strong>Trees</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLands.map((land) => (
              <TableRow key={land.id}>
                <TableCell>{land.name}</TableCell>
                <TableCell>{land.area}</TableCell>
                <TableCell>{land.place}</TableCell>
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

      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate(`/add-land/${landownerId}`)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Lands;
