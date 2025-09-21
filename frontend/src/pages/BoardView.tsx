import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import List from "../components/List";

interface Card {
  _id: string;
  title: string;
  description?: string;
}

interface ListType {
  _id: string;
  title: string;
  board: string;
  position: number;
  cards?: Card[];
}

interface Board {
  _id: string;
  title: string;
  description?: string;
}

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ListType[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBoardData = async () => {
    if (!id) return;
    try {
      const [boardRes, listsRes] = await Promise.all([
        api.get<Board>(`/boards/${id}`),
        api.get<ListType[]>(`/lists/board/${id}`),
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
    if (!newListTitle.trim() || !id) {
      console.error("List title or board id missing");
      return;
    }
    try {
      const res = await api.post<ListType>("/lists", {
        title: newListTitle,
        board: id,
        position: lists.length,
      });
      setLists((prev) => [...prev, res.data]);
      setNewListTitle("");
      setOpen(false);
    } catch (err: any) {
      console.error("Error creating list:", err);
    }
  };

  const handleAddCard = (listId: string, newCard: Card) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list._id === listId ? { ...list, cards: [...(list.cards ?? []), newCard] } : list
      )
    );
  };

  useEffect(() => {
    fetchBoardData();
  }, [id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewListTitle("");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f3ff"
      >
        <CircularProgress sx={{ color: "#7c3aed" }} size={60} />
      </Box>
    );
  }

  if (!board) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h4" color="#dc2626" gutterBottom>
          Board not found
        </Typography>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            borderColor: "#8b5cf6",
            color: "#8b5cf6",
            "&:hover": { borderColor: "#7c3aed", bgcolor: "#f3f4f6" },
          }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f3ff", pt: 2, pb: 5 }}>
      <AppBar position="sticky" sx={{ bgcolor: "#7c3aed" }} elevation={3}>
        <Toolbar>
          <IconButton onClick={() => navigate("/")} color="inherit" edge="start" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: "white", fontWeight: 600 }}>
            {board.title}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: 3,
              bgcolor: "#8b5cf6",
              "&:hover": { bgcolor: "#7c3aed" },
            }}
          >
            Add List
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ py: 3, px: 2 }}>
        {board.description && (
          <Typography
            variant="subtitle1"
            color="#6b7280"
            sx={{ fontStyle: "italic", mb: 3, ml: 1 }}
          >
            {board.description}
          </Typography>
        )}

        {lists.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              border: "2px dashed #c4b5fd",
              borderRadius: 4,
              bgcolor: "white",
              color: "#7c3aed",
            }}
          >
            <Typography variant="h4" gutterBottom>
              No Lists Present
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#6b7280" }}>
              Use the button above to add your first list.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleOpen}
              sx={{
                borderColor: "#8b5cf6",
                color: "#8b5cf6",
                "&:hover": { borderColor: "#7c3aed", bgcolor: "#f3f4f6" },
              }}
            >
              Add List
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              pb: 3,
              minHeight: "60vh",
            }}
          >
            {lists.map((list) => (
              <List key={list._id} list={list} onAddCard={handleAddCard} />
            ))}
          </Box>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ color: "#1f2937" }}>Add New List</DialogTitle>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#a78bfa" },
                  "&.Mui-focused fieldset": { borderColor: "#8b5cf6" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#6b7280" }}>
              Cancel
            </Button>
            <Button
              onClick={createList}
              variant="contained"
              disabled={!newListTitle.trim()}
              sx={{
                bgcolor: "#8b5cf6",
                color: "white",
                "&:hover": { bgcolor: "#7c3aed" },
                "&:disabled": { bgcolor: "#d1d5db", color: "#9ca3af" },
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BoardView;
