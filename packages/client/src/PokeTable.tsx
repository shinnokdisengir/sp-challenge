import { useQuery } from '@apollo/react-hooks'
import { Table, Tag, Typography } from 'antd'
import {
    TableProps,
    WithStore,
    PaginationConfig,
    SorterResult,
    TableCurrentDataSource
} from 'antd/lib/table'
import { gql } from 'apollo-boost'
import React, { forwardRef, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Pokemon } from './models'

const { Column } = Table
const { Text } = Typography

type OnTableChange = <T>(
    pagination: PaginationConfig,
    filters: Record<keyof T, string[]>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>
) => void

const mapColorType = {
    grass: 'green',
    flying: 'geekblue',
    ice: 'cyan',
    poison: 'lime',
    psychic: 'purple',
    electric: 'geekblue',
    rock: 'magenta',
    water: 'blue',
    fire: 'red',
    dragon: 'volcano',
    ground: 'orange',
    fairy: 'gold',
    bug: 'green'
}

const POKEMONS = gql`
    query Pokemons($q: String, $types: [String]) {
        pokemonsTypes
        pokemons(q: $q, types: $types) {
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
        const [q, setQ] = useState<string | undefined>()
        const [types, setTypes] = useState<Array<string>>([])
        const { loading, error, data, fetchMore } = useQuery(POKEMONS, {
            variables: { q, types }
        })

        const handleChange: OnTableChange = useCallback(
            (
                pagination,
                filters: { q?: string; types?: string[] },
                sorter,
                extra
            ) => {
                console.log(
                    'pagination, filters, sorter, extra',
                    pagination,
                    filters,
                    sorter,
                    extra
                )
                if (filters.q) setQ(filters.q)
                if (filters.types) setTypes(filters.types)
            },
            []
        )

        console.log('data', data)

        if (error) return <p>Error :(</p>
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
                onChange={handleChange}
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
