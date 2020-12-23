import React from 'react'
import styled from 'styled-components'

const $Highlight = styled.span`
    color: #61dafb;
`

export default function Highlight(props: {children?: React.ReactNode}) {
    return <$Highlight>{ props.children }</$Highlight>
}
