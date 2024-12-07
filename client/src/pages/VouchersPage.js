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

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Fetch all vouchers from the API
  const fetchVouchers = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    }
  };

  // Open the modal for creating or editing a voucher
  const handleOpenModal = (voucher = {}) => {
    setCurrentVoucher(voucher);
    setIsEditing(!!voucher._id); // Check if the voucher already has an ID
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setCurrentVoucher({});
    setOpenModal(false);
  };

  // Handle saving the voucher
  const handleSave = async () => {
    const { code, discount, expiryDate } = currentVoucher;

    // Basic validation to check for empty fields
    if (!code || !discount || !expiryDate) {
      setError("All fields are required.");
      setShowSnackbar(true);
      return;
    }

    try {
      const voucherData = {
        code,
        discount,
        expirationDate: expiryDate,  // Ensure the API uses "expirationDate"
      };

      if (isEditing) {
        await axios.put(`http://localhost:9000/api/vouchers/${currentVoucher._id}`, voucherData);
      } else {
        await axios.post("http://localhost:9000/api/vouchers", voucherData);
      }

      fetchVouchers();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save voucher:", error);
      setError("Failed to save voucher. Please try again.");
      setShowSnackbar(true);
    }
  };

  // Handle deleting a voucher
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/vouchers/${id}`);
      fetchVouchers();
    } catch (error) {
      console.error("Failed to delete voucher:", error);
      setError("Failed to delete voucher. Please try again.");
      setShowSnackbar(true);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Vouchers Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Create New Voucher
      </Button>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher._id}>
                <TableCell>{voucher.code}</TableCell>
                <TableCell>{voucher.discount}%</TableCell>
                <TableCell>{new Date(voucher.expirationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleOpenModal(voucher)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDelete(voucher._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating/editing vouchers */}
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
            {isEditing ? "Edit Voucher" : "Create Voucher"}
          </Typography>
          <TextField
            fullWidth
            label="Voucher Code"
            value={currentVoucher.code || ""}
            onChange={(e) =>
              setCurrentVoucher({ ...currentVoucher, code: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Discount (%)"
            type="number"
            value={currentVoucher.discount || ""}
            onChange={(e) =>
              setCurrentVoucher({ ...currentVoucher, discount: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Expiry Date"
            type="date"
            value={currentVoucher.expiryDate || ""}
            onChange={(e) =>
              setCurrentVoucher({ ...currentVoucher, expiryDate: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!currentVoucher.code || !currentVoucher.discount || !currentVoucher.expiryDate}
          >
            Save
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for error handling */}
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

export default VouchersPage;
