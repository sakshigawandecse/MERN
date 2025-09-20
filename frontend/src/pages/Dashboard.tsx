import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BoardList from "../components/BoardList";
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
  Chip,
} from "@mui/material";
import { Add as AddIcon, Dashboard as DashboardIcon } from "@mui/icons-material";

interface Board {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
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
      setBoards((prev) => [...prev, res.data]);
      setNewBoardTitle("");
      setNewBoardDescription("");
      setOpenDialog(false);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create board");
    }
  };

  const renameBoard = async (id: string, newTitle: string) => {
    try {
      const res = await api.put<Board>(`/boards/${id}`, { title: newTitle });
      setBoards((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch (error) {
      console.error("Rename failed", error);
      setError("Failed to rename board");
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      await api.delete(`/boards/${id}`);
      setBoards((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      setError("Failed to delete board");
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ bgcolor: "#faf5ff" }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: "#8b5cf6", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#7c3aed" }}>
            Loading your boards...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#faf5ff", minHeight: "100vh", pb: 4 }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="bold" 
              sx={{ color: "#7c3aed", mb: 0.5 }}
            >
              My Boards
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Welcome back, {user?.name || "Guest"}
              </Typography>
              <Chip 
                icon={<DashboardIcon />} 
                label={`${boards.length} board${boards.length !== 1 ? 's' : ''}`} 
                size="small"
                sx={{ 
                  backgroundColor: "rgba(139, 92, 246, 0.1)", 
                  color: "#7c3aed",
                  fontWeight: "medium"
                }}
              />
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ 
              borderRadius: 3,
              px: 3,
              py: 1.2,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              "&:hover": { 
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 12px rgba(139, 92, 246, 0.4)"
              },
              boxShadow: "0 4px 6px rgba(139, 92, 246, 0.3)",
              transition: "all 0.2s ease",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            New Board
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": { color: "#dc2626" },
              bgcolor: "#fef2f2",
              color: "#7f1d1d",
              border: "1px solid #fecaca"
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {boards.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              border: "2px dashed #c4b5fd",
              borderRadius: 4,
              bgcolor: "white",
              color: "#7c3aed",
              boxShadow: "0 4px 20px rgba(196, 181, 253, 0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(196, 181, 253, 0.2)"
              }
            }}
          >
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              bgcolor: "#f5f3ff", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              mx: "auto",
              mb: 3
            }}>
              <AddIcon sx={{ fontSize: 40, color: "#8b5cf6" }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ color: "#7c3aed", fontWeight: "bold", mb: 1 }}>
              No boards yet
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#6b7280", maxWidth: "400px", mx: "auto" }}>
              Get started by creating your first board to organize your tasks and projects
            </Typography>
            <Button 
              variant="contained"
              startIcon={<AddIcon />} 
              onClick={() => setOpenDialog(true)} 
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.2,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                "&:hover": { 
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(139, 92, 246, 0.4)"
                },
                boxShadow: "0 4px 6px rgba(139, 92, 246, 0.3)",
                transition: "all 0.2s ease",
                fontWeight: "bold"
              }}
            >
              Create Your First Board
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {boards.map((board) => (
              <Grid key={board._id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                <BoardList board={board} onRename={renameBoard} onDelete={deleteBoard} />
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="sm" 
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
              overflow: "hidden"
            }
          }}
        >
          <Box sx={{ 
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", 
            color: "white", 
            p: 3,
            textAlign: "center"
          }}>
            <DialogTitle sx={{ color: "white", fontWeight: "bold", p: 0, mb: 1 }}>
              Create New Board
            </DialogTitle>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Organize your tasks in a new workspace
            </Typography>
          </Box>
          
          <DialogContent sx={{ p: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Board Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#a78bfa" },
                  "&.Mui-focused fieldset": { borderColor: "#8b5cf6" }
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" }
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#a78bfa" },
                  "&.Mui-focused fieldset": { borderColor: "#8b5cf6" }
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ 
                color: "#6b7280",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor: "#f3f4f6"
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={createBoard} 
              disabled={!newBoardTitle.trim()}
              sx={{
                borderRadius: 2,
                px: 3,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                "&:hover": { 
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" 
                },
                "&:disabled": { 
                  backgroundColor: "#d1d5db",
                  color: "white !important",
                }
              }}
            >
              Create Board
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;