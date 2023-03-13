const md5 = require('md5');

const unhashedPassword = "newuser123";
const hashedPassword = md5(unhashedPassword);
const id = 4;

const newUser = {
  name: "unusedWonderfulName",
  email: "newuser@email.com",
  role: 'customer'
}

const newUserCreated = {
  dataValues: {
    ...newUser,
    password: hashedPassword,
    id,
  },
}

const newUserRes = {
  ...newUser,
  id
}

const alreadyRegisteredUser = {
  dataValues: {
    id: 3,
    name: 'Cliente Zé Birita',
    email: 'zebirita@email.com',
    password: '1c37466c159755ce1fa181bd247cb925',
    role: 'customer',
  },
}

const allUsers = [
  {
    dataValues: {
      id: 2,
      name: 'Fulana Pereira',
      email: 'fulana@deliveryapp.com',
      role: 'seller',
      password: '3c28d2b0881bf46457a853e0b07531c6'
    }
  },
  {
    dataValues: {
      id: 3,
      name: 'Cliente Zé Birita',
      email: 'zebirita@email.com',
      role: 'customer',
      password: '1c37466c159755ce1fa181bd247cb925'
    }
  },
  { ...newUserCreated },
]

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3NDUwODQ0MCwiZXhwIjoxNjc0NTMwMDQwfQ.1snol1cy5G6-3E3PZ7m9NPwhy4kQOcrwWiz677V_n98"

const adminTokenPayload = { data: { email: 'adm@deliveryapp.com', role: 'administrator' }, iat: 1674516494, exp: 1674538094 }

const nonAdminTokenPayload = { data: { email: 'zebirita@email.com', role: 'customer' }, iat: 1674516494, exp: 1674538094 }


module.exports = { newUser, unhashedPassword, newUserCreated, newUserRes, alreadyRegisteredUser, allUsers, token, adminTokenPayload, nonAdminTokenPayload };