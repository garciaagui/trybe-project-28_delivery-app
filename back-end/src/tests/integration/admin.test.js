const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jsonwebtoken = require('jsonwebtoken');

const { User } = require('../../database/models')
const app = require('../../api/app');
const mocks = require('./mocks/admin.mocks');

const { expect } = chai;
chai.use(chaiHttp);

describe('Routes /admin/manage integration tests', async () => {

  afterEach(sinon.restore)

  describe('POST /admin/manage', () => {

    describe('Successful cases', () => {
      it('Returns HTTP status 201 after successful user creation', async () => {
        sinon.stub(User, 'findOne')
          .onFirstCall().resolves(null)
          .onSecondCall().resolves(null)
          .onThirdCall().resolves(mocks.newUserCreated);
        sinon.stub(User, 'create');
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.adminTokenPayload);

        const response = await chai
                .request(app)
                .post('/admin/manage')
                .set({ "Authorization": mocks.token })
                .send({
                  ...mocks.newUser,
                  password: mocks.unhashedPassword,
                });
        
        expect(response.status).to.be.equal(201);
        expect(response.body).to.be.deep.equal(mocks.newUserRes);
      })
    });

    describe('Failure cases', () => {
      it('Returns an error with HTTP status 409 when email is already registered', async () => {
        sinon.stub(User, 'findOne').resolves(mocks.alreadyRegisteredUser);
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.adminTokenPayload);
  
        const response = await chai
                .request(app)
                .post('/admin/manage')
                .set({ "Authorization": mocks.token })
                .send({
                  ...mocks.newUser,
                  email: mocks.alreadyRegisteredUser.dataValues.email,
                  password: mocks.unhashedPassword,
                });
        
        expect(response.status).to.be.equal(409);
        expect(response.body).to.be.deep.equal({ message: 'User already registered' });
      });

      it('Returns an error with HTTP status 409 when name is already registered', async () => {
        sinon.stub(User, 'findOne')
          .onFirstCall().resolves(null)
          .onSecondCall().resolves(mocks.alreadyRegisteredUser)
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.adminTokenPayload);
  
        const response = await chai
                .request(app)
                .post('/admin/manage')
                .set({ "Authorization": mocks.token })
                .send({
                  ...mocks.newUser,
                  name: mocks.alreadyRegisteredUser.dataValues.name,
                  password: mocks.unhashedPassword,
                });
        
        expect(response.status).to.be.equal(409);
        expect(response.body).to.be.deep.equal({ message: 'User already registered' });
      });

      it('Returns an error with HTTP status 400 when a non-admin tries to add an user', async () => {
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.nonAdminTokenPayload);


        const response = await chai
                .request(app)
                .post('/admin/manage')
                .set({ "Authorization": mocks.token })
                .send({
                  ...mocks.newUser,
                  password: mocks.unhashedPassword,
                });
  
        expect(response.status).to.be.equal(400);
        expect(response.body).to.be.deep.equal( { message: "User is not an admin" } );
      });
    });
  });

  describe('GET /admin/manage/users', () => {

    describe('Successful cases', () => {
      it('Returns all users with HTTP status 200', async () => {
        sinon.stub(User, 'findAll').resolves(mocks.allUsers);
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.adminTokenPayload);

        const response = await chai
                .request(app)
                .get('/admin/manage/users')
                .set({ "Authorization": mocks.token })
        
        expect(response.status).to.be.equal(200);
        expect(response.body).to.be.deep.equal(mocks.allUsers);
      })
    });

  });

  describe('DELETE /admin/manage/users/:id', () => {

    describe('Successful cases', () => {
      it('Returns empty body with HTTP status 204 after successful user deletion', async () => {
        sinon.stub(User, 'destroy')
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.adminTokenPayload);

        const response = await chai
                .request(app)
                .delete(`/admin/manage/users/3`)
                .set({ "Authorization": mocks.token })
        
        expect(response.status).to.be.equal(204);
        expect(response.body).to.be.deep.equal({});
      })
    });

    describe('Failure cases', () => {

      it('Returns an error with HTTP status 400 when a non-admin tries to delete an user', async () => {
        sinon.stub(jsonwebtoken, 'verify').resolves(mocks.nonAdminTokenPayload);


        const response = await chai
                .request(app)
                .delete(`/admin/manage/users/3`)
                .set({ "Authorization": mocks.token })
  
        expect(response.status).to.be.equal(400);
        expect(response.body).to.be.deep.equal( { message: "User is not an admin" } );
      });
    });

  });

});