import { IResolvers } from 'graphql-tools'
import * as pokemons from './models/pokemons'

export const resolvers: IResolvers = {
    Query: {
        pokemons: (_source, args) => pokemons.query(args),
        pokemonsTypes: (_source, _args) => pokemons.getTypes()
        // Not needed
        // pokemonsByType: (_source, args) => pokemons.query(args),
    }
}
