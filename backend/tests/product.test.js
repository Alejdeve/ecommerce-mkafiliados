const request = require('supertest');
const { app } = require('../src/app'); // Asegúrate de que este path sea correcto
const Product = require('../src/models/Product'); // Asegúrate de que este path sea correcto

describe('Product Tests', () => {
  let authToken;
  const testProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    brand: 'Test Brand',
    ageRange: {
      min: 0,
      max: 3
    },
    category: 'test-category',
    affiliateInfo: {
      vendor: 'Test Vendor',
      commission: 10,
      externalUrl: 'https://example.com/product'
    }
  };

  beforeAll(async () => {
    // Registrar un usuario de prueba
    const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'test@example.com',
            password: 'password123',
            profile: {
                firstName: 'Test',
                lastName: 'User'
            }
        });

    authToken = registerResponse.body.token;
    
    // Verificar que tenemos el token
    if (!authToken) {
        console.error('Failed to get auth token');
        throw new Error('Authentication failed in test setup');
    }
});

  describe('Product CRUD Operations', () => {
    test('Should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(testProduct.name);
    });

    test('Should get all products', async () => {
      // Create a product first
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct);

      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('Should get product by id', async () => {
      // Create a product first
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct);

      const productId = createResponse.body._id;

      const response = await request(app)
        .get(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(productId);
    });

    test('Should update product', async () => {
      // Create a product first
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct);

      const productId = createResponse.body._id;
      const updatedName = 'Updated Product Name';

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...testProduct, name: updatedName });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedName);
    });

    test('Should delete product', async () => {
      // Create a product first
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct);

      const productId = createResponse.body._id;

      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify product is deleted
      const getResponse = await request(app)
        .get(`/api/products/${productId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe('Product Filters', () => {
    beforeEach(async () => {
      // Create multiple test products
      const products = [
        { ...testProduct, price: 50, ageRange: { min: 0, max: 2 } },
        { ...testProduct, price: 100, ageRange: { min: 3, max: 6 } },
        { ...testProduct, price: 150, ageRange: { min: 0, max: 3 } }
      ];

      for (const product of products) {
        await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send(product);
      }
    });

    test('Should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ minPrice: 75, maxPrice: 125 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      response.body.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(75);
        expect(product.price).toBeLessThanOrEqual(125);
      });
    });

    test('Should filter products by age range', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ targetAge: 2 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      response.body.forEach(product => {
        expect(product.ageRange.min).toBeLessThanOrEqual(2);
        expect(product.ageRange.max).toBeGreaterThanOrEqual(2);
      });
    });
  });
});