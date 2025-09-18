
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Board {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface BoardCardProps {
  board: Board;
}

const BoardList = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
      onClick={() => navigate(`/board/${board._id}`)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {board.title}
        </Typography>
        {board.description && (
          <Typography 
            variant="body2" 
            color="textSecondary" 
            paragraph 
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {board.description}
          </Typography>
        )}
        <Typography variant="caption" color="textSecondary">
          Created: {new Date(board.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BoardList;