import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-chartjs-2', () => ({ Pie: () => <div />, Line: () => <div /> }));

test('renders money tracker title', () => {
  localStorage.setItem('token', 'test');
  render(<App />);
  const title = screen.getByText(/money tracker/i);
  expect(title).toBeInTheDocument();
});
