const useResponseSchema = {
    type: 'object',
    required: ['id', 'profile', 'account', 'status'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      profile: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      },
      account: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      },
      status: {
        type: 'string',
        enum: ['active', 'pending', 'inactive']
      }
    }
  }

  
module.exports = {
    useResponseSchema,
}