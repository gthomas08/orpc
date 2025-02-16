import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod'
import { contract } from 'examples/contract'
import { router } from 'examples/server'

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [
    new ZodToJsonSchemaConverter(),
  ],
})

export const specFromServerRouter = await openAPIGenerator.generate(router, {
  info: {
    title: 'My App',
    version: '0.0.0',
  },
})

export const specFromContractRouter = await openAPIGenerator.generate(contract, {
  info: {
    title: 'My App',
    version: '0.0.0',
  },
})

const _exampleSpec = {
  info: {
    title: 'My App',
    version: '0.0.0',
  },
  openapi: '3.1.0',
  paths: {
    '/users': {
      get: {
        operationId: 'user.get',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                },
                required: ['id'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: {
                      type: 'string',
                    },
                    avatar: {
                      type: 'string',
                    },
                  },
                  required: ['username', 'avatar'],
                },
              },
            },
          },
        },
      },
    },
    '/posts/{id}': {
      get: {
        operationId: 'post.get',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    title: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                  },
                  required: ['id', 'title', 'description'],
                },
              },
            },
          },
        },
      },
    },
    '/post/create': {
      post: {
        operationId: 'post.create',
        requestBody: {
          required: false,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  thumb: {
                    type: 'string',
                    contentMediaType: 'image/*',
                  },
                },
                required: ['title', 'description', 'thumb'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    title: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                  },
                  required: ['id', 'title', 'description'],
                },
              },
            },
          },
        },
      },
    },
  },
}

//
//
