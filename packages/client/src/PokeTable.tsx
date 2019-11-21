import { useQuery } from '@apollo/react-hooks'
import { Button, Input, Table, Tag, Typography, Row, Col } from 'antd'
import { PaginationConfig } from 'antd/lib/pagination'
import Scroller from 'react-infinite-scroller'
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
    query($name: String, $types: [String], $limit: Int, $after: ID) {
        pokemonsTypes
        pokemons(q: $name, types: $types, after: $after, limit: $limit) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    name
                    url
                    types
                    classification
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

const limit = 50
const PokeTable = forwardRef<HTMLDivElement, Props>(
    ({ className, ...props }, ref) => {
        const [name, setName] = useState<string | undefined>()
        const [types, setTypes] = useState<string[]>([])
        const [after, setAfter] = useState<string | undefined>()
        const [, setFilterOpened] = useState<boolean>(false)
        const [dataSource, setDataSource] = useState<Pokemon[]>([])

        const { loading, error, data } = useQuery(POKEMONS, {
            variables: { name, types, limit, after },
            onCompleted: d => {
                setDataSource(
                    dataSource.concat(d.pokemons.edges.map(e => e.node))
                )
            }
        })

        const handleChange: OnTableChange<Pokemon> = useCallback(
            (_pagination, filters) => (
                setDataSource([]),
                filters.name && setName(filters.name[0]),
                filters.types && setTypes(filters.types),
                setAfter(undefined)
            ),
            []
        )

        const handleSearch = useCallback(
            ({ target: { value } }) => (setDataSource([]), setName(value)),
            []
        )

        const renderSearch = useCallback(
            ({
                setSelectedKeys,
                selectedKeys: _,
                confirm,
                clearFilters
            }: FilterDropdownProps) => {
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

        return (
            <div ref={ref} className={className}>
                <Scroller
                    initialLoad
                    pageStart={0}
                    loadMore={() => {
                        setAfter(data.pokemons.pageInfo.endCursor)
                    }}
                    hasMore={!loading && data.pokemons.pageInfo.hasNextPage}
                    useWindow={false}
                >
                    <Table
                        {...props}
                        loading={loading}
                        dataSource={dataSource}
                        rowKey='id'
                        onChange={handleChange}
                        pagination={false}
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
                                            color={
                                                mapColorType[t.toLowerCase()]
                                            }
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
                </Scroller>
            </div>
        )
    }
)
const StyledPokeTable = styled(PokeTable)`
    overflow-y: auto;
`
export default StyledPokeTable
