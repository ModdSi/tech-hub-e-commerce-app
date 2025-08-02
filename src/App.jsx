import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Products from "./components/Products";
import Users from "./components/Users";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ProductDetail from "./components/ProductDetail";

const AppContent = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#a4b020",
        contrastText: "#000000",
      },
      secondary: {
        main: darkMode ? "#646464" : "#1976d2",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: "#c5d428",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#b8c424",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#1e1e1e" : "#aaaaaa",
            color: darkMode ? "#ffffff" : "#000000",
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <ProtectedRoute>
            <Routes>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route
                path="/login"
                element={<Navigate to="/products" replace />}
              />
            </Routes>
          </ProtectedRoute>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
