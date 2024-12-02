const request = require('supertest');
const { app } = require('../src/app'); // Asegúrate de que este path sea correcto
const User = require('../src/models/User'); // Asegúrate de que este path sea correcto

describe('Authentication Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#',
    profile: {
      firstName: 'Test',
      lastName: 'User'
    }
  };

  describe('User Registration', () => {
    test('Should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    });

    test('Should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Second registration attempt
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    test('Should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('Should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});