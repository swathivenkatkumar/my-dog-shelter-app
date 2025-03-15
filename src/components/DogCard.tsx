// src/components/DogCard/DogCard.tsx

import React from "react";
import { Dog } from "../services/api";

interface DogCardProps {
  dog: Dog;
  onFavoriteToggle?: (dog: Dog) => void;
  isFavorited?: boolean;
}

/**
 * A card component to display a dog's details.
 * The image is fixed to 200px height with object-fit set to cover,
 * ensuring a consistent appearance even if the original image sizes differ.
 */
const DogCard: React.FC<DogCardProps> = ({ dog, onFavoriteToggle, isFavorited = true }) => {
  return (
    <div className="card mb-3" style={{ minWidth: "18rem" }}>
      {dog.img && (
        <img
          src={dog.img}
          className="card-img-top"
          alt={`${dog.name} - ${dog.breed}`}
          style={{ height: "200px", objectFit: "cover" }} // Fixed height with cover to maintain aspect ratio
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{dog.name}</h5>
        <p className="card-text">
          <strong>Breed:</strong> {dog.breed} <br />
          <strong>Age:</strong> {dog.age} <br />
          <strong>Zip Code:</strong> {dog.zip_code}
        </p>
        {onFavoriteToggle && (
          <button className="btn btn-sm btn-outline-primary" onClick={() => onFavoriteToggle(dog)}>
            {isFavorited ? "Remove Favorite" : "Add Favorite"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DogCard;
