import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardItem from "./CardItem";
import api from "../api/axios";

interface Card {
  _id: string;
  title: string;
  description?: string;
}

interface List {
  _id: string;
  title: string;
  cards?: Card[];
}

interface ListProps {
  list: List;
  onAddCard: (listId: string, newCard: Card) => void;
}

const List = ({ list, onAddCard }: ListProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openDialog = () => {
    setOpen(true);
    setTitle("");
    setDescription("");
    setError("");
  };

  const closeDialog = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setError("");
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<Card>("/cards", {
        title: title.trim(),
        description: description.trim(),
        listId: list._id,
      });
      onAddCard(list._id, res.data);
      closeDialog();
    } catch (err) {
      setError("Failed to add card. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          minWidth: 280,
          maxWidth: 280,
          bgcolor: "#f5f3ff", // soft lavender background
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: "0 4px 6px -1px rgb(147 51 234 / 0.1), 0 2px 4px -2px rgb(147 51 234 / 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 15px -3px rgb(147 51 234 / 0.15), 0 4px 6px -4px rgb(147 51 234 / 0.15)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "2px solid #e0e7ff",
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
            noWrap
          >
            {list.title}
          </Typography>
          <Button
            size="small"
            sx={{
              ml: 1,
              borderRadius: 2,
              backgroundColor: "#a78bfa",
              color: "white",
              "&:hover": { backgroundColor: "#8b5cf6" },
              textTransform: "none",
              fontSize: "0.75rem",
              boxShadow: "0 2px 4px rgba(167, 139, 250, 0.3)",
            }}
            variant="contained"
            onClick={openDialog}
            startIcon={<AddIcon sx={{ fontSize: "16px" }} />}
          >
            Add Card
          </Button>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          {list.cards && list.cards.length > 0 ? (
            list.cards.map((card) => <CardItem key={card._id} card={card} />)
          ) : (
            <Typography
              variant="body2"
              color="#a1a1aa"
              align="center"
              sx={{ mt: 6, fontStyle: "italic" }}
            >
              No cards available.
            </Typography>
          )}
        </Box>
      </Paper>

      <Dialog open={open} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "#1f2937" }}>Add New Card</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}
          <TextField
            autoFocus
            margin="normal"
            label="Title *"
            fullWidth
            variant="outlined"
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#a78bfa" },
                "&.Mui-focused fieldset": { borderColor: "#8b5cf6" },
              },
            }}
          />
          <TextField
            margin="normal"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#a78bfa" },
                "&.Mui-focused fieldset": { borderColor: "#8b5cf6" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={loading} sx={{ color: "#6b7280" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!title.trim() || loading}
            sx={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
              "&:hover": { background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" },
              "&:disabled": { backgroundColor: "#d1d5db" },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Add Card"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default List;
