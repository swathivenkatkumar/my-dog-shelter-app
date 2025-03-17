import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DogCard from '../components/DogCard';
import { Dog } from '../services/api';

// Mock dog data
const mockDog: Dog = {
  id: '1',
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: 3,
  zip_code: '12345',
  img: 'https://example.com/dog.jpg'
};

describe('DogCard Component', () => {
  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test Case 1:
  test('renders dog information correctly', () => {
    render(<DogCard dog={mockDog} />);
    
    expect(screen.getByText(mockDog.name)).toBeInTheDocument();
    expect(screen.getByText(/Breed:/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockDog.breed, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/Age:/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(mockDog.age), 'i'))).toBeInTheDocument();
    expect(screen.getByText(/Zip Code:/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockDog.zip_code, 'i'))).toBeInTheDocument();
  });

  //Test Case 2:
  test('displays favorite button when onFavoriteToggle is provided', () => {
    render(<DogCard dog={mockDog} onFavoriteToggle={mockToggleFavorite} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('does not display favorite button when onFavoriteToggle is not provided', () => {
    render(<DogCard dog={mockDog} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  //Test Case 3:
  test('displays correct button text based on favorite status', () => {
    const { rerender } = render(
      <DogCard dog={mockDog} onFavoriteToggle={mockToggleFavorite} />
    );
    
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();

    rerender(
      <DogCard 
        dog={mockDog} 
        onFavoriteToggle={mockToggleFavorite} 
        isFavorited={true} 
      />
    );
    
    expect(screen.getByText('Remove from Favorites')).toBeInTheDocument();
  });

  //Test Case 4:
  test('calls onFavoriteToggle with dog when button is clicked', () => {
    render(<DogCard dog={mockDog} onFavoriteToggle={mockToggleFavorite} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockDog);
  });

  //Test Case 5:
  test('displays dog image when available', () => {
    render(<DogCard dog={mockDog} />);
    
    const image = screen.getByAltText(`${mockDog.name} - ${mockDog.breed}`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockDog.img);
  });

  //Test Case 6:
  test('does not display image when not available', () => {
    // Create a new dog object with empty string for img instead of undefined
    const dogWithoutImage: Dog = { 
      ...mockDog, 
      img: ''
    };
    
    render(<DogCard dog={dogWithoutImage} />);
    
    expect(screen.queryByAltText(`${mockDog.name} - ${mockDog.breed}`)).not.toBeInTheDocument();
  });

  //Test Case 7:
  test('applies correct styling to favorite button', () => {
    const { rerender } = render(
      <DogCard dog={mockDog} onFavoriteToggle={mockToggleFavorite} />
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('btn-outline-primary');

    rerender(
      <DogCard 
        dog={mockDog} 
        onFavoriteToggle={mockToggleFavorite} 
        isFavorited={true} 
      />
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('btn-outline-danger');
  });
});