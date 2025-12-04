import { render, screen } from '@testing-library/react';
import App from './App';

test('renders brand name', () => {
  render(<App />);
  const brandElement = screen.getByText(/Frozen Food Oppa/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders login button when not authenticated', () => {
  render(<App />);
  // Check for Login button in Navbar
  const loginButtons = screen.getAllByText(/Login/i);
  expect(loginButtons.length).toBeGreaterThan(0);
});
