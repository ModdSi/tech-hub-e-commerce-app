import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Pagination,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ShoppingCart, X } from "@mui/icons-material";
import api from "../utils/axios";
import list from "../assets/list.png";
import grid from "../assets/grid.png";
import { Link, Navigate, useNavigate } from "react-router";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  const view = JSON.parse(localStorage.getItem("view") || "true");
  const [isGrid, setGrid] = useState(view);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/posts");
      const mockProducts = response.data.slice(0, 24).map((post) => ({
        id: post.id,
        title: post.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ["Electronics", "Clothing", "Books", "Home"][
          Math.floor(Math.random() * 4)
        ],
        image: `https://picsum.photos/300/200?random=${post.id}`,
        description: post.body,
      }));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  localStorage.setItem("view", JSON.stringify(isGrid));

  const handleView = () => {
    if (isGrid) setGrid(false);
    else setGrid(true);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={{ transition: "all 0.3s" }} maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Products ({filteredProducts.length} items)
          </Typography>
          <div
            id="view-c"
            style={{ margin: "8px", cursor: "pointer" }}
            onClick={handleView}
          >
            {isGrid ? (
              <img style={{ height: "35px", opacity: "0.7" }} src={list} />
            ) : (
              <img style={{ height: "35px", opacity: "0.7" }} src={grid} />
            )}
          </div>
        </div>

        <TextField
          fullWidth
          label="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />
        {isGrid ? (
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card
                  onClick={() =>
                    navigate(`/products/${product.id}`, {
                      state: { product },
                    })
                  }
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    ":hover": {
                      scale: "1.02",
                      opacity: "0.9",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title.length > 50
                        ? `${product.title.substring(0, 50)}...`
                        : product.title}
                    </Typography>

                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ mb: 1 }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </Typography>

                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          currentProducts.map((product) => (
            <List>
              <Card
                onClick={() =>
                  navigate(`/products/${product.id}`, {
                    state: { product },
                  })
                }
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                  cursor: "pointer",
                  ":hover": {
                    scale: "1.01",
                    opacity: "0.9",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={product.image}
                  alt={product.title}
                  sx={{ width: "40%" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.title.length > 50
                      ? `${product.title.substring(0, 50)}...`
                      : product.title}
                  </Typography>

                  <Chip label={product.category} size="small" sx={{ mb: 1 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </List>
          ))
        )}

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </Typography>
          </Stack>
        )}

        {filteredProducts.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;
