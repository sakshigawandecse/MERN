import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { ExitToApp as LogoutIcon, Dashboard as DashboardIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <DashboardIcon
          sx={{ mr: 2, color: "primary.main", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Welcome, {user?.name}
        </Typography>
        <Button color="error" startIcon={<LogoutIcon />} onClick={logout} variant="outlined" sx={{ textTransform: "none" }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
