import React, { useEffect, useState, useMemo } from "react";
import { Box, useTheme, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";  // Importing axios

const Monthly = () => {
  const [data, setData] = useState(null); // State to store data from API
  const [selectedMonth, setSelectedMonth] = useState(""); // State to hold selected month
  const theme = useTheme();

  // Fetch data using axios
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/sales/sales");
        setData(response.data); // Assuming the data contains a `monthlyData` field
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData(); // Call the function to fetch data
  }, []); // Empty dependency array to run this effect only once (on mount)

  // Formatting the data for the chart
  const formattedData = useMemo(() => {
    if (!data) return []; // If no data, return empty

    const { monthlyData } = data; // Assuming `monthlyData` contains the array of objects
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
    };

    // Filter data based on selected month
    const filteredData = selectedMonth
      ? monthlyData.filter(({ month }) => month === selectedMonth)
      : monthlyData;

    filteredData.forEach(({ month, totalSales, totalUnits }) => {
      totalSalesLine.data.push({
        x: month,
        y: totalSales,
      });
      totalUnitsLine.data.push({
        x: month,
        y: totalUnits,
      });
    });

    return [totalSalesLine, totalUnitsLine]; // Return formatted data
  }, [data, selectedMonth]); // Dependency on data and selectedMonth to reformat when they change

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value); // Set the selected month
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />

      {/* Month selection dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Month</InputLabel>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          label="Month"
        >
          {/* Create MenuItems dynamically from the data */}
          {data &&
            data.monthlyData.map(({ month }) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <Box height="75vh">
        {data ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</> // Display loading message while data is fetching
        )}
      </Box>
    </Box>
  );
};

export default Monthly;
