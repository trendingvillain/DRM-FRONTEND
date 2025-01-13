import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import API_BASE_URL from '../../config/apiConfig';

const BuyerForm: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const buyerData = {
      name,
      location,
      amount,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/buyers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buyerData),
      });

      if (!response.ok) {
        throw new Error("Failed to create buyer");
      }

      const data = await response.json();
      setSuccess("Buyer created successfully!");
      setError(null);
      console.log(data);

      navigate("/buyers"); // Redirect after success
    } catch (error) {
      setSuccess(null);
      setError("Error creating buyer.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
        <Typography variant="h4" align="center">
          Create Buyer
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Submit
          </Button>
        </form>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default BuyerForm;
