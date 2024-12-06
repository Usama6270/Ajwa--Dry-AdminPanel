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

  // State to store fetched data
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

  // Loading and Error States
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" mt={2}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  const totalCustomers = dashboardData?.totalCustomers || 0;
  const totalSales = dashboardData?.todayStats?.totalSales || 0;
  const thisMonthSales = dashboardData?.thisMonthStats?.totalSales || 0;
  const yearlySales = dashboardData?.yearlySalesTotal || 0;
  const transactions = dashboardData?.transactions || [];
  const salesByCategory = dashboardData?.salesByCategory || {};

  return (
    <Box m="2rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 - Stat Boxes */}
        <Card sx={{ boxShadow: 6, transition: 'all 0.3s ease-in-out', '&:hover': { boxShadow: 12 } }}>
          <CardHeader
            title="Total Customers"
            subheader="Since last month"
            action={<IconButton><Email sx={{ color: theme.palette.secondary[300] }} /></IconButton>}
            sx={{
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[200],
            }}
          />
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              {totalCustomers}
            </Typography>
            <Typography variant="body1" color="text.secondary">+14%</Typography>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 6, transition: 'all 0.3s ease-in-out', '&:hover': { boxShadow: 12 } }}>
          <CardHeader
            title="Sales Today"
            subheader="Since last month"
            action={<IconButton><PointOfSale sx={{ color: theme.palette.secondary[300] }} /></IconButton>}
            sx={{
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[200],
            }}
          />
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              ${totalSales}
            </Typography>
            <Typography variant="body1" color="text.secondary">+21%</Typography>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 6, transition: 'all 0.3s ease-in-out', '&:hover': { boxShadow: 12 } }}>
          <CardHeader
            title="Monthly Sales"
            subheader="Since last month"
            action={<IconButton><PersonAdd sx={{ color: theme.palette.secondary[300] }} /></IconButton>}
            sx={{
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[200],
            }}
          />
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              ${thisMonthSales}
            </Typography>
            <Typography variant="body1" color="text.secondary">+5%</Typography>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 6, transition: 'all 0.3s ease-in-out', '&:hover': { boxShadow: 12 } }}>
          <CardHeader
            title="Yearly Sales"
            subheader="Since last month"
            action={<IconButton><Traffic sx={{ color: theme.palette.secondary[300] }} /></IconButton>}
            sx={{
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[200],
            }}
          />
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              ${yearlySales}
            </Typography>
            <Typography variant="body1" color="text.secondary">+43%</Typography>
          </CardContent>
        </Card>

        {/* ROW 2 - Overview and Breakdown Chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          display="flex"
          flexDirection="column"
        >
          <OverviewChart data={dashboardData} view="sales" isDashboard={true} />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          display="flex"
          flexDirection="column"
        >
          <BreakdownChart data={dashboardData} />
        </Box>

        {/* ROW 3 - Transaction Data */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "0.55rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              '&:hover': {
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid rows={transactions} columns={columns} getRowId={(row) => row._id} autoHeight />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
