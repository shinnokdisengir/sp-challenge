import { useQuery } from '@apollo/react-hooks'
import { Table, Tag, Typography } from 'antd'
import { TableProps, WithStore } from 'antd/lib/table'
import { gql } from 'apollo-boost'
import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Pokemon } from './models'

const { Column } = Table
const { Text } = Typography

const mapColorType = {
    grass: 'green',
    flying: 'geekblue',
    poison: 'lime',
    bug: 'purple',
    electric: 'cyan',
    rock: 'magenta',
    water: 'blue'
}

const POKEMONS = gql`
    {
        pokemonsTypes
        pokemons(q: "bu") {
            edges {
                node {
                    id
                    name
                    url
                    types
                }
            }
        }
    }
`

interface Props extends Omit<TableProps<Pokemon>, keyof WithStore> {}

const PokeTable = forwardRef<Table<Pokemon>, Props>(
    ({ className, ...props }, ref) => {
        const { loading, error, data } = useQuery(POKEMONS)
        if (error) return <p>Error :(</p>

        console.log('data', data)

        const dataSource: Array<Pokemon> = !loading
            ? data.pokemons.edges.map(e => e.node)
            : []

        return (
            <Table
                {...props}
                ref={ref}
                className={className}
                loading={loading}
                dataSource={dataSource}
                rowKey='id'
            >
                <Column<Pokemon>
                    title='Name'
                    key='name'
                    dataIndex='name'
                    ellipsis
                    // filterDropdown={({
                    //     setSelectedKeys,
                    //     selectedKeys,
                    //     confirm,
                    //     clearFilters
                    // }) => (
                    //     <FilterDropdownNumber
                    //         placeholder={'ADM_STR_SEARCH_COMPETITION_ID'}
                    //         setSelectedKeys={setSelectedKeys}
                    //         selectedKeys={selectedKeys}
                    //         confirm={confirm}
                    //         clearFilters={clearFilters}
                    //         onSearch={handleSearch}
                    //         onReset={handleReset}
                    //         visible={filtername}
                    //     />
                    // )}
                    // onFilterDropdownVisibleChange={setFiltername}
                    render={name => <Text strong>{name}</Text>}
                />
                <Column<Pokemon>
                    title='Types'
                    key='types'
                    dataIndex='types'
                    filters={
                        data &&
                        data.pokemonsTypes.map(t => ({
                            text: t,
                            value: t
                        }))
                    }
                    filterMultiple
                    render={types => (
                        <>
                            {types.map(t => (
                                <Tag
                                    color={mapColorType[t.toLowerCase()]}
                                    key={t}
                                >
                                    {t}
                                </Tag>
                            ))}
                        </>
                    )}
                />
                <Column<Pokemon>
                    title='Classification'
                    key='classification'
                    dataIndex='classification'
                    ellipsis
                    render={classification => classification}
                />
            </Table>
        )
    }
)
const StyledPokeTable = styled(PokeTable)``
export default StyledPokeTable
