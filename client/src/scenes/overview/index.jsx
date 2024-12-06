import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Select,
  CircularProgress,
  Typography,
} from "@mui/material";
import Header from "components/Header";
import OverviewChart from "components/OverviewChart";
import axios from "axios";

const Overview = () => {
  const [view, setView] = useState("units");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:9000/api/sales/sales");
        console.log("API Response:", response.data);
        setData(response.data);
      } catch (err) {
        console.error("API Error:", err.message);
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="OVERVIEW" subtitle="Overview of general revenue and profit" />
      <Box height="75vh">
        <FormControl sx={{ mt: "1rem" }}>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="sales">Sales</MenuItem>
            <MenuItem value="units">Units</MenuItem>
          </Select>
        </FormControl>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : data && data.monthlyData && data.monthlyData.length > 0 ? (
          <OverviewChart data={data} view={view} />
        ) : (
          <Typography align="center" color="textSecondary">
            No data available to display.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Overview;
