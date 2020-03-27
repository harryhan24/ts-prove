import {
  toString,
  isString,
  isUndefined,
  isNumber,
  isBoolean,
  isNull,
  isFunction,
  isShape,
  isArray,
} from './utils'

const types = [
  'string',
  10,
  undefined,
  null,
  { one: 'foobar' },
  ['foobar'],
  true,
  false,
  () => null,
]

test('Checking native types', () => {
  expect(isString('string')).toBe(true)
  types.filter((x) => x !== 'string').forEach((x) => expect(isString(x)).toBe(false))

  expect(isNumber(10)).toBe(true)
  types.filter((x) => x !== 10).forEach((x) => expect(isNumber(x)).toBe(false))

  expect(isBoolean(false)).toBe(true)
  expect(isBoolean(true)).toBe(true)
  types.filter((x) => x !== true && x !== false).forEach((x) => expect(isBoolean(x)).toBe(false))

  expect(isNull(null)).toBe(true)
  types.filter((x) => x !== null).forEach((x) => expect(isNull(x)).toBe(false))

  expect(isUndefined(undefined)).toBe(true)
  types.filter((x) => x !== undefined).forEach((x) => expect(isUndefined(x)).toBe(false))

  expect(isFunction(() => null)).toBe(true)
  types.filter((x) => typeof x !== 'function').forEach((x) => expect(isFunction(x)).toBe(false))

  expect(isShape({})).toBe(true)
  types.filter((x) => !(x && (x as any).one)).forEach((x) => expect(isShape(x)).toBe(false))

  expect(isArray([])).toBe(true)
  types
    .filter((x) => !(x && (x as any)[0] === 'foobar'))
    .forEach((x) => expect(isArray(x)).toBe(false))
})

test('toString', () => {
  expect(toString(10)).toBe('10')
  expect(toString(null)).toBe('null')
  expect(toString(undefined)).toBe('undefined')
  expect(toString('10')).toBe('10')
  expect(toString({ one: 'fooobar' })).toBe(`{\n  one: fooobar\n}`)
})
