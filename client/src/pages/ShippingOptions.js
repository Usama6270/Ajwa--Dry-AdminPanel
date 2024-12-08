import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ShippingOptions = () => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [newShippingOption, setNewShippingOption] = useState({ method: '', deliveryTime: '', charge: '', city: '' });
  const [weatherData, setWeatherData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const OPENWEATHER_API_KEY = 'e92d77cd5696959572165b80ec187006';

  // Fetch shipping options
  const fetchShippingOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9000/api/shipping');
      setShippingOptions(response.data);
    } catch (error) {
      console.error('Error fetching shipping options:', error);
      setErrorMessage('Error fetching shipping options. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingOptions();
  }, []);

  // Fetch weather data for a city
  const fetchWeatherData = async (city) => {
    if (!city) {
      setErrorMessage('Please provide a valid city name.');
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setErrorMessage('Unable to fetch weather data. Please check the city name and try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Add or update shipping option
  const handleSaveShippingOption = async () => {
    if (!newShippingOption.method || !newShippingOption.deliveryTime || !newShippingOption.charge || !newShippingOption.city) {
      setErrorMessage('All fields are required.');
      setOpenSnackbar(true);
      return;
    }

    try {
      if (editing) {
        await axios.put(`http://localhost:9000/api/shipping/${editId}`, newShippingOption);
      } else {
        await axios.post('http://localhost:9000/api/shipping', newShippingOption);
      }
      setNewShippingOption({ method: '', deliveryTime: '', charge: '', city: '' });
      setEditing(false);
      setEditId(null);
      await fetchShippingOptions();
    } catch (error) {
      console.error('Error saving shipping option:', error);
      setErrorMessage('Error saving shipping option. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // Handle edit shipping option
  const handleEditShippingOption = (shippingOption) => {
    setNewShippingOption({
      method: shippingOption.method,
      deliveryTime: shippingOption.deliveryTime,
      charge: shippingOption.charge,
      city: shippingOption.city,
    });
    setEditing(true);
    setEditId(shippingOption._id);
    setErrorMessage('');
  };

  // Handle delete shipping option
  const handleDeleteShippingOption = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:9000/api/shipping/${id}`);
      await fetchShippingOptions();
    } catch (error) {
      console.error('Error deleting shipping option:', error);
      setErrorMessage('Error deleting shipping option. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ padding: 24, backgroundColor: 'black', borderRadius: 8 }}>
      <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: 16 }}>
        Shipping Options
      </Typography>

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
      />
      <TextField
        label="Delivery Time"
        value={newShippingOption.deliveryTime}
        onChange={(e) => setNewShippingOption({ ...newShippingOption, deliveryTime: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Charge"
        type="number"
        value={newShippingOption.charge}
        onChange={(e) => setNewShippingOption({ ...newShippingOption, charge: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="City"
        value={newShippingOption.city}
        onChange={(e) => setNewShippingOption({ ...newShippingOption, city: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveShippingOption}
        style={{ marginTop: 16 }}
      >
        {editing ? 'Update Shipping Option' : 'Add Shipping Option'}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => fetchWeatherData(newShippingOption.city)}
        style={{ marginTop: 16, marginLeft: 16 }}
      >
        Get Weather
      </Button>

      {weatherData && (
        <div style={{ marginTop: 16, padding: 16, backgroundColor: 'black', borderRadius: 8 }}>
          <Typography variant="h6">Weather in {weatherData.name}</Typography>
          <Typography>Temperature: {weatherData.main.temp}°C</Typography>
          <Typography>Conditions: {weatherData.weather[0].description}</Typography>
        </div>
      )}

      <TableContainer component={Paper} style={{ marginTop: 32 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Method</TableCell>
              <TableCell>Delivery Time</TableCell>
              <TableCell>Charge</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingOptions.map((option) => (
              <TableRow key={option._id}>
                <TableCell>{option.method}</TableCell>
                <TableCell>{option.deliveryTime}</TableCell>
                <TableCell>${option.charge}</TableCell>
                <TableCell>{option.city}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditShippingOption(option)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteShippingOption(option._id)}>
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
