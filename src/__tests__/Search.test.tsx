import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../components/Search';
import { searchDogs } from '../services/api';

// Mock API
jest.mock('../services/api', () => ({
  fetchBreeds: jest.fn().mockResolvedValue(['Labrador', 'Poodle']),
  searchDogs: jest.fn().mockResolvedValue({
    resultIds: ['1', '2'],
    total: 2,
    next: 'next',
    prev: 'prev'
  }),
  fetchDogs: jest.fn().mockResolvedValue([
    { id: '1', name: 'Buddy', breed: 'Labrador', age: 3, zip_code: '12345' },
    { id: '2', name: 'Max', breed: 'Poodle', age: 5, zip_code: '67890' }
  ]),
  generateMatch: jest.fn().mockResolvedValue({ match: '1' })
}));

describe('Search Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test Case 1
  test('renders basic elements', async () => {
    render(<Search />);
    await waitFor(() => {
      expect(screen.getByText('Search Shelter Dogs')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Breed:')).toBeInTheDocument();
      expect(screen.getByText('Sort: Ascending')).toBeInTheDocument();
    });
  });

   //Test Case 2
  test('displays dogs after loading', async () => {
    render(<Search />);
    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
    });
  });

  
 //Test Case 3
test('adds and removes favorites', async () => {
    render(<Search />);
    await waitFor(() => screen.getByText('Buddy'));
    const firstDogAddButton = screen.getAllByRole('button', { 
      name: /Add to Favorites/i 
    })[0];
    fireEvent.click(firstDogAddButton);
    const favoritesSection:any = screen.getByText('Your Favorites').closest('.card')!;
    const removeButton = within(favoritesSection).getByRole('button', { 
      name: /Remove from Favorites/i 
    });
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(within(favoritesSection).queryByText('Buddy')).not.toBeInTheDocument();
    });
  });
  
   //Test Case 4
  test('paginates correctly', async () => {
    render(<Search />);
    await waitFor(() => screen.getByText('Buddy'));
    
    const nextButton = screen.getByRole('button', { name: 'Next page' });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(searchDogs).toHaveBeenCalledWith(
        [],
        'breed:asc',
        'next',
        25
      );
    });
  });

   //Test Case 5
  test('filters by breed', async () => {
    render(<Search />);
    await waitFor(() => screen.getByText('Buddy'));
    
    fireEvent.change(screen.getByLabelText('Filter by Breed:'), {
      target: { value: 'Poodle' }
    });
    
    await waitFor(() => {
      expect(searchDogs).toHaveBeenCalledWith(['Poodle'], 'breed:asc', undefined, 25);
    });
  });

   //Test Case 6
  test('generates match', async () => {
    render(<Search />);
    await waitFor(() => screen.getByText('Buddy'));
    
    fireEvent.click(screen.getAllByText('Add to Favorites')[0]);
    fireEvent.click(screen.getByText('Generate Match'));
    
    await waitFor(() => {
      expect(screen.getByText('Your Match')).toBeInTheDocument();
    });
  });
});