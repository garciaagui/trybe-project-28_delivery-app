const formElements = {
  name: 'admin_manage__input-name',
  email: 'admin_manage__input-email',
  password: 'admin_manage__input-password',
  role: 'admin_manage__select-role',
  button: 'admin_manage__button-register',
  invalidationMessage: 'admin_manage__element-invalid-register',
};

const tableElements = {
  number: 'admin_manage__element-user-table-item-number-',
  name: 'admin_manage__element-user-table-name-',
  email: 'admin_manage__element-user-table-email-',
  role: 'admin_manage__element-user-table-role-',
  rmButton: 'admin_manage__element-user-table-remove-',
};

const registeredUsers = [
  {
    id: 2,
    name: 'Fulana Pereira',
    email: 'fulana@deliveryapp.com',
    role: 'seller',
  },
  {
    id: 3,
    name: 'Cliente Zé Birita',
    email: 'zebirita@email.com',
    role: 'customer',
  },
];

const newUser = {
  id: 4,
  name: 'Bruce Wayne Batman',
  email: 'brucewayne@mail.com',
  password: 'imnotbatman123',
  role: 'administrator',
};

const allUsers = [
  ...registeredUsers,
  newUser,
];

export default {
  formElements,
  tableElements,
  registeredUsers,
  newUser,
  allUsers,
};
