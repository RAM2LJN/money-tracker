import { render, screen } from '@testing-library/react';
import App from './App';

<<<<<<< HEAD
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
=======
jest.mock('react-chartjs-2', () => ({ Pie: () => <div />, Line: () => <div /> }));

test('renders money tracker title', () => {
  render(<App />);
  const title = screen.getByText(/money tracker/i);
  expect(title).toBeInTheDocument();
>>>>>>> 81b0cc613551f66d12b583a5cb0c60c504507d10
});
