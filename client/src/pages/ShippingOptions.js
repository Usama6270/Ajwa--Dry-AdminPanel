import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ShippingOptions = () => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [newShippingOption, setNewShippingOption] = useState({ method: '', deliveryTime: '', charge: '' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch shipping options
  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/shipping');
        setShippingOptions(response.data);
      } catch (error) {
        console.error('Error fetching shipping options:', error);
        setErrorMessage('Error fetching shipping options. Please try again.');
        setOpenSnackbar(true);
      }
    };
    fetchShippingOptions();
  }, []);

  // Add or update shipping option
  const handleSaveShippingOption = async () => {
    if (!newShippingOption.method || !newShippingOption.deliveryTime || !newShippingOption.charge) {
      setErrorMessage('All fields are required.');
      setOpenSnackbar(true);
      return;
    }

    try {
      if (editing) {
        // Update shipping option
        await axios.put(`http://localhost:9000/api/shipping/${editId}`, newShippingOption);
      } else {
        // Add new shipping option
        await axios.post('http://localhost:9000/api/shipping', newShippingOption);
      }
      setNewShippingOption({ method: '', deliveryTime: '', charge: '' });
      setEditing(false);
      setEditId(null);
      setErrorMessage('');
      setOpenSnackbar(true);
      // Refetch shipping options
      const response = await axios.get('http://localhost:9000/api/shipping');
      setShippingOptions(response.data);
    } catch (error) {
      console.error('Error saving shipping option:', error);
      setErrorMessage('Error saving shipping option. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // Handle edit shipping option
  const handleEditShippingOption = (shippingOption) => {
    setNewShippingOption({ method: shippingOption.method, deliveryTime: shippingOption.deliveryTime, charge: shippingOption.charge });
    setEditing(true);
    setEditId(shippingOption._id);
    setErrorMessage('');
  };

  // Handle delete shipping option
  const handleDeleteShippingOption = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/shipping/${id}`);
      // Refetch shipping options
      const response = await axios.get('http://localhost:9000/api/shipping');
      setShippingOptions(response.data);
    } catch (error) {
      console.error('Error deleting shipping option:', error);
      setErrorMessage('Error deleting shipping option. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div sx={{ padding: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>Shipping Options</Typography>

      {errorMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={errorMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      )}

      <TextField
        label="Method"
        value={newShippingOption.method}
        onChange={(e) => setNewShippingOption({ ...newShippingOption, method: e.target.value })}
        fullWidth
        margin="normal"
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Delivery Time"
        value={newShippingOption.deliveryTime}
        onChange={(e) => setNewShippingOption({ ...newShippingOption, deliveryTime: e.target.value })}
        fullWidth
        margin="normal"
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Charge"
        type="number"
        value={newShippingOption.charge}
        onChange={(e) => setNewShippingOption({ ...newShippingOption, charge: e.target.value })}
        fullWidth
        margin="normal"
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveShippingOption}
        sx={{
          marginTop: 2,
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
          },
        }}
      >
        {editing ? 'Update Shipping Option' : 'Add Shipping Option'}
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Method</TableCell>
              <TableCell sx={{ fontWeight: 500 }}>Delivery Time</TableCell>
              <TableCell sx={{ fontWeight: 500 }}>Charge</TableCell>
              <TableCell sx={{ fontWeight: 500 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingOptions.map((option) => (
              <TableRow key={option._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>{option.method}</TableCell>
                <TableCell>{option.deliveryTime}</TableCell>
                <TableCell>${option.charge}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditShippingOption(option)} sx={{ marginRight: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteShippingOption(option._id)} sx={{ marginRight: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ShippingOptions;
