import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

test('Should search input be render when app is loaded', () => {
  render(<App />);
  const element = screen.getByTestId("search-input");
  expect(element).toBeInTheDocument();
});

test("Should upload-button be render when app is loaded", () => {
  render(<App />);
  const element = screen.getByTestId("upload-button");
  expect(element).toBeInTheDocument();
});
