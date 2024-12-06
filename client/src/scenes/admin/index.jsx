import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, CircularProgress } from "@mui/material";
import axios from "axios";  // Import Axios
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';

const Admin = () => {
  const theme = useTheme();
  const [admins, setAdmins] = useState([]);  // State to hold admin data
  const [isLoading, setIsLoading] = useState(true);  // State for loading
  const [error, setError] = useState(null);  // State to handle errors

  // Fetch data using Axios
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/management/admins');  // Replace with your backend API
        setAdmins(response.data);  // Set the admin data to state
      } catch (err) {
        setError('Error fetching admin data: ' + err.message);  // Set error state if there is an error
      } finally {
        setIsLoading(false);  // Set loading to false after the request is done
      }
    };

    fetchAdmins();  // Call the function to fetch admin data
  }, []);  // Empty dependency array to run the effect only once after the component mounts

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing admins and list of admins" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress /> {/* Show loading spinner while fetching data */}
          </Box>
        ) : error ? (
          <Box color="error.main">
            <Typography>{error}</Typography> {/* Show error message */}
          </Box>
        ) : (
          <DataGrid
            loading={isLoading || !admins}
            getRowId={(row) => row._id}
            rows={admins || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
          />
        )}
      </Box>
    </Box>
  );
};

export default Admin;
