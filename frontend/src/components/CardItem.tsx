import { Card, CardContent, Typography } from "@mui/material";

interface Card {
  _id: string;
  title: string;
  description?: string;
}

interface CardItemProps {
  card: Card;
}

const CardItem = ({ card }: CardItemProps) => {
  return (
    <Card sx={{ mb: 1, cursor: 'pointer' }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" gutterBottom>
          {card.title}
        </Typography>
        {card.description && (
          <Typography variant="caption" color="textSecondary">
            {card.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CardItem;