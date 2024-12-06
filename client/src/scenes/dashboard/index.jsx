import React, { useEffect, useState } from "react";
import axios from "axios";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { Email, PointOfSale, PersonAdd, Traffic } from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import OverviewChart from "components/OverviewChart";
import BreakdownChart from "components/BreakdownChart";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/general/dashboard");
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "userId", headerName: "User Id", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  const totalCustomers = dashboardData?.totalCustomers || 0;
  const totalSales = dashboardData?.todayStats?.totalSales || 0;
  const thisMonthSales = dashboardData?.thisMonthStats?.totalSales || 0;
  const yearlySales = dashboardData?.yearlySalesTotal || 0;
  const transactions = dashboardData?.transactions || [];

  // Keyframes for animation
  const animationStyles = {
    "@keyframes backgroundPulse": {
      "0%": { backgroundColor: "#000" },
      "50%": { backgroundColor: "#0000FF" },
      "100%": { backgroundColor: "#000" },
    },
  };

  const containerStyles = {
    animation: "backgroundPulse 5s infinite",
  };

  const cardAnimationStyles = {
    animation: "backgroundPulse 3s infinite",
  };

  return (
    <Box m="2rem" sx={{ ...containerStyles, ...animationStyles }}>
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </FlexBetween>

      {/* Stat Cards */}
      <Box
        display="flex"
        justifyContent="center"
        gap="20px"
        mt="20px"
        flexWrap="wrap"
      >
        {[totalCustomers, totalSales, thisMonthSales, yearlySales].map(
          (value, idx) => {
            const titles = ["Total Customers", "Sales Today", "Monthly Sales", "Yearly Sales"];
            const icons = [
              <Email sx={{ color: theme.palette.secondary[300] }} />,
              <PointOfSale sx={{ color: theme.palette.secondary[300] }} />,
              <PersonAdd sx={{ color: theme.palette.secondary[300] }} />,
              <Traffic sx={{ color: theme.palette.secondary[300] }} />,
            ];
            const percentages = ["+14%", "+21%", "+5%", "+43%"];
            return (
              <Card
                key={idx}
                sx={{
                  ...cardAnimationStyles,
                  flex: "1 1 calc(25% - 20px)",
                  minWidth: "200px",
                  maxWidth: "300px",
                  boxShadow: 6,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": { boxShadow: 12 },
                }}
              >
                <CardHeader
                  title={titles[idx]}
                  subheader="Since last month"
                  action={<IconButton>{icons[idx]}</IconButton>}
                  sx={{
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary[200],
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                  >
                    {value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {percentages[idx]}
                  </Typography>
                </CardContent>
              </Card>
            );
          }
        )}
      </Box>

      {/* Charts */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="300px"
        gap="20px"
        mt="20px"
      >
        <Box
          gridColumn="span 8"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          <OverviewChart data={dashboardData} view="sales" isDashboard={true} />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          <BreakdownChart data={dashboardData} />
        </Box>
      </Box>

      {/* Transactions */}
      <Box
        mt="20px"
        gridColumn="span 12"
        backgroundColor={theme.palette.background.alt}
        p="1.5rem"
        borderRadius="0.55rem"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "0.55rem",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.alt,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
        }}
      >
        <DataGrid
          rows={transactions}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
