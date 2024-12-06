import React, { useState } from "react";
import { Typography, TextField, Button, Container, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../state/globalReducer"; // Ensure this action is correctly defined

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  // New state for loading
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);  // Start loading

    try {
      // API call to signup
      const response = await axios.post("http://localhost:9000/api/auth/register", { email, password, name });

      const { token, user } = response.data;
      if (token) {
        // Store token and user data in localStorage and Redux
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));  // Store user in Redux

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      // Improved error handling
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);  // Show backend error message if available
      console.error("Error during signup:", err); // Log the error for debugging
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: "2rem" }}>
        <Typography variant="h5" gutterBottom>
          Signup to Ajwa Dry Fruit
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Signup"}  {/* Show loading spinner */}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
