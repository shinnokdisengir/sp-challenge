import { useQuery } from '@apollo/react-hooks'
import { Button, Input, Table, Tag, Typography, Row, Col } from 'antd'
import { PaginationConfig } from 'antd/lib/pagination'
import {
    SorterResult,
    TableCurrentDataSource,
    TableProps,
    WithStore,
    FilterDropdownProps
} from 'antd/lib/table'
import { gql } from 'apollo-boost'
import React, { forwardRef, useCallback, useState } from 'react'
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
    query($name: String, $types: [String]) {
        pokemonsTypes
        pokemons(q: $name, types: $types) {
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
type OnTableChange<T> = (
    pagination: PaginationConfig,
    filters: Record<keyof T, string[]>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>
) => void

const PokeTable = forwardRef<Table<Pokemon>, Props>(
    ({ className, ...props }, ref) => {
        const [name, setName] = useState<string | undefined>()
        const [types, setTypes] = useState<string[]>([])
        const [, setFilterOpened] = useState<boolean>(false)

        const { loading, error, data } = useQuery(POKEMONS, {
            variables: { name, types }
        })

        const handleChange: OnTableChange<Pokemon> = useCallback(
            (pagination, filters, sorter, extra) => {
                if (filters.name) setName(filters.name[0])
                if (filters.types) setTypes(filters.types)
            },
            []
        )

        const handleSearch = useCallback(
            ({ target: { value } }) => setName(value),
            []
        )

        const renderSearch = useCallback(
            ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters
            }: FilterDropdownProps) => {
                console.log('setS :', selectedKeys)
                return (
                    // Is out of DOM PokeTable's ownership
                    <Row type='flex' gutter={8} style={{ padding: 8 }}>
                        <Col>
                            <Input value={name} onChange={handleSearch} />
                        </Col>
                        <Col>
                            <Button
                                type='primary'
                                onClick={() => (
                                    setSelectedKeys &&
                                        setSelectedKeys(name ? [name] : []),
                                    confirm && confirm()
                                )}
                            >
                                Close
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => (
                                    setName(undefined),
                                    clearFilters && clearFilters()
                                )}
                            >
                                Clear
                            </Button>
                        </Col>
                    </Row>
                )
            },
            [handleSearch, name]
        )

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
                onChange={handleChange}
            >
                <Column<Pokemon>
                    title='Name'
                    key='name'
                    dataIndex='name'
                    ellipsis
                    filterDropdown={renderSearch}
                    onFilterDropdownVisibleChange={setFilterOpened}
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
