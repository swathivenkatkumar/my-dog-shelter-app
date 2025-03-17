import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

jest.mock('../services/api');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('Login Component', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    navigateMock = jest.fn();
    mockedUseNavigate.mockImplementation(() => navigateMock);
    jest.clearAllMocks();
  });

  //Test Case 1: render login form with all elements
  test('renders login form with all elements', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /Welcome to Dog Shelter/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  //Test Case 2
  test('displays validation errors when fields are empty', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Both name and email are required./i)).toBeInTheDocument();
    });
  });

  //Test Case 3:
  test('submits form and navigates on successful login', async () => {
    mockedLoginUser.mockResolvedValueOnce(undefined);
    
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Swathi' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'swathi@gmail.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith('Swathi', 'swathi@gmail.com');
      expect(navigateMock).toHaveBeenCalledWith('/search');
    });
  });

  //Test Case 4:
  test('shows loading state during submission', async () => {
    mockedLoginUser.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Swathi' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'swathi@gmail.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Logging in.../i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  //Test Case 5:
  test('displays error message on login failure', async () => {
    mockedLoginUser.mockRejectedValueOnce(new Error('Login failed'));
    
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Swathi' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'swathi@gmail.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Login failed. Please try again./i)).toBeInTheDocument();
    });
  });
});