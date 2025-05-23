// tests/api.spec.js
const { test, expect } = require('@playwright/test');

const API_URL = 'http://localhost:3000/api';
const generateFakeUserData = require('../fakeDataGenerate/userFakeData');
const userResponseSchema2 = require('../schema/userSchemaForAJV2');
const scenarios = require('../schema/validationData');


const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');


const ajvErrors = require('ajv-errors');
const ajv = new Ajv({ allErrors: true, strict: false, $data: true });
ajvErrors(ajv);

addFormats(ajv);

let authToken;
test.describe('API Update Validation Tests', () => {
  
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { username: 'testuser', password: 'testpass' }
    });
    expect(response.ok()).toBeTruthy();
    authToken = (await response.json()).token;
  });

  test('Update user with valid data :: Manual', async ({ request }) => {
    console.log("authToken::",authToken);
    
    const userData = {
      profile: {
      age: 10,
      isStudent: false,
      education: { 
          degree: "Bachelor" 
          }
      },
      account: {
        email: "Jane.smith.williams@example.com"
      },
      updateReason: "Marriage name change",
      updatedFields: ["profile.name", "profile.age", "account.email"]
      };

    const response = await request.put(`${API_URL}/updateUser/5`, {
      data: userData,
      headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${authToken}`}
    });
  
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors).toBeDefined();
    console.log("body.errors",body.errors);
    const nameError = body.errors.find(error => error.msg === "Name is required");
    expect(nameError).toBeDefined();
    expect(nameError.msg).toBe("Name is required");
  });

  test('Update user with valid data :: Faker', async ({ request }) => {
    const fakeUser = generateFakeUserData.generateFakeUserDataForUpdate();
    
    const response = await request.put(`${API_URL}/updateUser/5`, {
      data: fakeUser,
      headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${authToken}`}
    });
      
      const responsejson = await response.json()
      const validate = ajv.compile(userResponseSchema2.userReqFailResponseForUpdateSchema);
      const valid = validate(responsejson);
  
      if (!valid) {
        console.error('AJV Validation Errors:',validate.errors);
      }
  
      expect(valid).toBe(true);
      expect(responsejson.profile.name).toBe(fakeUser.profile.name);
      expect(responsejson.account.email).toBe(fakeUser.account.email);
  });

  test('Create user validation failures : with manual change data', async ({ request }) => {
    const fakeUser = generateFakeUserData.generateFakeUserDataForUpdate();
    fakeUser.profile.name = "n";
    fakeUser.profile.age = 0;

    const response = await request.put(`${API_URL}/updateUser/5`, {
      data: fakeUser,
      headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${authToken}`}
    });
      
      const responsejson = await response.json()
      responsejson.errors.forEach(error => {
        console.log("----",error.msg,"----");
      });
      
      const validate = ajv.compile(userResponseSchema2.userReqFailResponseForUpdateSchema);
      const valid = validate(responsejson);
  
      if (!valid) {
        console.error('AJV Validation Errors:',validate.errors);
        validate.errors.forEach(error => {
          console.log("----",error.message,"----");
        });
      }

  });

});