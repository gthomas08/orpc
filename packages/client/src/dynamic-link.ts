import type { ClientOptions } from '@orpc/contract'
import type { Promisable } from '@orpc/shared'
import type { ClientLink } from './types'

/**
 * DynamicLink provides a way to dynamically resolve and delegate calls to other ClientLinks
 * based on the request path, input, and context.
 */
export class DynamicLink<TClientContext> implements ClientLink<TClientContext> {
  constructor(
    private readonly linkResolver: (
      path: readonly string[],
      input: unknown,
      context: TClientContext,
    ) => Promisable<ClientLink<TClientContext>>,
  ) {
  }

  async call(path: readonly string[], input: unknown, options: ClientOptions<TClientContext>): Promise<unknown> {
    // Since the context is only optional when the context is undefinable, we can safely cast it
    const resolvedLink = await this.linkResolver(path, input, options.context as TClientContext)

    const output = await resolvedLink.call(path, input, options)

    return output
  }
}
