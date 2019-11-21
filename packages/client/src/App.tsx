import React, { FunctionComponent } from 'react'
import PokeTable from './PokeTable'
import styled from 'styled-components'

interface Props {}
const App: FunctionComponent<Props> = () => {
    return <PokeTable />
}
const StyledApp = styled(App)``
export default StyledApp
