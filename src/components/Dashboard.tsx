import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#2E3B55' }}>
        <Toolbar>
          {/* Left Drawer Button */}
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => setLeftDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
            Buyer and Land Management System
          </Typography>

          {/* Right Drawer Button */}
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={() => setRightDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Left Drawer */}
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={() => setLeftDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2, backgroundColor: '#F5F5F5', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>Navigation</Typography>
          <List>
            <ListItem component={Link} to="/buyers" sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Buyer" />
            </ListItem>
            <ListItem component={Link} to="/landowners" sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Land Owner" />
            </ListItem>
            <ListItem component={Link} to="/land-available" sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Land Available" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Right Drawer */}
      <Drawer
        anchor="right"
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2, backgroundColor: '#F5F5F5', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>Records</Typography>
          <List>
            <ListItem component={Link} to="/buyer-income" sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Buyer Income" />
            </ListItem>
            <ListItem component={Link} to="/buyer-records" sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Buyer Records" />
            </ListItem>
            <ListItem component={Link} to="/land-owner-form" sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Land Owner Records" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Dashboard;