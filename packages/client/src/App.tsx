import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const EXCHANGE_RATES = gql`
    {
        pokemons(q: "bu") {
            edges {
                node {
                    name
                    url
                }
            }
        }
    }
`

interface Props {}
const App: FunctionComponent<Props> = () => {
    const { loading, error, data } = useQuery(EXCHANGE_RATES)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return data.pokemons.edges.map(({ node: { name } }) => <div>{name}</div>)
}
const StyledApp = styled(App)``
export default StyledApp
