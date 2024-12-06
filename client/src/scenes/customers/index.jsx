import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography, TextField } from "@mui/material";
import axios from 'axios';
import Header from 'components/Header';
import { DataGrid } from '@mui/x-data-grid';

const Customers = () => {
    const theme = useTheme();
    
    // Local state for managing customer data, search query, and loading state
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch customer data from the backend when the component mounts
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("http://localhost:9000/api/client/customers");
                setData(response.data);  // Set the full customer data
                setFilteredData(response.data); // Initialize filtered data with full data
                setIsLoading(false);
            } catch (error) {
                setError(error.message);  // If an error occurs, set the error message
                setIsLoading(false);
            }
        };

        fetchCustomers(); // Call the function to fetch customers when the component mounts
    }, []);  // Empty dependency array to run only once on mount

    // Update filteredData whenever searchQuery changes
    useEffect(() => {
        const filtered = data.filter((customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phoneNumber.includes(searchQuery) ||
            customer.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.occupation.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, data]); // Dependencies are searchQuery and full data

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
            flex: 0.5,
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
            <Header
                title="CUSTOMERS"
                subtitle="List of Customers"
            />
            <Box mt="20px">
                {/* Add Search Bar */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Customers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                    sx={{
                        mb: "20px", // Add some margin below the search bar
                        "& .MuiInputBase-root": {
                            backgroundColor: theme.palette.background.alt,
                        },
                    }}
                />
            </Box>
            <Box
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
                {/* Display loading text or error message if necessary */}
                {isLoading && <Typography>Loading customers...</Typography>}
                {error && <Typography color="error">Error: {error}</Typography>}

                {/* Render DataGrid with filtered customer data */}
                <DataGrid
                    loading={isLoading || !data}
                    getRowId={(row) => row._id}
                    rows={filteredData || []} // Use filtered data for rows
                    columns={columns}
                />
            </Box>
        </Box>
    );
};

export default Customers;
