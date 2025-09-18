import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BoardCard from "../components/BoardList";
import Navbar from "../components/Nav";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface Board {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBoards = async () => {
    try {
      const res = await api.get<Board[]>("/boards");
      setBoards(res.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const res = await api.post<Board>("/boards", {
        title: newBoardTitle,
        description: newBoardDescription,
      });
      setBoards((prev) => [...prev, res.data]); // Fixed: res.data is a single Board object, not array
      setNewBoardTitle("");
      setNewBoardDescription("");
      setOpenDialog(false);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create board");
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1">Welcome, {user?.name || "Guest"}</Typography>
        <Button
          variant="text"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Boards
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            New Board
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {boards.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No boards yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first board to get started
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ borderRadius: 2 }}>
              Create Board
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {boards.map((board) => (
              <Grid key={board._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <BoardCard board={board} />
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Board Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={createBoard} disabled={!newBoardTitle.trim()}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
