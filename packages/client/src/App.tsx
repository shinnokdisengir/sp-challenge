import React, { FunctionComponent, HTMLProps } from 'react'
import PokeTable from './PokeTable'
import styled from 'styled-components'

interface Props extends HTMLProps<HTMLDivElement> {}
const App: FunctionComponent<Props> = ({ className }) => {
    return (
        <div className={className}>
            <PokeTable className='table' />
        </div>
    )
}
const StyledApp = styled(App)`
    padding: 16px;
    .table {
    }
`
export default StyledApp
