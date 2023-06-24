import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from '../api/axios';
import Login from '../pages/Login';
import { toBeInTheDocument } from '@testing-library/jest-dom/extend-expect';

jest.mock('../api/axios'); 

describe('Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByText('Sign In');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  test('submits login form with correct credentials', async () => {
    const mockResponse = {
      data: {
        accessToken: 'mockAccessToken',
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'Eric' } });
    fireEvent.change(passwordInput, { target: { value: 'Testing123!' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        '/login',
        JSON.stringify({ user: 'Eric', pwd: 'Testing123!' }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    });
  });

  test('fail to submit login form with wrong credentials', async () => {
    const mockResponse = {
      data: {
        accessToken: 'mockAccessToken',
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'Eric' } });
    fireEvent.change(passwordInput, { target: { value: 'Testing123!' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).not.toHaveBeenCalledWith(
        '/login',
        JSON.stringify({ user: 'Wrong', pwd: 'Wrong' }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    });
  });
});
