import React, { useState } from "react";
import { Typography, TextField, Button, Paper, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../state/globalReducer";
import backgroundImg from "../pages/pic.jpg"; // Update the path to match your project structure

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:9000/api/auth/register", { email, password, name });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        navigate("/dashboard");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Error during signup:", err);
    } finally {
      setLoading(false);
    }
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
        padding: "2rem",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black", // Optional dark overlay
          zIndex: -1,
        },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          animation: "fadeIn 1.5s",
          backdropFilter: "blur(8px)",
          backgroundColor: "black", // Slightly transparent background
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Sign Up
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "text.secondary",
            marginBottom: "1rem",
          }}
        >
          Join Ajwa Dry Fruit today!
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
          {error && <Typography color="error" sx={{ marginTop: "1rem" }}>{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.05)", backgroundColor: "primary.dark" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
          </Button>
        </form>
        <Button
          variant="text"
          onClick={() => navigate("/login")}
          fullWidth
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: "primary.main",
            "&:hover": { textDecoration: "underline", color: "primary.dark" },
          }}
        >
          Already have an account? Login
        </Button>
      </Paper>
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

export default Signup;
