# TS Prove

A lightweight decoding and validation library.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Pingid/ts-prove/CI)](https://github.com/Pingid/ts-prove/actions)
[![Coverage Status](https://coveralls.io/repos/github/Pingid/ts-prove/badge.svg?branch=master)](https://coveralls.io/github/Pingid/ts-prove?branch=master)

## install

```
npm install ts-prove
yarn add ts-prove
```

## use

The library provides a set of composable functions for typesafe schema validation and data decoding. The decoders or 'proofs' that are provided by the library also return structured error outputs which can be harnessed for message validation in, for example, serverside request handlers.

## basic

In the example below, we construct a 'proof' for the type `Person<{ name: string, age: number }>`. This proof is a callback which accepts some unknown/ambiguous data and returns either `Failure<[string, unknown]>` or `Success<[null, { name: string, age: number }]>`

```ts
import P from 'ts-prove'

const person = P.shape({ name: P.string, age: P.number })

person({ name: 'Dug', age: '10' }) // ["{ age: expected number }", unknown]
person({ name: 'Dug', age: 10 }) // [null, { name: string, age: number ]
```

We can also derive the typescript type
```ts
import { ProofType } from 'ts-prove'

type Person = ProofType<typeof person>
// { name: string, age: number }
```

Here is an example of how this can be used in a route handler to safely infer the type of some POST data.

```ts
function addPerson(p: { name: string, age: number }) => ...;

export const createPerson = (req) => {
  const data = person(req.body)
  if (isFailure(data)) return req.send({ status: 500, body: data[0] })
  return addPerson(data[1])
}
```

## validation

Every proof can also be provided with a callback `(x: unknown) => string | true` which can be used to further validate a payload. When provided with a callback a proof will return another instance of itself allowing you to chain as many callbacks as you want.

```ts
const teenage = P.number((x) => x > 10 || 'To young')((x) => x < 19 || 'To old')

teenage(9) // ['To young', unknown]
teenage(20) // ['To old', unknown]
teenage(13) // [null, number]

// This could then be used in a structured proof
const teenager = P.shape({ name: p.string, age: teenage })
```

The object `P` provides proofs for all javascript primitives as well as `P.shape({ key: Proof })`, `P.array(Proof)` and, P.or(...args: Proof)`.

## advanced

`P` is also a function which can be used to build more complex decoders by allowing you to provide the return value as a type argument. Here is an example of how a couple of library functions are implemented.

```ts
import P, { isFailure, Proof } from 'ts-prove'

P.string = P<string>((x) => typeof x === 'string` || 'expected string')

P.or = <T extends Proof[]>(...proofs: T) =>
  P<ProofType<T[number]>>((value) =>
    proofs.reduce<Valid>(
      (a, prf) => (a === true ? a : isFailure(prf(value)) ? a : true) as any,
      'value did not match a proof'
    )
  )
```

## help

This library is still very young and needs helping hands and minds. If you have any thoughts, questions or inspiration an issue or pull request is always appreciated.

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
