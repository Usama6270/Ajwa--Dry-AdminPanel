import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from 'components/Header';
import BreakdownChart from 'components/BreakdownChart';
import axios from 'axios';

const Breakdown = () => {
  const [breakdownData, setBreakdownData] = useState(null); // State to hold the fetched data
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch data using Axios when component mounts
  useEffect(() => {
    const fetchBreakdownData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:9000/api/sales/sales"); // Your API endpoint
        setBreakdownData(response.data);  // Store the fetched data
      } catch (err) {
        setError("Error fetching breakdown data: " + err.message);  // Handle error
      } finally {
        setIsLoading(false);  // End loading
      }
    };

    fetchBreakdownData();
  }, []);  // Empty dependency array ensures the effect runs once after initial render

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="BREAKDOWN" subtitle="Breakdown of Sales by Category" />
      <Box mt="40px" height="75vh">
        {isLoading ? (
          <>Loading...</>  // Loading message while data is fetching
        ) : error ? (
          <Box color="error.main">{error}</Box>  // Error message if API request fails
        ) : (
          // Pass the fetched breakdown data to the BreakdownChart component
          <BreakdownChart data={breakdownData} />
        )}
      </Box>
    </Box>
  );
}

export default Breakdown;
