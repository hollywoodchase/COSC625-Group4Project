import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // ✅ Import your context provider

test('renders learn react link', () => {
  render(
    <AuthProvider>  {/* ✅ Wrap App with provider */}
      <App />
    </AuthProvider>
  );

  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
