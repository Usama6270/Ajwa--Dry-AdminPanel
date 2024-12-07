import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Modal,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/promotions");
      console.log("Promotions fetched: ", response.data); // Debugging: log response data
      setPromotions(response.data); // Ensure response.data is an array
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      setError("Failed to fetch promotions. Please try again later.");
    }
  };

  const handleOpenModal = (promotion = {}) => {
    setCurrentPromotion(promotion);
    setIsEditing(!!promotion._id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setCurrentPromotion({});
    setOpenModal(false);
  };

  const handleSave = async () => {
    const { title, description, startDate, endDate, discountPercentage } = currentPromotion;

    // Check that all fields are provided
    if (!title || !description || !startDate || !endDate || discountPercentage === undefined) {
      setError("All fields are required.");
      setShowSnackbar(true);
      return;
    }

    try {
      console.log("Saving promotion: ", currentPromotion);

      // Save or update promotion
      if (isEditing) {
        await axios.put(`http://localhost:9000/api/promotions/${currentPromotion._id}`, currentPromotion);
      } else {
        await axios.post("http://localhost:9000/api/promotions", currentPromotion);
      }

      fetchPromotions();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save promotion:", error);
      setError("Failed to save promotion. Please try again later.");
      setShowSnackbar(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/promotions/${id}`);
      fetchPromotions();
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      setError("Failed to delete promotion. Please try again later.");
      setShowSnackbar(true);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Promotions Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        aria-label="Create New Promotion"
      >
        Create New Promotion
      </Button>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion._id}>
                <TableCell>{promotion.title}</TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell>{new Date(promotion.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(promotion.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{promotion.discountPercentage}%</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleOpenModal(promotion)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDelete(promotion._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          p={4}
          sx={{
            backgroundColor: "black",
            width: "400px",
            margin: "auto",
            mt: "10%",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditing ? "Edit Promotion" : "Create Promotion"}
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={currentPromotion.title || ""}
            onChange={(e) =>
              setCurrentPromotion({ ...currentPromotion, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={currentPromotion.description || ""}
            onChange={(e) =>
              setCurrentPromotion({ ...currentPromotion, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={currentPromotion.startDate || ""}
            onChange={(e) =>
              setCurrentPromotion({ ...currentPromotion, startDate: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={currentPromotion.endDate || ""}
            onChange={(e) =>
              setCurrentPromotion({ ...currentPromotion, endDate: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Discount Percentage"
            type="number"
            value={currentPromotion.discountPercentage || ""}
            onChange={(e) =>
              setCurrentPromotion({ ...currentPromotion, discountPercentage: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PromotionsPage;
