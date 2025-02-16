import type { ContractRouterClient } from '@orpc/contract'
import type { RouterClient } from '@orpc/server'
import type { GeneralUtils } from './utils-general'
import type { ProcedureUtils } from './utils-procedure'
import { oc } from '@orpc/contract'
import { implement, os } from '@orpc/server'
import { z } from 'zod'
import { createGeneralUtils } from './utils-general'
import { createProcedureUtils } from './utils-procedure'
import { createRouterUtils } from './utils-router'

const pingContract = oc.input(z.object({ name: z.string() })).output(z.string())
const pongContract = oc.input(z.number()).output(z.string())
const contractRouter = oc.router({
  ping: pingContract,
  pong: pongContract,
})

const ping = implement(pingContract).handler(({ input }) => `ping ${input.name}`).callable()
const pong = implement(pongContract).handler(num => `pong ${num}`).callable()

const router = implement(contractRouter).router({
  ping,
  pong: os.lazy(() => Promise.resolve({ default: pong })),
})

describe('with contract router', () => {
  it('build correct types', () => {
    const utils = createRouterUtils({} as ContractRouterClient<typeof contractRouter, unknown>)

    const generalUtils = createGeneralUtils([])
    const pingUtils = createProcedureUtils(ping, [])
    const pingGeneralUtils = createGeneralUtils<{ name: string }>(['ping'])
    const pongUtils = createProcedureUtils(pong, [])
    const pongGeneralUtils = createGeneralUtils<number>(['ping'])

    expectTypeOf(utils).toMatchTypeOf<typeof generalUtils>()
    expectTypeOf(utils.ping).toMatchTypeOf<typeof pingUtils>()
    expectTypeOf(utils.ping).toMatchTypeOf<typeof pingGeneralUtils>()
    expectTypeOf(utils.pong).toMatchTypeOf<typeof pongUtils>()
    expectTypeOf(utils.pong).toMatchTypeOf<typeof pongGeneralUtils>()
  })
})

describe('with  router', () => {
  it('build correct types', () => {
    const utils = createRouterUtils({} as RouterClient<typeof router, unknown>)

    const generalUtils = createGeneralUtils([])
    const pingUtils = createProcedureUtils(ping, [])
    const pingGeneralUtils = createGeneralUtils<{ name: string }>(['ping'])
    const pongUtils = createProcedureUtils(pong, [])
    const pongGeneralUtils = createGeneralUtils<number>(['ping'])

    expectTypeOf(utils).toMatchTypeOf<typeof generalUtils>()
    expectTypeOf(utils.ping).toMatchTypeOf<typeof pingUtils>()
    expectTypeOf(utils.ping).toMatchTypeOf<typeof pingGeneralUtils>()
    expectTypeOf(utils.pong).toMatchTypeOf<typeof pongUtils>()
    expectTypeOf(utils.pong).toMatchTypeOf<typeof pongGeneralUtils>()
  })
})

it('with client context', () => {
  const utils = createRouterUtils({} as RouterClient<typeof router, undefined | { batch?: boolean }>)

  const generalUtils = {} as GeneralUtils<unknown>
  const pingUtils = {} as ProcedureUtils<undefined | { batch?: boolean }, { name: string }, string, Error>
  const pingGeneralUtils = createGeneralUtils<{ name: string }>(['ping'])
  const pongUtils = {} as ProcedureUtils<undefined | { batch?: boolean }, number, string, Error>
  const pongGeneralUtils = {} as GeneralUtils<number>

  expectTypeOf(utils).toMatchTypeOf<typeof generalUtils>()
  expectTypeOf(utils.ping).toMatchTypeOf<typeof pingUtils>()
  expectTypeOf(utils.ping).toMatchTypeOf<typeof pingGeneralUtils>()
  expectTypeOf(utils.pong).toMatchTypeOf<typeof pongUtils>()
  expectTypeOf(utils.pong).toMatchTypeOf<typeof pongGeneralUtils>()
})
