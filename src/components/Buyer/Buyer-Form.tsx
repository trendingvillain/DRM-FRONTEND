import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import API_BASE_URL from "../../config/apiConfig";

const BuyerForm: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [phonenumber, setPhoneNumber] = useState(""); // New state for phone number
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Phone number validation function
  const isValidPhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/; // Regex for 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate phone number
    if (!isValidPhoneNumber(phonenumber)) {
      setError("Invalid phone number. Please enter a 10-digit number.");
      return;
    }

    const buyerData = { name, location, amount, phonenumber }; // Include phonenumber
    try {
      const response = await fetch(`${API_BASE_URL}/api/buyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyerData),
      });
      if (!response.ok) throw new Error("Failed to create buyer");
      setSuccess("Buyer created successfully!");
      setError(null);
      setTimeout(() => navigate("/buyers"), 1500); // Redirect after success
    } catch (error) {
      setSuccess(null);
      setError("Error creating buyer. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          Create Buyer
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Name Field */}
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ borderRadius: 2, backgroundColor: "#f9f9f9" }}
            />

            {/* Location Field */}
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={{ borderRadius: 2, backgroundColor: "#f9f9f9" }}
            />

            {/* Amount Field */}
            <TextField
              label="Amount"
              type="number"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              sx={{ borderRadius: 2, backgroundColor: "#f9f9f9" }}
            />

            {/* Phone Number Field */}
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              inputProps={{ maxLength: 10 }} // Restrict input to 10 digits
              helperText="Enter a 10-digit phone number"
              sx={{ borderRadius: 2, backgroundColor: "#f9f9f9" }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                padding: "10px",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Submit
            </Button>
          </Box>
        </form>

        {/* Alerts for Success & Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BuyerForm;