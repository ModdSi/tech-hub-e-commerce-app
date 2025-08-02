import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import "./quickCSS.css";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
const ProductDetail = () => {
  const { state } = useLocation();
  const product = state?.product;

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

  return (
    <Container maxWidth="lg">
      <div
        container
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          padding: "16px",
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            //   height: "300px",
            width: "500px",
            marginRight: "24px",
            objectFit: "cover",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        />

        <div style={{ flexGrow: 1 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>
            {product.title.length > 50
              ? `${product.title.substring(0, 50)}...`
              : product.title}
          </h3>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "#eee",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            {product.category}
          </div>

          <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </p>

          <p
            style={{ fontSize: "18px", color: "#a4b020", marginBottom: "12px" }}
          >
            ${product.price}
          </p>

          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={(e) => {
              addToCart(product);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ProductDetail;
