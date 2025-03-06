import type { JSONSchema } from '@orpc/openapi'
import type { input, output, ZodTypeAny, ZodTypeDef } from 'zod'

const CUSTOM_JSON_SCHEMA_SYMBOL = Symbol('ORPC_CUSTOM_JSON_SCHEMA')
const CUSTOM_JSON_SCHEMA_INPUT_SYMBOL = Symbol('ORPC_CUSTOM_JSON_SCHEMA_INPUT')
const CUSTOM_JSON_SCHEMA_OUTPUT_SYMBOL = Symbol('ORPC_CUSTOM_JSON_SCHEMA_OUTPUT')

export function getCustomJsonSchema(
  def: ZodTypeDef,
  strategy: 'input' | 'output' | 'both',
): Exclude<JSONSchema, boolean> | undefined {
  if (strategy === 'input' && CUSTOM_JSON_SCHEMA_INPUT_SYMBOL in def) {
    return def[CUSTOM_JSON_SCHEMA_INPUT_SYMBOL] as Exclude<JSONSchema, boolean>
  }

  if (strategy === 'output' && CUSTOM_JSON_SCHEMA_OUTPUT_SYMBOL in def) {
    return def[CUSTOM_JSON_SCHEMA_OUTPUT_SYMBOL] as Exclude<JSONSchema, boolean>
  }

  if (CUSTOM_JSON_SCHEMA_SYMBOL in def) {
    return def[CUSTOM_JSON_SCHEMA_SYMBOL] as Exclude<JSONSchema, boolean>
  }

  return undefined
}

export function customJsonSchema<
  T extends ZodTypeAny,
  TStrategy extends 'input' | 'output' | 'both' = 'both',
>(
  schema: T,
  custom: Exclude<
    JSONSchema<
      TStrategy extends 'input'
        ? input<T>
        : TStrategy extends 'output'
          ? output<T>
          : input<T> & output<T>
    >,
    boolean
  >,
  strategy?: TStrategy,
): T {
  const SYMBOL = strategy === 'input'
    ? CUSTOM_JSON_SCHEMA_INPUT_SYMBOL
    : strategy === 'output'
      ? CUSTOM_JSON_SCHEMA_OUTPUT_SYMBOL
      : CUSTOM_JSON_SCHEMA_SYMBOL

  const This = (schema as any).constructor
  const newSchema = new This({
    ...schema._def,
    [SYMBOL]: custom,
  })

  return newSchema
}
