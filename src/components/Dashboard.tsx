import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './../CSS/dashboard.css';

const Dashboard: React.FC = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  return (
    <div className="Dashboard">
      <header className="Dashboard-header">
        <div className="header-actions">
          {/* Left Drawer Button */}
          <IconButton onClick={() => setLeftDrawerOpen(true)}>
            <MoreVertIcon />
          </IconButton>

          {/* Title */}
          <h1>Buyer and Land Management System</h1>

          {/* Right Drawer Button */}
          <IconButton onClick={() => setRightDrawerOpen(true)}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </header>

      <Box sx={{ display: 'flex' }}>
        {/* Left Drawer */}
        <Drawer
          anchor="left"
          open={leftDrawerOpen}
          onClose={() => setLeftDrawerOpen(false)}
        >
          <List>
            <ListItem component={Link} to="/buyers">
              <ListItemText primary="Buyer" />
            </ListItem>
            <ListItem component={Link} to="/landowners">
              <ListItemText primary="Land Owner" />
            </ListItem>
            <ListItem component={Link} to="/land-available">
              <ListItemText primary="Land Available" />
            </ListItem>
          </List>
        </Drawer>

        {/* Right Drawer */}
        <Drawer
          anchor="right"
          open={rightDrawerOpen}
          onClose={() => setRightDrawerOpen(false)}
        >
          <List>
            <ListItem component={Link} to="/buyer-income">
              <ListItemText primary="Buyer Income" />
            </ListItem>
            <ListItem component={Link} to="/buyer-records">
              <ListItemText primary="Buyer Records" />
            </ListItem>
            <ListItem component={Link} to="/land-ower-form">
              <ListItemText primary="Land Owner Records" />
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </div>
  );
};

export default Dashboard;
