// utils/generateFakeUser.js
const { faker } = require('@faker-js/faker');

function generateFakeUserData() {
  const isStudent = faker.datatype.boolean();

  return {
    profile: {
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 99 }),
      isStudent,
      education: isStudent
    ? {
        degree: faker.helpers.arrayElement(['Bachelor', 'Master', 'PhD', 'Diploma']),
        institution: faker.company.name()
      }
    : {
        // optionally include education with non-required fields, or omit entirely if not needed
        institution: faker.company.name()
      }
    },
    account: {
      email: faker.internet.email(),
      password: 'Abc1234@#',
      confirmPassword: 'Abc1234@#'
    },
    metadata: {
      signupSource: faker.helpers.arrayElement(['web', 'mobile', 'api']),
      acceptTerms: true,
      registrationDate: new Date().toISOString()
    }
  };
}

function generateFakeUserDataForUpdate() {
  const isStudent = faker.datatype.boolean();

  return {
    profile: {
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 99 }),
      isStudent,
      education: isStudent
    ? {
        degree: faker.helpers.arrayElement(['Bachelor', 'Master', 'PhD', 'Diploma']),
        institution: faker.company.name()
      }
    : {
        // optionally include education with non-required fields, or omit entirely if not needed
        institution: faker.company.name()
      }
    },
    account: {
      email: faker.internet.email(),
      password: 'Abc1234@#',
      confirmPassword: 'Abc1234@#'
    },
    metadata: {
      signupSource: faker.helpers.arrayElement(['web', 'mobile', 'api']),
      acceptTerms: true,
      registrationDate: new Date().toISOString()
    }
  };
}

module.exports = {
  generateFakeUserData,
  generateFakeUserDataForUpdate
};
