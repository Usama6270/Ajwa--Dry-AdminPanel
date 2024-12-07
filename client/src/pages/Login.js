import React, { useState } from "react";
import { Typography, TextField, Button, Container, Paper, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../state/globalReducer";
import backgroundImg from "../pages/pic.jpg"; // Ensure the path matches your project structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the API call to login
      const response = await axios.post("http://localhost:9000/api/auth/login", { email, password });

      // Store token and user in localStorage
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token); // Store the token in localStorage
        localStorage.setItem("user", JSON.stringify(user)); // Store user info as JSON string in localStorage

        // Dispatch the user data to Redux
        dispatch(setUser(user));

        // Redirect to the dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleSignupRedirect = () => {
    // Navigate to the signup page
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          animation: "fadeIn 1.5s",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Login to Ajwa Dry Fruit
        </Typography>
        <form onSubmit={handleSubmit}>
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
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Login
          </Button>
        </form>

        <Button
          variant="text"
          color="secondary"
          onClick={handleSignupRedirect}
          fullWidth
          sx={{
            mt: 2,
            transition: "color 0.2s",
            "&:hover": { color: "primary.main" },
          }}
        >
          Don't have an account? Sign Up
        </Button>
      </Paper>
      {/* CSS for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;
