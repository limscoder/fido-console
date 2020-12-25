import React from 'react'
import styled from 'styled-components'
import Icon from './Icon'

const $Error = styled.span`
    color: #ff4a4a;
`

interface ErrorProps {
    showIcon?: boolean
    children?: React.ReactNode
}

export default function Error(props: ErrorProps) {
    if (props.showIcon) {
        return <$Error><Icon id="fail" />&nbsp;{ props.children }</$Error>
    }
    return <$Error>{ props.children }</$Error>
}
