// tests/api.spec.js
const { test, expect } = require('@playwright/test');

const API_URL = 'http://localhost:3000/api';
// const AUTH_TOKEN = 'fake-jwt-token';
const generateFakeUserData = require('../fakeDataGenerate/userFakeData');
const userResponseSchema = require('../schema/userSchemaForAJV');
const scenarios = require('../schema/validationData');


const { faker } = require('@faker-js/faker');
const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');
const { request } = require('http');


const ajv = new Ajv();
addFormats(ajv);
let authToken;
test.describe('API Validation Tests', () => {
  
  
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



  test('Create user validation failures : with manual change data', async ({ request }) => {
    const fakeUser = generateFakeUserData();
    fakeUser.profile.name = "n";

    const res = await request
      .post(`${API_URL}/createUser`, {
        data: fakeUser,
        headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${authToken}`}
      })
      
      const responsejson = await res.json()
      console.log("responsejson",responsejson);
      
      const validate = ajv.compile(userResponseSchema.useResponseSchema);
      const valid = validate(responsejson);
  
      if (!valid) {
        console.error('AJV Validation Errors:',validate.errors);
      }

  });
});

test.describe('API Validation Tests', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { username: 'testuser', password: 'testpass' }
    });
    expect(response.ok()).toBeTruthy();
    authToken = (await response.json()).token;
  });

  for (const { field, invalidValue, expectedError } of scenarios.userCreateDataForValidation) {
    test(`Invalid ${field} should trigger validation`, async ({ request }) => {
      const fakeUser = generateFakeUserData();
      scenarios.setNestedField(fakeUser, field, invalidValue);

      const res = await request.post(`${API_URL}/createUser`, {
        data: fakeUser,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });

      const responseJson = await res.json();
      console.log("responseJson:::",responseJson);
      
      const errorMsgs = responseJson.errors.map(e => e.msg);
      // expect(errorMsgs).toContain(expectedError);


      const responsejson = await res.json()
      const validate = ajv.compile(userResponseSchema.useResponseSchema);
      const valid = validate(responsejson);
      if (!valid) {
        console.error('AJV Validation Errors:',validate.errors);
      }
    });
  }
  
})