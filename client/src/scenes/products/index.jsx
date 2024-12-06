import React, { useEffect, useState } from 'react';
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, Rating, useTheme, useMediaQuery, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from 'axios';
import Header from 'components/Header';

const pulseAnimation = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Product = ({
    _id,
    name,
    description,
    price,
    rating,
    category,
    supply,
    stat
}) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem"
            }}
        >
            <CardContent>
                <Typography
                    sx={{
                        fontSize: 14
                    }}
                    color={theme.palette.secondary[700]}
                    gutterBottom
                >
                    {category}
                </Typography>

                <Typography variant="h5" component="div">
                    {name}
                </Typography>

                <Typography
                    sx={{
                        mb: "1.5rem"
                    }}
                    color={theme.palette.secondary[400]}
                >
                    ${Number(price).toFixed(2)}
                </Typography>
                <Rating value={rating} readOnly />

                <Typography variant='body2'>
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant='primary'
                    size='small'
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    See More
                </Button>
            </CardActions>
            <Collapse
                in={isExpanded}
                timeout="auto"
                unmountOnExit
                sx={{
                    color: theme.palette.neutral[300]
                }}
            >
                <CardContent>
                    <Typography>{_id}</Typography>
                    <Typography>Supply Left: {supply}</Typography>
                    <Typography>Yearly Sales This Year: {stat?.yearlySalesTotal || 0}</Typography>
                    <Typography>Yearly Units Sold This Year: {stat?.yearlyUnitsSold || 0}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

const Products = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    // State variables
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        rating: '',
        category: '',
        supply: ''
    });

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:9000/api/client/products");
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleAddProduct = async () => {
        try {
            const response = await axios.post("http://localhost:9000/api/client/products", newProduct);
            const addedProduct = response.data;

            // Add default stats if they are missing in the API response
            const completeProduct = {
                ...addedProduct,
                stat: addedProduct.stat || { yearlySalesTotal: 0, yearlyUnitsSold: 0 }
            };

            // Update state with the new product
            setData((prevData) => [...prevData, completeProduct]);
            setIsDialogOpen(false);
            setNewProduct({ name: '', description: '', price: '', rating: '', category: '', supply: '' });
        } catch (error) {
            console.error("Failed to add product:", error.message);
        }
    };

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="PRODUCTS" subtitle="See your list of products." />
            <Button
                variant="contained"
                color="primary"
                sx={{
                    mb: "20px",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'scale(1.05)',
                    },
                    '&:active': {
                        animation: 'pulse 0.5s ease-out',
                    },
                    '@keyframes pulse': pulseAnimation // Apply the pulse animation
                }}
                onClick={() => setIsDialogOpen(true)}
            >
                Add Product
            </Button>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">Error: {error}</Typography>
            ) : (
                <Box
                    mt="20px"
                    display="grid"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    justifyContent="space-between"
                    rowGap="20px"
                    columnGap="1.33%"
                    sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                    }}
                >
                    {data.map(({ _id, name, description, price, rating, category, supply, stat }) => (
                        <Product
                            key={_id}
                            _id={_id}
                            name={name}
                            description={description}
                            price={price}
                            rating={rating}
                            category={category}
                            supply={supply}
                            stat={stat}
                        />
                    ))}
                </Box>
            )}

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Rating"
                        name="rating"
                        value={newProduct.rating}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Category"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Supply"
                        name="supply"
                        value={newProduct.supply}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddProduct} variant="contained" color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Products;
