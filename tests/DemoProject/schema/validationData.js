const userCreateDataForValidation = [
    {
      field: 'profile.name',
      invalidValue: 'n',
      expectedError: 'Must be between 2-50 characters'
    },
    {
      field: 'profile.age',
      invalidValue: 2,
      expectedError: 'Must be at least 18 years old'
    }
    ,
    {
      field: 'account.email',
      invalidValue: 'www',
      expectedError: 'Valid email is required'
    }
  ];
  

function setNestedField(obj, path, value) {
const keys = path.split('.');
let curr = obj;
while (keys.length > 1) {
    const key = keys.shift();
    if (!curr[key]) curr[key] = {};
    curr = curr[key];
}
curr[keys[0]] = value;
}

module.exports = {
    setNestedField,
    userCreateDataForValidation
};
