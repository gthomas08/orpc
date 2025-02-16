import type { InferContractRouterInputs, InferContractRouterOutputs } from '@orpc/contract'
import { oc } from '@orpc/contract'
import { implement, ORPCError } from '@orpc/server'
import { oz, ZodAutoCoercePlugin } from '@orpc/zod'
import { z } from 'zod'

// Define your contract first
// This contract can replace server router in most-case

export const contract = oc.router({
  getUser: oc
    .route({
      path: '/{id}',
      method: 'GET',
    })
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(
      z.object({
        username: z.string(),
        avatar: z.string(),
      }),
    ),

  posts: oc.prefix('/posts').router({
    getPost: oc
      .route({
        path: '/{id}',
        method: 'GET',
      })
      .input(
        z.object({
          id: z.string(),
        }),
      )
      .output(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
        }),
      ),

    createPost: oc
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          thumb: oz.file().type('image/*'),
        }),
      )
      .output(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
        }),
      ),
  }),
})

export type Inputs = InferContractRouterInputs<typeof contract>
export type Outputs = InferContractRouterOutputs<typeof contract>

// Implement the contract

export type Context = { user?: { id: string } }
export const base = implement(contract).$context<Context>()
export const pub = base
export const authed = base
  .use(({ context, path, next }, input) => {
    /** put auth logic here */
    return next({})
  })

export const router = pub.router({
  getUser: pub.getUser.handler(({ input, context }) => {
    return {
      username: `user_${input.id}`,
      avatar: `avatar_${input.id}.png`,
    }
  }),

  posts: {
    getPost: pub.posts.getPost
      .use(async ({ context, path, next }, input) => {
        if (!context.user) {
          throw new ORPCError('UNAUTHORIZED')
        }

        const result = await next({
          context: {
            user: context.user, // from now user not undefined-able
          },
        })

        const _output = result.output // do something on success

        return result
      })
      .handler(({ input, context }) => {
        return {
          id: 'example',
          title: 'example',
          description: 'example',
        }
      }),

    createPost: authed.posts.createPost.handler(({ input, context }) => {
      return {
        id: 'example',
        title: input.title,
        description: input.description,
      }
    }),
  },
})

// Modern runtime that support fetch api like deno, bun, cloudflare workers, even node can used
import { createServer } from 'node:http'
import { OpenAPIHandler } from '@orpc/openapi/node'

const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    new ZodAutoCoercePlugin(),
  ],
})

const server = createServer((req, res) => {
  if (req.url?.startsWith('/api')) {
    return openAPIHandler.handle(req, res, {
      context: {},
      prefix: '/api',
    })
  }

  res.statusCode = 404
  res.end('Not found')
},
)

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is available at http://localhost:3000')
})

//
//
