import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders welcome to home page', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Welcome to the Home Page!/i);
  expect(linkElement).toBeInTheDocument();
});
