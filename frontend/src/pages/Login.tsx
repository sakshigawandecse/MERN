import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Dashboard } from "@mui/icons-material";

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post<AuthResponse>("/auth/login", { email, password });
      login({ _id: res.data._id, name: res.data.name, email: res.data.email }, res.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        bgcolor: "#faf5ff",
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          width: "100%", 
          maxWidth: 400, 
          padding: 4,
          borderRadius: 3,
          bgcolor: "white",
          boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)",
          border: "1px solid #e5e7eb"
        }}
      >
        <Box textAlign="center" mb={3}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Dashboard 
              sx={{ 
                fontSize: "40px", 
                color: "#7c3aed",
                mr: 1
              }} 
            />
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#7c3aed" }}>
              Task Manager
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#1f2937" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Sign in to continue to your task management
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              "& .MuiAlert-icon": { color: "#dc2626" },
              bgcolor: "#fef2f2",
              color: "#7f1d1d",
              border: "1px solid #fecaca"
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
  mb: 2,
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px white inset !important",
    WebkitTextFillColor: "#1f2937 !important",
    caretColor: "#1f2937",
  },
}}

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
  mb: 2,
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px white inset !important",
    WebkitTextFillColor: "#1f2937 !important",
    caretColor: "#1f2937",
  },
}}

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
                    sx={{ color: "#6b7280" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={isLoading}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              py: 1.5,
              mb: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              "&:hover": { 
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 12px rgba(139, 92, 246, 0.4)"
              },
              boxShadow: "0 4px 6px rgba(139, 92, 246, 0.3)",
              transition: "all 0.2s ease",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
          </Button>
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Don't have an account?{" "}
              <Link 
                to="/register" 
                style={{ 
                  textDecoration: "none", 
                  color: "#7c3aed",
                  fontWeight: "500"
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;