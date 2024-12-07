import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  SettingsOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import profileImage from "assets/profile.jpeg";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import FlexBetween from "components/FlexBetween"; // Assuming FlexBetween component exists

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

  // State to track if the profile image is clicked
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  // Handle Mode Toggle (Light/Dark Mode)
  const handleModeToggle = () => {
    dispatch(setMode()); // Dispatch mode change action
  };

  // Handle Image Click to toggle its size
  const handleImageClick = () => {
    setIsImageEnlarged(!isImageEnlarged); // Toggle the enlarged state
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          {/* Light/Dark Mode Toggle */}
          <IconButton onClick={handleModeToggle}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          {/* Settings Icon */}
          <IconButton onClick={() => navigate("/settings")}> {/* Navigate */}
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          {/* Profile Button */}
          <FlexBetween>
            <Button
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              {/* Profile Image */}
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height={isImageEnlarged ? "200px" : "42px"} // Change size based on state
                width={isImageEnlarged ? "200px" : "42px"} // Change size based on state
                borderRadius="50%"
                sx={{ objectFit: "cover", cursor: "pointer" }}
                onClick={handleImageClick} // Handle image click
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
            </Button>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
