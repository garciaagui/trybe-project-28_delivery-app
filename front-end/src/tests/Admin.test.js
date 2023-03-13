import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import api from '../services/requests';
import renderWithRouter from './helpers/renderWithRouter';
import adminMocks from './helpers/mocks/admin.mocks';
import loginMocks from './helpers/mocks/login.mocks';

describe('Test the Admin page', () => {
  let history;

  beforeEach(() => {
    jest.spyOn(api, 'requestData').mockImplementation(() => adminMocks.registeredUsers);

    history = renderWithRouter(<App />).history;

    localStorage.setItem('user', JSON
      .stringify(loginMocks.adminLoginData));

    history.push('/admin/manage');
  });

  afterEach(() => jest.clearAllMocks());

  test('Checks if the form elements exist', async () => {
    await waitFor(() => {});

    const name = screen.getByTestId(adminMocks.formElements.name);
    const email = screen.getByTestId(adminMocks.formElements.email);
    const password = screen.getByTestId(adminMocks.formElements.password);
    const role = screen.getByTestId(adminMocks.formElements.role);
    const button = screen.getByTestId(adminMocks.formElements.button);

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(role).toBeInTheDocument();
    expect(button).toBeInTheDocument();

  });

  test('Checks if the table elements exist', async () => {
    await waitFor(() => {});

    adminMocks.registeredUsers.forEach((user, index) => {
      const number = screen.getByTestId(`${adminMocks.tableElements.number}${index}`);
      const name = screen.getByTestId(`${adminMocks.tableElements.name}${index}`);
      const email = screen.getByTestId(`${adminMocks.tableElements.email}${index}`);
      const role = screen.getByTestId(`${adminMocks.tableElements.role}${index}`);
      const rmButton = screen.getByTestId(`${adminMocks.tableElements.rmButton}${index}`);

      expect(number).toBeInTheDocument();
      expect(number.innerHTML).toBe((index + 1).toString());

      expect(name).toBeInTheDocument();
      expect(name.innerHTML).toBe(user.name);

      expect(email).toBeInTheDocument();
      expect(email.innerHTML).toBe(user.email);

      expect(role).toBeInTheDocument();
      expect(role.innerHTML).toBe(user.role);

      expect(rmButton).toBeInTheDocument();
    });
  });

  test('Checks if the user can type in inputs elements and use roles select ', () => {

    const name = screen.getByTestId(adminMocks.formElements.name);
    const email = screen.getByTestId(adminMocks.formElements.email);
    const password = screen.getByTestId(adminMocks.formElements.password);
    const role = screen.getByTestId(adminMocks.formElements.role);

    userEvent.type(name, adminMocks.newUser.name);
    userEvent.type(email, adminMocks.newUser.email);
    userEvent.type(password, adminMocks.newUser.password);
    userEvent.selectOptions(role, [adminMocks.newUser.role]);
    
    expect(name).toHaveValue(adminMocks.newUser.name);
    expect(email).toHaveValue(adminMocks.newUser.email);
    expect(password).toHaveValue(adminMocks.newUser.password);
    expect(role).toHaveValue(adminMocks.newUser.role);
    expect(screen.getByRole('option', { name: adminMocks.newUser.role }).selected).toBe(true);
  });

  test('Checks if register button is only enabled with valid input values', () => {
    const name = screen.getByTestId(adminMocks.formElements.name);
    const email = screen.getByTestId(adminMocks.formElements.email);
    const password = screen.getByTestId(adminMocks.formElements.password);
    const role = screen.getByTestId(adminMocks.formElements.role);
    const button = screen.getByTestId(adminMocks.formElements.button);

    userEvent.selectOptions(role, [adminMocks.newUser.role]);
    expect(button).toBeDisabled();

    userEvent.type(name, adminMocks.newUser.name);
    expect(button).toBeDisabled();

    userEvent.type(email, adminMocks.newUser.email);
    expect(button).toBeDisabled();

    userEvent.type(password, adminMocks.newUser.password);
    expect(button).toBeEnabled();
  });

  test('Checks if the invalid message element appears with a name already registered', async () => {
    const error = {
      response: {
        data: {
          message: 'User already registered',
          code: 'ERR_BAD_REQUEST',
        },
        status: 409,
      },
    };

  jest.spyOn(api, 'requestLogin').mockRejectedValue(error);

    const name = screen.getByTestId(adminMocks.formElements.name);
    const email = screen.getByTestId(adminMocks.formElements.email);
    const password = screen.getByTestId(adminMocks.formElements.password);
    const role = screen.getByTestId(adminMocks.formElements.role);
    const button = screen.getByTestId(adminMocks.formElements.button);

    userEvent.selectOptions(role, [adminMocks.newUser.role]);
    userEvent.type(name, adminMocks.registeredUsers[0].name); // Name already registered
    userEvent.type(email, adminMocks.newUser.email);
    userEvent.type(password, adminMocks.newUser.password);
    userEvent.click(button);

    await waitFor(() => {
      const message = screen.getByTestId(adminMocks.formElements.invalidationMessage);
      expect(message.innerHTML).toBe(error.response.data.message);
    })
  });

  test('Checks if the invalid message element appears with a email already registered', async () => {
    const error = {
      response: {
        data: {
          message: 'User already registered',
          code: 'ERR_BAD_REQUEST',
        },
        status: 409,
      },
    };

  jest.spyOn(api, 'requestLogin').mockRejectedValue(error);

    const name = screen.getByTestId(adminMocks.formElements.name);
    const email = screen.getByTestId(adminMocks.formElements.email);
    const password = screen.getByTestId(adminMocks.formElements.password);
    const role = screen.getByTestId(adminMocks.formElements.role);
    const button = screen.getByTestId(adminMocks.formElements.button);

    userEvent.selectOptions(role, [adminMocks.newUser.role]);
    userEvent.type(name, adminMocks.newUser.name);
    userEvent.type(email, adminMocks.registeredUsers[0].email); // Email already registered
    userEvent.type(password, adminMocks.newUser.password);
    userEvent.click(button);

    await waitFor(() => {
      const message = screen.getByTestId(adminMocks.formElements.invalidationMessage);
      expect(message.innerHTML).toBe(error.response.data.message);
    })
  });
});
