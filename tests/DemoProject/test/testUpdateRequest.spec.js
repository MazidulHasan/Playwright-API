// tests/api.spec.js
const { test, expect } = require('@playwright/test');

const API_URL = 'http://localhost:3000/api';
// const AUTH_TOKEN = 'fake-jwt-token';
const generateFakeUserData = require('../fakeDataGenerate/userFakeData');
const userResponseSchema = require('../schema/userSchemaForAJV');


const { faker } = require('@faker-js/faker');
const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');


const ajv = new Ajv();
addFormats(ajv);

test.describe('API Validation Tests', () => {
  let authToken;
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { username: 'testuser', password: 'testpass' }
    });
    expect(response.ok()).toBeTruthy();
    authToken = (await response.json()).token;
  });

  test('Create user with valid data :: Manual', async ({ request }) => {
    const userData = {
      profile: {
        name: 'John Doe',
        age: 30,
        isStudent: false,
        education: { degree: 'Bachelor' }
      },
      account: {
        email: 'john@example.com',
        password: 'Passw0rd!',
        confirmPassword: 'Passw0rd!'
      },
      metadata: {
        acceptTerms: true,
        signupSource: 'web'
      }
    };

    const response = await request.post(`${API_URL}/createUser`, {
      data: userData,
      headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${authToken}`}
    });
  
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
  });


  test.only('Create user with valid data :: Faker', async ({ request }) => {
    const fakeUser = generateFakeUserData();
    const res = await request
      .post(`${API_URL}/createUser`, {
        data: fakeUser,
        headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${authToken}`}
      })
      
      const responsejson = await res.json()
      const validate = ajv.compile(userResponseSchema.useResponseSchema);
      const valid = validate(responsejson);
  
      if (!valid) {
        console.error('AJV Validation Errors:',validate.errors);
      }
  
      expect(valid).toBe(true);
      expect(responsejson.profile.name).toBe(fakeUser.profile.name);
      expect(responsejson.account.email).toBe(fakeUser.account.email);
  });



  test('Create user validation failures', async ({ request }) => {
    const invalidUsers = [
      {
        // Missing required fields
        data: { profile: { name: 'J' } }, // Name too short
        expectedErrors: ['profile.name', 'profile.age', 'account.email']
      },
      {
        // Password mismatch
        data: {
          profile: { name: 'Jane', age: 25, isStudent: true },
          account: { email: 'jane@test.com', password: 'Pass1!', confirmPassword: 'Pass2!' },
          metadata: { acceptTerms: true, signupSource: 'web' }
        },
        expectedErrors: ['account.confirmPassword']
      }
    ];

    for (const testCase of invalidUsers) {
      const response = await request.post(`${API_URL}/createUser`, {
        data: testCase.data,
        headers: { 'Content-Type': 'application/json' }
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      testCase.expectedErrors.forEach(errorPath => {
        expect(body.errors.some(e => e.path.includes(errorPath))).toBeTruthy();
      });
    }
  });

  test('Update user with authentication', async ({ request }) => {
    const updateData = {
      profile: { name: 'Updated Name' },
      updateReason: 'Name change',
      updatedFields: ['profile.name']
    };

    const response = await request.put(`${API_URL}/updateUser/123`, {
      data: updateData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe('123');
    expect(body.updatedAt).toBeDefined();
  });

  test('Unauthorized update attempt', async ({ request }) => {
    const response = await request.put(`${API_URL}/updateUser/123`, {
      data: { updateReason: 'test', updatedFields: [] }
    });
    expect(response.status()).toBe(401);
  });
});