// src/components/Search/Search.tsx

import React, { useEffect, useState } from "react";
import { fetchBreeds, searchDogs, fetchDogs, Dog, generateMatch } from "../services/api";
import DogCard from "./DogCard";

/**
 * The Search component lets users browse shelter dogs with filtering, sorting, pagination, and favorites.
 * Users can add dogs to their favorites and then generate a match based on their favorite selections.
 */
const Search: React.FC = () => {
  // States for filter and sort options.
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [breeds, setBreeds] = useState<string[]>([]);

  // Page size and current page tracking.
  const pageSize = 25;
  const [pageNumber, setPageNumber] = useState<number>(1);

  // States for dog results and pagination cursors.
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

  // States for loading and error handling.
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // State for favorites.
  const [favorites, setFavorites] = useState<Dog[]>([]);

  // State for the matched dog.
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  // Fetch available breeds once when the component mounts.
  useEffect(() => {
    async function loadBreeds() {
      try {
        const data = await fetchBreeds();
        setBreeds(data);
      } catch (err) {
        console.error("Error fetching breeds:", err);
      }
    }
    loadBreeds();
  }, []);

  // Loads dogs based on current filters, sorting, and pagination.
  const loadDogs = async (cursor?: string) => {
    setLoading(true);
    setError("");
    try {
      const breedsFilter = selectedBreed ? [selectedBreed] : [];
      const sortQuery = `breed:${sortOrder}`; // Pass sort parameter (for consistency).
      const searchResults = await searchDogs(breedsFilter, sortQuery, cursor, pageSize);

      setTotal(searchResults.total);
      setNextCursor(searchResults.next);
      setPrevCursor(searchResults.prev);

      const dogDetails = await fetchDogs(searchResults.resultIds);
      
      // Explicitly sort the dogs on the client side to ensure the correct order.
      const sortedDogs = dogDetails.sort((a, b) => {
        return sortOrder === "asc"
          ? a.breed.localeCompare(b.breed)
          : b.breed.localeCompare(a.breed);
      });
      setDogs(sortedDogs);
    } catch (err) {
      setError("Failed to load dogs. Please try again later.");
      console.error("Error loading dogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // When filter or sort changes, reset page number and reload dogs.
  useEffect(() => {
    setPageNumber(1);
    loadDogs();
  }, [selectedBreed, sortOrder]);

  // Toggle sort order.
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Pagination handlers.
  const handleNext = () => {
    if (nextCursor) {
      loadDogs(nextCursor);
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (prevCursor) {
      loadDogs(prevCursor);
      setPageNumber((prev) => Math.max(prev - 1, 1));
    }
  };

  // Calculate total number of pages.
  const totalPages = Math.ceil(total / pageSize);

  // Handle adding/removing a dog from favorites.
  const handleFavoriteToggle = (dog: Dog) => {
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === dog.id);
      if (isFavorited) {
        // Remove from favorites.
        return prevFavorites.filter((fav) => fav.id !== dog.id);
      } else {
        // Add to favorites.
        return [...prevFavorites, dog];
      }
    });
  };

  // Generate a match using the favorite dog IDs.
  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      alert("Please add some favorite dogs first!");
      return;
    }
    try {
      // Map favorites to their IDs.
      const favoriteIds = favorites.map((dog) => dog.id);
      const matchResult = await generateMatch(favoriteIds);
      // matchResult.match contains the matched dog ID.
      const matchedDetails = await fetchDogs([matchResult.match]);
      if (matchedDetails.length > 0) {
        setMatchedDog(matchedDetails[0]);
      } else {
        setError("Match generated but failed to retrieve details.");
      }
    } catch (err) {
      setError("Failed to generate match. Please try again later.");
      console.error("Error generating match:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Search Shelter Dogs</h2>

      {/* Favorites Section */}
      <div className="mb-4">
        <h4>Your Favorites</h4>
        {favorites.length === 0 && <p>No favorites selected yet.</p>}
        <div className="row">
          {favorites.map((dog) => (
            <div key={dog.id} className="col-md-3">
              <DogCard dog={dog} onFavoriteToggle={handleFavoriteToggle} isFavorited={true} />
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-2" onClick={handleGenerateMatch} disabled={favorites.length === 0}>
          Generate Match
        </button>
      </div>

      {/* Match Result Section */}
      {matchedDog && (
        <div className="mb-4">
          <h4>Your Match</h4>
          <div className="row">
            <div className="col-md-4">
              <DogCard dog={matchedDog} />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Controls */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="breed" className="form-label">
            Filter by Breed:
          </label>
          <select
            id="breed"
            className="form-select"
            value={selectedBreed}
            onChange={(e) => {
              setSelectedBreed(e.target.value);
              setPageNumber(1); // Reset page when filter changes.
            }}
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-secondary" onClick={toggleSortOrder}>
            Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>

      {loading && <p>Loading dogs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display Dog Cards */}
      <div className="row">
        {dogs.map((dog) => (
          <div key={dog.id} className="col-md-4">
            <DogCard
              dog={dog}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={favorites.some((fav) => fav.id === dog.id)}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between my-3 align-items-center">
        <button className="btn btn-outline-primary" onClick={handlePrev} disabled={!prevCursor}>
          Previous
        </button>
        <span>
          Page {pageNumber} of {totalPages} ({dogs.length} dogs shown on this page, {total} total)
        </span>
        <button className="btn btn-outline-primary" onClick={handleNext} disabled={!nextCursor}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Search;
