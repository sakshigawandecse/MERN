import { Paper, Typography, Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardItem from "./CardItem";

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
}

const List = ({ list }: ListProps) => {
  return (
    <Paper 
      sx={{ 
        minWidth: 280, 
        maxWidth: 280,
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
      elevation={1}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'grey.200',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ flexGrow: 1 }}>
          {list.title}
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, flexGrow: 1, minHeight: 200 }}>
        {list.cards && list.cards.length > 0 ? (
          list.cards.map(card => (
            <CardItem key={card._id} card={card} />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
            No cards yet
          </Typography>
        )}
      </Box>
      
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Button fullWidth startIcon={<AddIcon />} size="small">
          Add Card
        </Button>
      </Box>
    </Paper>
  );
};

export default List;