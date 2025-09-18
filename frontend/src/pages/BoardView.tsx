import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, ArrowBack as ArrowBackIcon, DragIndicator as DragIcon } from "@mui/icons-material";

interface List {
  _id: string;
  title: string;
  board: string;
  position: number;
}
interface Board {
  _id: string;
  title: string;
  description?: string;
}

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBoardData = async () => {
    if (!id) return;

    try {
      const [boardRes, listsRes] = await Promise.all([
        api.get<Board>(`/boards/${id}`),
        api.get<List[]>(`/lists/board/${id}`),
      ]);
      setBoard(boardRes.data);
      setLists(listsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!newListTitle.trim() || !id) return;

    try {
      const res = await api.post<List>("/lists", {
        title: newListTitle,
        board: id,
        position: lists.length,
      });
      setLists([...lists, res.data]);
      setNewListTitle("");
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [id]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewListTitle("");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!board) {
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Board not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "grey.100", pb: 4 }}>
      <AppBar position="static" color="primary" elevation={3}>
        <Toolbar>
          <IconButton onClick={() => navigate("/")} color="inherit" edge="start" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {board.title}
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog} sx={{ borderRadius: 2 }}>
            Add List
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ py: 3, px: 2 }}>
        {board.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, ml: 1 }}>
            {board.description}
          </Typography>
        )}

        {lists.length === 0 ? (
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
              No lists yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first list to start adding tasks
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenDialog}>
              Create List
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
            {lists.map((list) => (
              <Paper
                key={list._id}
                elevation={2}
                sx={{
                  minWidth: 280,
                  maxWidth: 280,
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "grey.100",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <DragIcon color="disabled" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ flexGrow: 1 }}>
                    {list.title}
                  </Typography>
                  <IconButton size="small" aria-label="Add card">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ p: 2, flexGrow: 1, minHeight: 200 }}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    No cards yet
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1,
                    borderTop: 1,
                    borderColor: "grey.300",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Button fullWidth startIcon={<AddIcon />} size="small" variant="text">
                    Add Card
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Create New List</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="List Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={createList} variant="contained" disabled={!newListTitle.trim()}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BoardView;
