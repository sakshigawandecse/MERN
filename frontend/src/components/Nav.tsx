import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { ExitToApp as LogoutIcon, Dashboard as DashboardIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
        boxShadow: "0 4px 6px rgba(139, 92, 246, 0.3)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Toolbar sx={{ py: 1.5 }}>
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            mr: 3,
            "&:hover": { 
              "& .logo-icon": {
                transform: "scale(1.1)",
              }
            }
          }}
          onClick={() => navigate("/")}
        >
          <DashboardIcon
            className="logo-icon"
            sx={{ 
              mr: 1.5, 
              fontSize: "30px",
              transition: "transform 0.2s ease",
            }}
            color="inherit"
          />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              color: "white",
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              letterSpacing: "-0.5px"
            }}
          >
            Task Manager
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      
          
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ 
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              py: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.2s ease",
              fontWeight: "500",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;