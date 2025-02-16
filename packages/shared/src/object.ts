import { isPlainObject } from 'is-what'

export type Segment = string | number

export function set(
  root: unknown,
  segments: Readonly<Segment[]>,
  value: unknown,
): unknown {
  const ref = { root }

  let currentRef: any = ref
  let preSegment: string | number = 'root'

  for (const segment of segments) {
    currentRef = currentRef[preSegment]
    preSegment = segment
  }

  currentRef[preSegment] = value

  return ref.root
}

export function get(
  root: Readonly<Record<string, unknown> | unknown[]>,
  segments: Readonly<Segment[]>,
): unknown {
  const ref = { root }

  let currentRef: any = ref
  let preSegment: string | number = 'root'

  for (const segment of segments) {
    if (
      (typeof currentRef !== 'object' && typeof currentRef !== 'function')
      || currentRef === null
    ) {
      return undefined
    }

    currentRef = currentRef[preSegment]
    preSegment = segment
  }

  if (
    (typeof currentRef !== 'object' && typeof currentRef !== 'function')
    || currentRef === null
  ) {
    return undefined
  }

  return currentRef[preSegment]
}

export function findDeepMatches(
  check: (value: unknown) => boolean,
  payload: unknown,
  segments: Segment[] = [],
  maps: Segment[][] = [],
  values: unknown[] = [],
): { maps: Segment[][], values: unknown[] } {
  if (check(payload)) {
    maps.push(segments)
    values.push(payload)
  }
  else if (Array.isArray(payload)) {
    payload.forEach((v, i) => {
      findDeepMatches(check, v, [...segments, i], maps, values)
    })
  }
  else if (isPlainObject(payload)) {
    for (const key in payload) {
      findDeepMatches(check, payload[key], [...segments, key], maps, values)
    }
  }

  return { maps, values }
}
