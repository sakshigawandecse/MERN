import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CalendarToday,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Board {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface BoardCardProps {
  board: Board;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const BoardList = ({ board, onRename, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleSave = () => {
    if (newTitle.trim() && newTitle !== board.title) {
      onRename(board._id, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    onDelete(board._id);
    setConfirmDeleteOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: !isEditing ? "pointer" : "default",
        transition: "all 0.3s ease",
        bgcolor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
        "&:hover": {
          transform: !isEditing ? "translateY(-6px)" : "none",
          boxShadow: !isEditing ? "0 20px 25px -5px rgba(139, 92, 246, 0.15), 0 10px 10px -5px rgba(139, 92, 246, 0.04)" : "none",
          borderColor: !isEditing ? "#a78bfa" : "#e5e7eb",
        },
      }}
      onClick={() => {
        if (!isEditing) navigate(`/board/${board._id}`);
      }}
    >
      <Box sx={{ 
        height: 6, 
        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        width: "100%" 
      }} />
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {isEditing ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#a78bfa" },
                  "&.Mui-focused fieldset": { borderColor: "#8b5cf6" }
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" }
              }}
            />
            <IconButton 
              onClick={handleSave} 
              sx={{ 
                color: "#8b5cf6", 
                ml: 1,
                "&:hover": { 
                  backgroundColor: "rgba(139, 92, 246, 0.1)" 
                }
              }}
            >
              <SaveIcon />
            </IconButton>
            <IconButton 
              onClick={() => setIsEditing(false)}
              sx={{ 
                color: "#6b7280",
                "&:hover": { 
                  backgroundColor: "rgba(107, 114, 128, 0.1)" 
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom 
              noWrap 
              sx={{ 
                flexGrow: 1,
                color: "#1f2937",
                fontWeight: "bold",
                pr: 1
              }}
            >
              {board.title}
            </Typography>
            <Box>
              <IconButton
                onClick={(e) => {
                  stopPropagation(e);
                  setIsEditing(true);
                }}
                size="small"
                sx={{ 
                  color: "#8b5cf6",
                  "&:hover": { 
                    backgroundColor: "rgba(139, 92, 246, 0.1)" 
                  }
                }}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  stopPropagation(e);
                  handleDelete();
                }}
                size="small"
                sx={{ 
                  color: "#ef4444",
                  "&:hover": { 
                    backgroundColor: "rgba(239, 68, 68, 0.1)" 
                  }
                }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        {board.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 2,
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6
            }}
          >
            {board.description}
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <CalendarToday sx={{ fontSize: 16, color: "#9ca3af", mr: 1 }} />
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
            Created: {new Date(board.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <Dialog 
        open={confirmDeleteOpen} 
        onClose={() => setConfirmDeleteOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
            overflow: "hidden"
          }
        }}
      >
        <Box sx={{ 
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", 
          color: "white", 
          p: 3,
          textAlign: "center"
        }}>
          <DialogTitle sx={{ color: "white", fontWeight: "bold", p: 0, mb: 1 }}>
            Delete Board
          </DialogTitle>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            This action cannot be undone
          </Typography>
        </Box>
        
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Are you sure you want to delete the board &quot;{board.title}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setConfirmDeleteOpen(false)}
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
            onClick={confirmDelete} 
            sx={{
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              "&:hover": { 
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" 
              },
              boxShadow: "0 4px 6px rgba(239, 68, 68, 0.3)"
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BoardList;