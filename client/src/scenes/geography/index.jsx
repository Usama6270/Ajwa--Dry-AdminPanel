import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography } from "@mui/material";
import Header from "components/Header";
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Geography = () => {
    const theme = useTheme();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetching geography data using axios
    useEffect(() => {
        const fetchGeographyData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/client/geography');
                setData(response.data);  // Set the fetched data
                setIsLoading(false);  // Set loading state to false after data is fetched
            } catch (err) {
                setError('Error fetching geography data');  // Handle error if request fails
                setIsLoading(false);  // Set loading state to false even if there's an error
            }
        };

        fetchGeographyData();
    }, []);

    // Random Coordinates Generator for Pakistan (approx. bounding box)
    const generateRandomCoordinates = () => {
        // Pakistan's approximate lat/lng bounding box
        const latMin = 23.6345;
        const latMax = 37.0841;
        const lngMin = 60.9305;
        const lngMax = 77.0369;

        // Randomly generate latitude and longitude within the bounding box
        const lat = latMin + Math.random() * (latMax - latMin);
        const lng = lngMin + Math.random() * (lngMax - lngMin);

        return { lat, lng };
    };

    // Generate random active user locations (replace with actual data if needed)
    const activeUserLocations = Array.from({ length: 10 }, () => generateRandomCoordinates()); // 10 random users

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="GEOGRAPHY" subtitle="Find where your active users are located in Pakistan" />
            <Box
                mt="40px"
                height="75vh"
                border={`1px solid ${theme.palette.secondary[200]}`}
                borderRadius="4px"
            >
                {isLoading ? (
                    <Typography variant="h6" align="center" color={theme.palette.secondary[200]}>
                        Loading...
                    </Typography>
                ) : error ? (
                    <Typography variant="h6" align="center" color="error">
                        {error}
                    </Typography>
                ) : (
                    <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {activeUserLocations?.map((loc, index) => (
                            <CircleMarker
                                key={index}
                                center={[loc.lat, loc.lng]}
                                radius={8} // Larger radius for visibility
                                color="blue" // Blue color for the dot
                                fillOpacity={0.7} // Slight transparency
                            >
                                <Popup>{`Active User ${index + 1}`}</Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                )}
            </Box>
        </Box>
    );
};

export default Geography;
