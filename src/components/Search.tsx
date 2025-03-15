// src/components/Search/Search.tsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Pagination,
} from "react-bootstrap";
import {
  fetchBreeds,
  searchDogs,
  fetchDogs,
  Dog,
  generateMatch,
} from "../services/api";
import DogCard from "./DogCard";

/**
 * The Search component lets users browse shelter dogs with filtering, sorting,
 * pagination, and favorites. Users can add dogs to their favorites and generate a match.
 */
const Search: React.FC = () => {
  // States for filter and sort options.
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [breeds, setBreeds] = useState<string[]>([]);

  // Page size and current page.
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

  // Calculate total number of pages.
  const totalPages = Math.ceil(total / pageSize);

  // Fetch available breeds.
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

  // Loads dogs based on filters, sorting, and pagination.
  const loadDogs = async (cursor?: string) => {
    setLoading(true);
    setError("");
    try {
      const breedsFilter = selectedBreed ? [selectedBreed] : [];
      const sortQuery = `breed:${sortOrder}`;
      const searchResults = await searchDogs(
        breedsFilter,
        sortQuery,
        cursor,
        pageSize
      );

      setTotal(searchResults.total);
      setNextCursor(searchResults.next);
      setPrevCursor(searchResults.prev);

      const dogDetails = await fetchDogs(searchResults.resultIds);

      const sortedDogs = dogDetails.sort((a, b) =>
        sortOrder === "asc"
          ? a.breed.localeCompare(b.breed)
          : b.breed.localeCompare(a.breed)
      );
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
      const favoriteIds = favorites.map((dog) => dog.id);
      const matchResult = await generateMatch(favoriteIds);
      
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
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Search Shelter Dogs</h2>

      {/* Favorites Section */}
      {favorites.length === 0 ? (
            <p></p>
          ) : (
      <Card className="mb-4">
        <Card.Header>Your Favorites</Card.Header>
        <Card.Body>
          
            <Row>
              {favorites.map((dog) => (
                <Col key={dog.id} md={3} className="m-3">
                  <DogCard
                    dog={dog}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorited={true}
                  />
                </Col>
              ))}
            </Row>
          
          <div className="text-end">
            <Button
              variant="primary"
              onClick={handleGenerateMatch}
              disabled={favorites.length === 0}
            >
              Generate Match
            </Button>
          </div>
        </Card.Body>
      </Card>
      )}

      {/* Match Result Section */}
      {matchedDog && (
        <Card className="mb-4">
          <Card.Header>Your Match</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <DogCard dog={matchedDog} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Filter and Sort Controls */}
      <Row className="mb-2">
        <Col md={4}>
          <Form.Group controlId="breedFilter">
            <Form.Label>Filter by Breed:</Form.Label>
            <Form.Select
              value={selectedBreed}
              onChange={(e) => {
                setSelectedBreed(e.target.value);
                setPageNumber(1); 
              }}
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button variant="secondary" onClick={toggleSortOrder}>
            Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </Col>
      </Row>

      {/* Loading Indicator & Error Message */}
      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Display Dog Cards */}
      <Row>
        {dogs.map((dog) => (
          <Col key={dog.id} md={4} className="mb-4">
            <DogCard
              dog={dog}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={favorites.some((fav) => fav.id === dog.id)}
            />
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center align-items-center my-3">
        <Pagination>
          <Pagination.Prev onClick={handlePrev} disabled={!prevCursor} />
          <Pagination.Item disabled>
            Page {pageNumber} of {totalPages}
          </Pagination.Item>
          <Pagination.Next onClick={handleNext} disabled={!nextCursor} />
        </Pagination>
      </div>
    </Container>
  );
};

export default Search;
