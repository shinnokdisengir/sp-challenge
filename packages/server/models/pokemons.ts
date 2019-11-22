import * as A from 'fp-ts/lib/Array'
import { identity } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { tryCatch } from 'fp-ts/lib/TaskEither'
import { data } from '../data/pokemons'
import { slice, toConnection } from '../functions'
import { Connection } from '../types'
import intersectionBy from 'lodash/intersectionBy'
import lowerCase from 'lodash/lowerCase'
import keys from 'lodash/keys'

export interface Pokemon {
    id: string
    name: string
    classification: string
    types: string[]
    url?: string
}

const SIZE = 10

export function query(args: {
    after?: string
    limit?: number
    q?: string
    types?: string[]
}): Connection<Pokemon> {
    const { after, q, types = [], limit = SIZE } = args

    const filterByQ: (as: Pokemon[]) => Pokemon[] =
        // filter only if q is defined
        q === undefined
            ? identity
            : A.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))

    const filterByTypes: (as: Pokemon[]) => Pokemon[] = types.length
        ? A.filter(p => intersectionBy(p.types, types, lowerCase).length > 0)
        : identity

    const sliceByAfter: (as: Pokemon[]) => Pokemon[] =
        // filter only if q is defined
        after === undefined
            ? identity
            : as =>
                  pipe(
                      as,
                      A.findIndex(a => a.id === after),
                      O.map(a => a + 1),
                      O.fold(
                          () => as,
                          idx => as.slice(idx)
                      )
                  )
    // TODO get images from https://pokeapi.co/api/v2/pokemon/{name}/
    // const addImageTask = tryCatch<Error, Pokemon>(
    //     async () => JSON.parse('{"name": "Ciccio"}'),
    //     reason => new Error(String(reason))
    // )

    const results: Pokemon[] = pipe(
        data,
        filterByQ,
        filterByTypes,
        sliceByAfter,
        // slicing limit + 1 because the `toConnection` function should known the connection size to determine if there are more results
        slice(0, limit + 1)
        // addImageTask,
    )

    return toConnection(results, limit)
}

export function getTypes(): string[] {
    return keys(
        data.reduce(
            (a, e) => ({
                ...a,
                ...e.types.reduce((a, t) => ({ ...a, [t]: true }), {})
            }),
            {}
        )
    )
}
