import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import api from '../services/requests';
import renderWithRouter from './helpers/renderWithRouter';
import adminMocks from './helpers/mocks/admin.mocks';
import navBarMocks from './helpers/mocks/admin.navbar.mocks';
import loginMocks from './helpers/mocks/login.mocks';

describe('Test the Admin NavBar component', () => {
  let history;

  beforeEach(() => {
    jest.spyOn(api, 'requestData').mockImplementation(() => adminMocks.allUsers);

    history = renderWithRouter(<App />).history;

    localStorage.setItem('user', JSON
      .stringify(loginMocks.adminLoginData));

    history.push('/admin/manage');
  });

  afterEach(() => jest.clearAllMocks());

  test('Checks if the elements exist', async () => {
    await waitFor(() => {});

    const managementLink = screen.getByTestId(navBarMocks.managementLink);
    const userNameElement = screen.getByTestId(navBarMocks.userNameElement);
    const logoutButton = screen.getByTestId(navBarMocks.logoutButton);

    expect(managementLink).toBeInTheDocument();
    expect(userNameElement).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test(
    'Checks user redirection to admin management page after clicking respective link',
    async () => {
      await waitFor(() => {});

      const managementLink = screen.getByTestId(navBarMocks.managementLink);

      userEvent.click(managementLink);

      await waitFor(() => {
        expect(history.location.pathname).toBe('/admin/manage');
      });
    },
  );

  test('Checks if the username matches local storage data', async () => {
    await waitFor(() => {});

    const userNameElement = screen.getByTestId(navBarMocks.userNameElement);

    expect(userNameElement.innerHTML).toContain(loginMocks.adminLoginData.name);
  });

  test(
    'Checks user redirection to login page after clicking logout button',
    async () => {
      await waitFor(() => {});

      const logoutButton = screen.getByTestId(navBarMocks.logoutButton);

      userEvent.click(logoutButton);

      await waitFor(() => {
        expect(history.location.pathname).toBe('/login');
      });
    },
  );
});
