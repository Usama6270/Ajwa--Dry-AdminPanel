import React, { useState, useEffect } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";  // Import axios
import Header from "components/Header";

const Performance = () => {
  const theme = useTheme();
  const userId = useSelector((state) => state.global.userId);  // Get userId from Redux store
  const [data, setData] = useState(null);  // State for user performance data
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch data using Axios
  useEffect(() => {
    const fetchUserPerformance = async () => {
      setIsLoading(true);  // Set loading state to true
      try {
        const response = await axios.get(`http://localhost:9000/api/management/performance/${userId}`);  // Make GET request to your backend route
        setData(response.data);  // Set the fetched data
      } catch (err) {
        setError("Error fetching performance data: " + err.message);  // Handle error
      } finally {
        setIsLoading(false);  // Set loading state to false
      }
    };

    fetchUserPerformance();  // Call the function to fetch data
  }, [userId]);  // Dependency array - fetch data again if userId changes

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();  // Format the date as per requirement
      }
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,  // Render length of products array
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,  // Format cost
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="PERFORMANCE"
        subtitle="Track your Affiliate Sales Performance Here"
      />
      <Box mt="40px" height="75vh">
        {isLoading ? (
          <Typography>Loading...</Typography>  // Show loading while fetching data
        ) : error ? (
          <Box color="error.main">{error}</Box>  // Show error if any
        ) : (
          <DataGrid
            loading={isLoading || !data}  // Show loading state if data is not ready
            getRowId={(row) => row._id}
            rows={(data && data.sales) || []}  // Use fetched data for rows
            columns={columns}
            pageSize={10}  // Set page size for the grid
            rowsPerPageOptions={[5, 10, 25]}
          />
        )}
      </Box>
    </Box>
  );
};

export default Performance;
