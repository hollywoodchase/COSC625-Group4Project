import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders navbar with National Park Explorer', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  const brandText = screen.getByText(/national park explorer/i);
  expect(brandText).toBeInTheDocument();
});
