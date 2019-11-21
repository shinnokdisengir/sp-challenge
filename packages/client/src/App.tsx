import React, { FunctionComponent, HTMLProps } from 'react'
import Background from './Background'
import PokeTable from './PokeTable'
import styled from 'styled-components'

interface Props extends HTMLProps<HTMLDivElement> {}
const App: FunctionComponent<Props> = ({ className }) => {
    return (
        <div className={className}>
            <Background className='background' />
            <div className='table-container'>
                <PokeTable className='table' />
            </div>
        </div>
    )
}
const StyledApp = styled(App)`
    position: relative;
    background-color: #03a9f4;

    &,
    .background {
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
    }

    .background {
        position: absolute;
    }
    .table-container {
        position: relative;
        display: flex;
        width: 50%;
        height: 640px;
        left: 25%;
        top: calc(50% - 320px);
        border: 4px solid #03a9f4;
        background-color: white;
        padding-bottom: 32px;
        .table {
            flex: 1;
        }
    }
`
export default StyledApp
