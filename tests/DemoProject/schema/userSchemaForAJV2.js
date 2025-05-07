const userSuccessResponseSchema = {
  type: 'object',
  required: ['id', 'profile', 'account', 'status', 'metadata'],
  properties: {
    id: { type: 'string', format: 'uuid' },

    profile: {
      type: 'object',
      required: ['name', 'age', 'isStudent'],
      properties: {
        name: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        age: {
          type: 'integer',
          minimum: 18
        },
        isStudent: {
          type: 'boolean'
        },
        education: {
          type: 'object',
          properties: {
            degree: { type: 'string' }
          },
          required: []
        }
      },
      allOf: [
        {
          if: {
            properties: {
              isStudent: { const: true }
            },
            required: ['isStudent']
          },
          then: {
            properties: {
              education: {
                type: 'object',
                required: ['degree'],
                properties: {
                  degree: { type: 'string', minLength: 1 }
                }
              }
            }
          }
        }
      ]
    },

    account: {
      type: 'object',
      required: ['email', 'password', 'confirmPassword'],
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        password: {
          type: 'string',
          minLength: 8,
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$'
        },
        confirmPassword: {
          type: 'string',
          // const: { $data: 'password' }
        }
      }
    },

    status: {
      type: 'string',
      enum: ['active', 'pending', 'inactive']
    },

    metadata: {
      type: 'object',
      required: ['signupSource'],
      properties: {
        signupSource: {
          type: 'string',
          enum: ['web', 'mobile', 'api']
        }
      }
    }
  }
};


const userReqFailResponseSchema = {
  type: 'object',
  required: ['profile', 'account', 'metadata'],
  properties: {
    profile: {
      type: 'object',
      required: ['name', 'age', 'isStudent'],
      properties: {
        name: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        age: {
          type: 'integer',
          minimum: 18
        },
        isStudent: {
          type: 'boolean'
        },
        education: {
          type: 'object',
          properties: {
            degree: { type: 'string', minLength: 1 }
          },
          required: []
        }
      },
      allOf: [
        {
          if: {
            properties: {
              isStudent: { const: true }
            },
            required: ['isStudent']
          },
          then: {
            required: ['education'],
            properties: {
              education: {
                type: 'object',
                required: ['degree'],
                properties: {
                  degree: { type: 'string', minLength: 1 }
                },
                errorMessage: {
                  required: {
                    degree: 'Degree is required for students'
                  }
                }
              }
            }
          }
        }
      ],
      errorMessage: {
        properties: {
          name: 'Must be between 2-50 characters',
          age: 'Must be at least 18 years old',
          isStudent: 'Must be a boolean value'
        }
      }
    },

    account: {
      type: 'object',
      required: ['email', 'password', 'confirmPassword'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          errorMessage: {
            type: 'Email must be a string',
            format: 'Valid email is required'
          }
        },
        password: {
          type: 'string',
          minLength: 8,
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$'
        },
        confirmPassword: {
          type: 'string',
          const: { $data: '1/password' },
        errorMessage: {
          const: 'Passwords do not match'
        }
        }
      }
    },

    metadata: {
      type: 'object',
      required: ['signupSource'],
      properties: {
        signupSource: {
          type: 'string',
          enum: ['web', 'mobile', 'api']
        }
      }
    }
  }
};

module.exports = {
  userSuccessResponseSchema,
  userReqFailResponseSchema
}