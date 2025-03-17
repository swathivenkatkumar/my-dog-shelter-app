import { Dog } from "../services/api";
import { Card, Button } from "react-bootstrap";

interface DogCardProps {
  dog: Dog;
  onFavoriteToggle?: (dog: Dog) => void;
  isFavorited?: boolean;
}

/**
 * component to display a dog's details
 */
const DogCard: React.FC<DogCardProps> = ({ dog, onFavoriteToggle, isFavorited = false }) => {
  return (
    <Card
      className="mb-2 shadow-sm"
      style={{
        minWidth: "18rem",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative" }}>
        {dog.img && (
          <Card.Img
            variant="top"
            src={dog.img}
            alt={`${dog.name} - ${dog.breed}`}
            style={{ height: "250px", objectFit: "cover", transition: "transform 0.3s" }}
          />
        )}
      </div>
      <Card.Body>
        <Card.Title>{dog.name}</Card.Title>
        <Card.Text>
          <strong>Breed:</strong> {dog.breed}
          <br />
          <strong>Age:</strong> {dog.age}
          <br />
          <strong>Zip Code:</strong> {dog.zip_code}
        </Card.Text>
        {onFavoriteToggle && (
          <Button
            variant={isFavorited ? "outline-danger" : "outline-primary"}
            size="sm"
            onClick={() => onFavoriteToggle(dog)}
          >
            {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default DogCard;
