import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaxSettings = () => {
  const [taxSettings, setTaxSettings] = useState([]);
  const [newTaxSetting, setNewTaxSetting] = useState({ region: '', taxRate: '' });
  const [editing, setEditing] = useState(false);
  const [editRegion, setEditRegion] = useState(null);

  // Fetch tax settings
  useEffect(() => {
    const fetchTaxSettings = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/tax');
        setTaxSettings(response.data);
      } catch (error) {
        console.error('Error fetching tax settings:', error);
      }
    };
    fetchTaxSettings();
  }, []);

  // Add or update tax setting
  const handleSaveTaxSetting = async () => {
    try {
      if (editing) {
        // Update tax setting
        await axios.put(`http://localhost:9000/api/tax/${editRegion}`, newTaxSetting);
      } else {
        // Add new tax setting
        await axios.post('http://localhost:9000/api/tax', newTaxSetting);
      }
      setNewTaxSetting({ region: '', taxRate: '' });
      setEditing(false);
      setEditRegion(null);
      // Refetch tax settings
      const response = await axios.get('http://localhost:9000/api/tax');
      setTaxSettings(response.data);
    } catch (error) {
      console.error('Error saving tax setting:', error);
    }
  };

  // Handle edit tax setting
  const handleEditTaxSetting = (taxSetting) => {
    setNewTaxSetting({ region: taxSetting.region, taxRate: taxSetting.taxRate });
    setEditing(true);
    setEditRegion(taxSetting.region);
  };

  // Handle delete tax setting
  const handleDeleteTaxSetting = async (region) => {
    try {
      await axios.delete(`http://localhost:9000/api/tax/${region}`);
      // Refetch tax settings
      const response = await axios.get('http://localhost:9000/api/tax');
      setTaxSettings(response.data);
    } catch (error) {
      console.error('Error deleting tax setting:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Tax Settings</Typography>
      <TextField
        label="Region"
        value={newTaxSetting.region}
        onChange={(e) => setNewTaxSetting({ ...newTaxSetting, region: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Tax Rate"
        type="number"
        value={newTaxSetting.taxRate}
        onChange={(e) => setNewTaxSetting({ ...newTaxSetting, taxRate: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSaveTaxSetting}>
        {editing ? 'Update Tax Setting' : 'Add Tax Setting'}
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell>Tax Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taxSettings.map((setting) => (
              <TableRow key={setting.region}>
                <TableCell>{setting.region}</TableCell>
                <TableCell>{setting.taxRate}%</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditTaxSetting(setting)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTaxSetting(setting.region)}>
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

export default TaxSettings;
