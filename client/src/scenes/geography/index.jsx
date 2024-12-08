import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import Header from "components/Header";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css";

const Geography = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [countryName, setCountryName] = useState(null);

  // List of major cities in Pakistan
  const citiesInPakistan = [
    { name: "Karachi", lat: 24.8607, lng: 67.0011 },
    { name: "Lahore", lat: 31.5497, lng: 74.3436 },
    { name: "Islamabad", lat: 33.6844, lng: 73.0479 },
    { name: "Peshawar", lat: 34.0151, lng: 71.5249 },
    { name: "Quetta", lat: 30.1798, lng: 66.9750 },
    { name: "Multan", lat: 30.1575, lng: 71.5249 },
    { name: "Faisalabad", lat: 31.4167, lng: 73.0833 },
    { name: "Rawalpindi", lat: 33.6007, lng: 73.0679 },
  ];

  // Helper function to calculate the nearest city
  const findNearestCity = (lat, lng) => {
    let nearestCity = null;
    let minDistance = Infinity;

    citiesInPakistan.forEach((city) => {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city.name;
      }
    });

    return nearestCity;
  };

  // IP Geolocation API key
  const apiKey = "f3751faaba434691b2371bfdb3735a83";

  // Fetching user's location using IP Geolocation API
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`);
        setUserLocation({
          lat: parseFloat(response.data.latitude),
          lng: parseFloat(response.data.longitude),
        });
        setCityName(response.data.city);
        setCountryName(response.data.country_name);
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching location data");
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  // Random Coordinates Generator for Pakistan (approx. bounding box)
  const generateRandomCoordinates = () => {
    const latMin = 23.6345;
    const latMax = 37.0841;
    const lngMin = 60.9305;
    const lngMax = 77.0369;

    const lat = latMin + Math.random() * (latMax - latMin);
    const lng = lngMin + Math.random() * (lngMax - lngMin);

    return { lat, lng };
  };

  // Generate random active user locations
  const activeUserLocations = Array.from({ length: 10 }, () => {
    const randomCoords = generateRandomCoordinates();
    return {
      ...randomCoords,
      city: findNearestCity(randomCoords.lat, randomCoords.lng),
      country: "Pakistan",
    };
  });

  const userLocationIcon = new L.DivIcon({
    className: "user-location-icon",
    html: `
      <div style="width: 0; height: 0; border-left: 10px solid transparent; 
      border-right: 10px solid transparent; border-bottom: 20px solid red;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="GEOGRAPHY" subtitle="Find where your active users are located in Pakistan" />
      <Box mt="40px" height="75vh" border={`1px solid ${theme.palette.secondary[200]}`} borderRadius="4px">
        {isLoading ? (
          <Typography variant="h6" align="center" color={theme.palette.secondary[200]}>
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="h6" align="center" color="error">
            {error}
          </Typography>
        ) : (
          <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [30.3753, 69.3451]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                <Popup>
                  <Typography variant="body2">You are in: {cityName}, {countryName}</Typography>
                </Popup>
              </Marker>
            )}
            {activeUserLocations?.map((loc, index) => (
              <CircleMarker
                key={index}
                center={[loc.lat, loc.lng]}
                radius={8}
                color="blue"
                fillOpacity={0.7}
              >
                <Popup>
                  <Typography variant="body2">
                    User {index + 1}: {loc.city}, {loc.country}
                  </Typography>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </Box>
    </Box>
  );
};

export default Geography;
