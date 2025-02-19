import React from 'react';
import './app.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import Dashboard from './components/Dashboard';
import BuyerComponent from './components/Buyer/Buyer';
import BuyerIncomeComponent from './components/BuyerIncome';
import BuyerRecordsComponent from './components/BuyerRecordForm';
import CutoffComponent from './components/LandAvailable/CreateCutoff';
import LandAvailableComponent from './components/LandAvailable/LandAvailable';
import LandOwnerComponent from './components/LandOwner/LandOwner';
import LandOwnerRecordsComponent from './components/LandOwner/LandOwnerRecords';
import BuyerRecordDetails from './components/Buyer/BuyerRecordDetails';
import BuyerIncomeDetails from './components/Buyer/BuyerIncomeDetails';
import BuyerForm from './components/Buyer/Buyer-Form';
import LandOwnerForm from './components/LandOwner/LandOwnerForm';
import AddLandOwner from './components/LandOwner/AddLandOwner';
import LandOwnerRecord from './components/LandOwner/LandOwnerRecords';
import EditLandAvailable from './components/LandAvailable/EditLandAvailable';
import CutoffRecord from './components/LandAvailable/CutoffRecord';
import AddLandAvailable from './components/LandAvailable/AddLandAvailable';
import LandOwnerRecordFormId from './components/LandOwner/LandOwnerRecordForm';
import BuyerRecordFormId from './components/Buyer/BuyerRecordFormId';
import BuyerIncomeFormId from './components/Buyer/BuyerIncomeFormId';
import LandOwnerRecordForm from './components/LandOwnerRecordForm';

const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)'); // Detects if the user is on a mobile device

  return (
    <Router>
      <CssBaseline /> {/* Ensures consistent styles across devices */}
      <Dashboard />

      {/* Responsive padding for content */}
      <Box sx={{ paddingTop: isMobile ? '56px' : '64px', paddingX: isMobile ? '8px' : '16px' }}>
        <Routes>
          <Route path="/" element={<BuyerComponent />} />
          <Route path="/buyers" element={<BuyerComponent />} />
          <Route path="/buyer-income" element={<BuyerIncomeComponent />} />
          <Route path="/buyer-records" element={<BuyerRecordsComponent />} />
          <Route path="/create-cutoff/:id" element={<CutoffComponent />} />
          <Route path="/land-available" element={<LandAvailableComponent />} />
          <Route path="/landowners" element={<LandOwnerComponent />} />
          <Route path="/land-owner-records" element={<LandOwnerRecordsComponent />} />
          <Route path="/Land-record/form/:id" element={<LandOwnerRecordFormId />} />
          <Route path="/buyer-record-details/:id" element={<BuyerRecordDetails />} />
          <Route path="/buyer-records/form/:buyerId" element={<BuyerRecordFormId />} />
          <Route path="/buyer-income/form/:buyerId" element={<BuyerIncomeFormId />} />
          <Route path="/buyer-income/:buyerId" element={<BuyerIncomeDetails />} />
          <Route path="/buyer-form" element={<BuyerForm />} />
          <Route path="/landowner-form" element={<AddLandOwner />} />
          <Route path="/landowner-form/:id" element={<LandOwnerForm />} />
          <Route path="/landowner-record-details/:id" element={<LandOwnerRecord />} />
          <Route path="/land-available/edit/:id" element={<EditLandAvailable />} />
          <Route path="/cutoff-record/:id" element={<CutoffRecord />} />
          <Route path="/add-land-available" element={<AddLandAvailable />} />
          <Route path="/land-ower-form" element={<LandOwnerRecordForm />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
